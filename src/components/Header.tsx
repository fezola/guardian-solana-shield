
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll events for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle anchor link clicks on same page
  const handleAnchorClick = (anchor: string) => {
    if (location.pathname === '/') {
      // If we're on the homepage, just scroll to the anchor
      const element = document.getElementById(anchor);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    } else {
      // If we're on another page, navigate to homepage with anchor
      navigate(`/#${anchor}`);
    }
  };

  // Handle "Get Started" button click
  const handleGetStarted = () => {
    navigate("/developer-tools");
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled 
          ? "backdrop-blur-md bg-background/90 shadow-sm border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 group">
          <Shield className="h-8 w-8 text-primary transition-transform group-hover:scale-110" />
          <span className="text-xl font-bold gradient-text">GuardianLayer</span>
        </Link>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-foreground" onClick={toggleMenu} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => handleAnchorClick('features')} 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </button>
          <button 
            onClick={() => handleAnchorClick('how-it-works')} 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </button>
          <button 
            onClick={() => handleAnchorClick('integration')} 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Integration
          </button>
          <Link 
            to="/documentation" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors ml-2"
          >
            Documentation
          </Link>
          <Button
            className="button-glow"
            onClick={handleGetStarted}
          >
            Get Started
          </Button>
        </nav>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-background border-b border-border/50 md:hidden py-4 animate-fade-in">
            <nav className="container flex flex-col gap-4">
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => handleAnchorClick('features')}
              >
                Features
              </button>
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => handleAnchorClick('how-it-works')}
              >
                How It Works
              </button>
              <button
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => handleAnchorClick('integration')}
              >
                Integration
              </button>
              <Link 
                to="/documentation" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Documentation
              </Link>
              <Button
                className="w-full button-glow"
                onClick={handleGetStarted}
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
