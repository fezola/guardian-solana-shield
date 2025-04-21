
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import SdkFeaturesSection from "@/components/SdkFeaturesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import IntegrationSection from "@/components/IntegrationSection";
import Footer from "@/components/Footer";
import DocumentationSection from "@/components/DocumentationSection";

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
        <DocumentationSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
