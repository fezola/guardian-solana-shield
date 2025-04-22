
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentationSection from "@/components/DocumentationSection";
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentationSidebar from "@/components/DocumentationSidebar";

const Documentation = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DocumentationSidebar />
        <div className="flex-1">
          <Header />
          <main className="container py-8">
            <DocumentationSection />
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Documentation;
