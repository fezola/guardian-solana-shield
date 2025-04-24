
import { SidebarProvider } from "@/components/ui/sidebar";
import DocumentationSection from "@/components/DocumentationSection";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentationSidebar from "@/components/DocumentationSidebar";
import { useEffect, useState } from "react";

const Documentation = () => {
  const [currentVersion, setCurrentVersion] = useState("v2.5");
  
  useEffect(() => {
    // Set the page title
    document.title = `Documentation | GuardianLayer`;
    
    // Track page view
    console.log("Analytics: Documentation page viewed");
  }, []);

  const handleVersionChange = (version: string) => {
    setCurrentVersion(version);
    console.log(`Analytics: Switched to documentation version ${version}`);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col w-full dark:bg-background dark:text-foreground">
        <Header />
        <div className="flex flex-1">
          <DocumentationSidebar currentVersion={currentVersion} onVersionChange={handleVersionChange} />
          <main className="flex-1 pt-16">
            <DocumentationSection version={currentVersion} />
          </main>
        </div>
        <Footer />
      </div>
    </SidebarProvider>
  );
};

export default Documentation;
