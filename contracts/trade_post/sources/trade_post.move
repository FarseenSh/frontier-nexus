/// Trade Post — Smart Storage Unit extension for Frontier Nexus
///
/// Turns any SSU into a decentralized marketplace where players can list items
/// at fixed prices and other players can buy them with SUI. Uses the typed
/// witness pattern (TradeAuth) to authorize deposits/withdrawals on the SSU.
///
/// Flow:
///   1. Owner publishes this package and gets TradePostAdminCap
///   2. Owner calls authorize_trade_post to register TradeAuth on their SSU
///   3. Owner calls create_listing to set prices for item types
///   4. Any player calls buy_item to purchase — pays SUI, receives items
module nexus::trade_post;

use sui::coin::{Self, Coin};
use sui::sui::SUI;
use sui::dynamic_field;
use sui::event;
use sui::clock::Clock;
use world::storage_unit::{Self, StorageUnit};
use world::access::OwnerCap;
use world::character::Character;


// === Error codes ===

const EInsufficientQuantity: u64 = 0;
const EInsufficientPayment: u64 = 1;
const EListingAlreadyExists: u64 = 2;
const EZeroQuantity: u64 = 3;
const EZeroPrice: u64 = 4;

// === Structs ===

/// Witness for SSU authorization — only this module can create instances
public struct TradeAuth has drop {}

/// Price listing stored as a dynamic field on TradePostConfig, keyed by type_id
public struct Listing has store, drop {
    type_id: u64,
    price_per_unit: u64,
    quantity_available: u32,
    seller_address: address,
}

/// Shared config object for a trade post
public struct TradePostConfig has key {
    id: UID,
    storage_unit_id: ID,
    trade_count: u64,
    total_volume: u64,
}

/// Admin capability — transferred to deployer at init
public struct TradePostAdminCap has key, store {
    id: UID,
}

// === Events ===

/// Emitted on every successful trade — dashboard indexes these
public struct TradeEvent has copy, drop {
    trade_post_id: ID,
    buyer: address,
    seller: address,
    type_id: u64,
    quantity: u32,
    total_price: u64,
    timestamp_ms: u64,
}

/// Emitted when a new listing is created
public struct ListingEvent has copy, drop {
    trade_post_id: ID,
    type_id: u64,
    price_per_unit: u64,
    quantity: u32,
}

// === Init ===

/// Called once at publish. Creates admin cap for the deployer.
fun init(ctx: &mut TxContext) {
    let admin_cap = TradePostAdminCap {
        id: object::new(ctx),
    };
    transfer::transfer(admin_cap, ctx.sender());
}

// === Admin functions ===

/// Register the TradeAuth witness type on an SSU. Must be called once by the
/// SSU owner before any trade operations. Creates the shared TradePostConfig.
public fun authorize_trade_post(
    storage_unit: &mut StorageUnit,
    owner_cap: &OwnerCap<StorageUnit>,
    ctx: &mut TxContext,
) {
    // Register our witness type on the SSU
    storage_unit::authorize_extension<TradeAuth>(storage_unit, owner_cap);

    // Create shared config object
    let config = TradePostConfig {
        id: object::new(ctx),
        storage_unit_id: object::id(storage_unit),
        trade_count: 0,
        total_volume: 0,
    };
    transfer::share_object(config);
}

/// Create a new listing for an item type. Only callable by admin.
public fun create_listing(
    config: &mut TradePostConfig,
    _admin: &TradePostAdminCap,
    type_id: u64,
    price_per_unit: u64,
    quantity: u32,
    ctx: &mut TxContext,
) {
    assert!(quantity > 0, EZeroQuantity);
    assert!(price_per_unit > 0, EZeroPrice);
    assert!(
        !dynamic_field::exists_(&config.id, type_id),
        EListingAlreadyExists,
    );

    let listing = Listing {
        type_id,
        price_per_unit,
        quantity_available: quantity,
        seller_address: ctx.sender(),
    };
    dynamic_field::add(&mut config.id, type_id, listing);

    event::emit(ListingEvent {
        trade_post_id: object::id(config),
        type_id,
        price_per_unit,
        quantity,
    });
}

/// Update an existing listing's price and/or quantity. Admin only.
public fun update_listing(
    config: &mut TradePostConfig,
    _admin: &TradePostAdminCap,
    type_id: u64,
    new_price_per_unit: u64,
    new_quantity: u32,
) {
    let listing: &mut Listing = dynamic_field::borrow_mut(
        &mut config.id,
        type_id,
    );
    listing.price_per_unit = new_price_per_unit;
    listing.quantity_available = new_quantity;
}

/// Remove a listing entirely. Admin only.
public fun remove_listing(
    config: &mut TradePostConfig,
    _admin: &TradePostAdminCap,
    type_id: u64,
) {
    let _listing: Listing = dynamic_field::remove(&mut config.id, type_id);
    // Listing has `drop`, so it is dropped here
}

// === Public functions ===

/// Buy items from the trade post. Anyone can call this.
///
/// Flow:
///   1. Look up listing by type_id
///   2. Verify sufficient quantity and payment
///   3. Transfer payment to seller
///   4. Withdraw item from SSU using TradeAuth witness
///   5. Deposit item into buyer's owned inventory
///   6. Update listing quantity and trade stats
///   7. Emit TradeEvent for dashboard indexing
public fun buy_item(
    config: &mut TradePostConfig,
    storage_unit: &mut StorageUnit,
    character: &Character,
    payment: Coin<SUI>,
    type_id: u64,
    quantity: u32,
    clock: &Clock,
    ctx: &mut TxContext,
) {
    assert!(quantity > 0, EZeroQuantity);

    // 1. Look up listing
    let listing: &mut Listing = dynamic_field::borrow_mut(
        &mut config.id,
        type_id,
    );

    // 2. Verify quantity available
    assert!(listing.quantity_available >= quantity, EInsufficientQuantity);

    // 3. Calculate and verify payment
    let total_price = listing.price_per_unit * (quantity as u64);
    assert!(coin::value(&payment) >= total_price, EInsufficientPayment);

    // 4. Transfer payment to seller
    let seller = listing.seller_address;
    transfer::public_transfer(payment, seller);

    // 5. Withdraw item from SSU using our witness
    let item = storage_unit::withdraw_item<TradeAuth>(
        storage_unit,
        character,
        TradeAuth {},
        type_id,
        quantity,
        ctx,
    );

    // 6. Deposit into buyer's owned inventory
    storage_unit::deposit_to_owned<TradeAuth>(
        storage_unit,
        character,
        item,
        TradeAuth {},
        ctx,
    );

    // 7. Update listing and stats
    listing.quantity_available = listing.quantity_available - quantity;
    config.trade_count = config.trade_count + 1;
    config.total_volume = config.total_volume + total_price;

    // 8. Emit event for dashboard
    event::emit(TradeEvent {
        trade_post_id: object::id(config),
        buyer: ctx.sender(),
        seller,
        type_id,
        quantity,
        total_price,
        timestamp_ms: clock.timestamp_ms(),
    });
}

// === View functions ===

/// Check if a listing exists for a given type_id
public fun has_listing(config: &TradePostConfig, type_id: u64): bool {
    dynamic_field::exists_(&config.id, type_id)
}

/// Get the trade count
public fun trade_count(config: &TradePostConfig): u64 {
    config.trade_count
}

/// Get the total volume traded
public fun total_volume(config: &TradePostConfig): u64 {
    config.total_volume
}
