import { Link } from "react-router-dom";
import { Globe, Radio, Store, ArrowRight, Hexagon } from "lucide-react";
import { FeatureCard } from "../components/landing/feature-card";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-void relative overflow-hidden flex flex-col items-center justify-center px-6">
      {/* Background gradient mimicking galaxy */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-cyan/5 blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-purple/5 blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-amber/5 blur-[80px]" />
        {/* Floating star particles */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            className="star-particle"
            style={{
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 53 + 7) % 100}%`,
              animationDuration: `${6 + (i % 8) * 2}s`,
              animationDelay: `${(i * 0.3) % 5}s`,
              opacity: 0.2 + (i % 5) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        <div className="animate-fade-in">
          <Hexagon size={48} className="text-cyan mx-auto mb-6 opacity-60" />
        </div>

        <h1
          className="font-orbitron text-4xl sm:text-5xl lg:text-6xl text-cyan font-black tracking-wider text-glow animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          FRONTIER NEXUS
        </h1>

        <p
          className="font-outfit text-xl sm:text-2xl text-secondary mt-4 animate-fade-in"
          style={{ animationDelay: "200ms" }}
        >
          The Civilization Toolkit
        </p>

        <p
          className="text-muted text-sm sm:text-base mt-3 max-w-lg mx-auto animate-fade-in"
          style={{ animationDelay: "300ms" }}
        >
          Decentralized trade network + galaxy intelligence for EVE Frontier
        </p>

        {/* Feature cards */}
        <div
          className="flex flex-col sm:flex-row gap-4 mt-12 justify-center"
        >
          <FeatureCard icon={Globe} stat="24,502" label="Solar Systems" delay={400} />
          <FeatureCard icon={Radio} stat="Live" label="Blockchain Events" delay={500} />
          <FeatureCard icon={Store} stat="On-Chain" label="Trade Posts" delay={600} />
        </div>

        {/* CTA */}
        <div className="mt-12 animate-fade-in" style={{ animationDelay: "700ms" }}>
          <Link
            to="/map"
            className="inline-flex items-center gap-3 px-8 py-3 border-2 border-cyan/50 rounded-lg text-cyan font-orbitron text-sm tracking-wider hover:bg-cyan/10 hover:border-cyan hover:shadow-[0_0_30px_rgba(0,229,255,0.3)] transition-all duration-300"
          >
            Enter the Frontier
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Footer */}
        <p
          className="text-muted text-xs mt-16 animate-fade-in"
          style={{ animationDelay: "800ms" }}
        >
          Built for EVE Frontier x Sui Hackathon 2026
        </p>
      </div>
    </div>
  );
}
