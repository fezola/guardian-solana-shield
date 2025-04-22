
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SdkFeaturesSection from "@/components/SdkFeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IntegrationSection from "@/components/IntegrationSection";
import Footer from "@/components/Footer";
import DocumentationSection from "@/components/DocumentationSection";

const Index = () => {
  const location = useLocation();
  
  // Handle hash navigation on page load
  useEffect(() => {
    // Check if there's a hash in the URL
    if (location.hash) {
      // Remove the # character
      const id = location.hash.substring(1);
      
      // Find the element with the id
      const element = document.getElementById(id);
      
      // If element exists, scroll to it with a slight delay to ensure page is fully loaded
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    } else {
      // If no hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <SdkFeaturesSection />
        <HowItWorksSection />
        <IntegrationSection />
        <DocumentationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
