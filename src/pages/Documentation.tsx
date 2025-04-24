
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentationSection from "@/components/DocumentationSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentationSidebar from "@/components/DocumentationSidebar";

const Documentation = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <div className="flex flex-1">
          <DocumentationSidebar />
          <main className="flex-1 pt-16">
            <DocumentationSection />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Documentation;
