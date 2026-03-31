export const WORLD_API_BASE = "https://world-api-stillness.live.tech.evefrontier.com";
export const GRAPHQL_ENDPOINT = "https://graphql.testnet.sui.io/graphql";
export const SUI_RPC = "https://fullnode.testnet.sui.io:443";

export const STILLNESS = {
  worldPackage: "0x28b497559d65ab320d9da4613bf2498d5946b2c0ae3597ccfda3072ce127448c",
  killmailRegistry: "0x7fd9a32d0bbe7b1cfbb7140b1dd4312f54897de946c399edb21c3a12e52ce283",
  objectRegistry: "0x454a9aa3d37e1d08d3c9181239c1b683781e4087fbbbd48c935d54b6736fd05c",
  locationRegistry: "0xc87dca9c6b2c95e4a0cbe1f8f9eeff50171123f176fbfdc7b49eef4824fc596b",
};

export const UTOPIA = {
  worldPackage: "0xd12a70c74c1e759445d6f209b01d43d860e97fcf2ef72ccbbd00afd828043f75",
  killmailRegistry: "0xa92de75fde403a6ccfcb1d5a380f79befaed9f1a2210e10f1c5867a4cd82b84e",
  objectRegistry: "0xc2b969a72046c47e24991d69472afb2216af9e91caf802684514f39706d7dc57",
  locationRegistry: "0x62e6ec4caea639e21e4b8c3cf0104bace244b3f1760abed340cc3285905651cf",
};

export const ACTIVE_ENV = STILLNESS;

export const ASSEMBLY_TYPES = {
  storageUnit: `${ACTIVE_ENV.worldPackage}::storage_unit::StorageUnit`,
  gate: `${ACTIVE_ENV.worldPackage}::gate::Gate`,
  turret: `${ACTIVE_ENV.worldPackage}::turret::Turret`,
  networkNode: `${ACTIVE_ENV.worldPackage}::network_node::NetworkNode`,
  character: `${ACTIVE_ENV.worldPackage}::character::Character`,
  playerProfile: `${ACTIVE_ENV.worldPackage}::character::PlayerProfile`,
};

export const EVENT_TYPES = {
  killmail: `${ACTIVE_ENV.worldPackage}::killmail::KillmailEvent`,
  jump: `${ACTIVE_ENV.worldPackage}::gate::JumpEvent`,
};

export const TRADE_POST = {
  packageId: "0x1b77373ab65606a5eddfcedbdab6acaeaf0abf61c0d993d1edd3f79d8ad61254",
  module: "trade_post",
};

export const TRADE_EVENT_TYPES = {
  trade: `${TRADE_POST.packageId}::trade_post::TradeEvent`,
  listing: `${TRADE_POST.packageId}::trade_post::ListingEvent`,
};
