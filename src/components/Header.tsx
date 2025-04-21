
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 backdrop-blur-md bg-background/80 border-b border-border/50">
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold gradient-text">GuardianLayer</span>
        </Link>
        {/* Mobile menu button */}
        <button className="md:hidden text-foreground" onClick={toggleMenu}>
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#integration" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Integration
          </a>
          <Button asChild variant="outline" className="ml-2">
            <Link to="#documentation">Documentation</Link>
          </Button>
          <Button
            className="button-glow"
            onClick={() => navigate("/developer-tools")}
          >
            Get Started
          </Button>
        </nav>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border/50 md:hidden py-4 animate-fade-in">
            <nav className="container flex flex-col gap-4">
              <a
                href="#features"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                How It Works
              </a>
              <a
                href="#integration"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={toggleMenu}
              >
                Integration
              </a>
              <Button asChild variant="outline" className="w-full" onClick={toggleMenu}>
                <Link to="#documentation">Documentation</Link>
              </Button>
              <Button
                className="w-full button-glow"
                onClick={() => {
                  toggleMenu();
                  navigate("/developer-tools");
                }}
              >
                Get Started
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
