
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SdkFeaturesSection from "@/components/SdkFeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IntegrationSection from "@/components/IntegrationSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SdkFeaturesSection />
        <HowItWorksSection />
        <IntegrationSection />
        
        <section className="py-12 bg-muted/5">
          <div className="container">
            <div className="flex flex-col items-center justify-center text-center">
              <h2 className="text-2xl font-bold mb-4">Developer Resources</h2>
              <p className="text-muted-foreground max-w-lg mb-6">
                Explore our developer tools, UI components, and comprehensive documentation.
              </p>
              <Button asChild className="button-glow">
                <Link to="/developer-tools">View Developer Tools →</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
