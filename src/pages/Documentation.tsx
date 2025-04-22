
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
        <div className="h-20 w-full fixed top-0 z-50">
          <Header />
        </div>
        <div className="flex w-full pt-20">
          <div className="fixed left-0 top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <DocumentationSidebar />
          </div>
          <div className="flex-1 pl-64 md:pl-64 sm:pl-0">
            <main className="container py-8">
              <DocumentationSection />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Documentation;
