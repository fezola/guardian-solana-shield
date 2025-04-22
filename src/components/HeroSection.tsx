import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ShieldCheck, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  // Wallet names for the ticker
  const wallets = [
    "Phantom",
    "Solflare",
    "Backpack",
    "Glow",
    "Slope",
    "Sollet",
    "Math Wallet",
    "Coin98"
  ];

  // State for animation
  const [tickerPosition, setTickerPosition] = useState(0);

  // Animate the ticker
  useEffect(() => {
    const tickerInterval = setInterval(() => {
      setTickerPosition(prev => (prev + 1) % wallets.length);
    }, 2000); // Change wallet every 2 seconds

    return () => clearInterval(tickerInterval);
  }, [wallets.length]);

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern z-0" />
      {/* Abstract shapes */}
      <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-primary/5 blur-3xl animate-float" />
      <div
        className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-accent/5 blur-2xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div className="container relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-muted/30 backdrop-blur-sm border border-border/50 mb-8 animate-fade-in">
            <ShieldCheck className="w-5 h-5 text-primary mr-2" />
            <span className="text-sm text-muted-foreground">
              Bulletproof Security for Solana Wallets
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text animate-fade-in">
            Guard<span className="text-foreground">Layer</span> SDK
          </h1>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            A modular, plug-and-play security layer for Solana wallets that provides smart transaction risk detection,
            self-custodial recovery, and anti-scam protection without sacrificing decentralization.
          </p>

          {/* Protection message */}
          <div className="flex items-center justify-center gap-2 mb-8 animate-fade-in">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-500 font-medium">Protects all Solana projects, DeFi and dApps</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              asChild
              size="lg"
              className="button-glow"
            >
              <Link to="/developer-tools">Get Started</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
            >
              <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            </Button>
          </div>

          <div className="mt-16 p-6 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-xl animate-fade-in">
            <p className="text-sm font-medium text-muted-foreground mb-6">
              Compatible with major Solana wallets
            </p>

            {/* Wallet ticker animation */}
            <div className="flex flex-wrap justify-center items-center gap-6 relative h-12">
              {wallets.map((wallet, index) => (
                <div
                  key={index}
                  className={`flex items-center transition-all duration-500 ${index === tickerPosition ? 'scale-125 text-primary font-medium' : 'text-muted-foreground'
                    }`}
                >
                  <span className="text-sm md:text-base">{wallet}</span>
                  {index === tickerPosition && (
                    <ArrowRight className="ml-1 h-4 w-4 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;