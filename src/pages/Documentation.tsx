
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentationSection from "@/components/DocumentationSection";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentationSidebar from "@/components/DocumentationSidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const Documentation = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DocumentationSidebar />
        <div className="flex-1">
          <Header />
          <main className="pt-20 container">
            <DocumentationSection />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Documentation;
