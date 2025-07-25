
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

    // Ensure the current theme is applied
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleVersionChange = (version: string) => {
    setCurrentVersion(version);
    console.log(`Analytics: Switched to documentation version ${version}`);
  };

  return (
    <div className="min-h-screen bg-background">

      {/* Fixed Header - Full width */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <Header />
      </div>

      {/* Desktop Sidebar - Hidden on mobile, visible on desktop */}
      <div className="hidden lg:block">
        <DocumentationSidebar currentVersion={currentVersion} onVersionChange={handleVersionChange} />
      </div>

      {/* Main Content - Full width on mobile, offset on desktop */}
      <main className="lg:ml-80 pt-16">
        <div className="min-h-screen">
          <DocumentationSection version={currentVersion} />
        </div>
      </main>

      {/* Footer - Full width on mobile, offset on desktop */}
      <div className="lg:ml-80">
        <Footer />
      </div>
    </div>
  );
};

export default Documentation;
