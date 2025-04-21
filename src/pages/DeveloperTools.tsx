
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DevToolsSection from "@/components/DevToolsSection";
import ReactComponentsSection from "@/components/ReactComponentsSection";
import IntegrationSection from "@/components/IntegrationSection";
import DocumentationSection from "@/components/DocumentationSection";
import TransactionFlowSection from "@/components/TransactionFlowSection";

const DeveloperTools = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main>
        <DevToolsSection />
        <TransactionFlowSection />
        <ReactComponentsSection />
        <IntegrationSection />
        <DocumentationSection />
      </main>
      <Footer />
    </div>
  );
};

export default DeveloperTools;
