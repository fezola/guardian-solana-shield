import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentationSection from "@/components/DocumentationSection";
import { SidebarProvider } from "@/components/ui/sidebar";

const Documentation = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full">
        <Header />
        <main className="flex-1">
          <DocumentationSection />
        </main>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Documentation;