
import { Book, FileText, Code, FileCode, Shield, Settings, Copy, Terminal, Database, Key, Fingerprint, AlertTriangle, User, LayoutDashboard, AppWindow, Lock } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CodeBlock from "./CodeBlock";
import ApiKeySection from "./ApiKeySection";
import SdkIntegrationSection from "./SdkIntegrationSection";
import PlaygroundSection from "./PlaygroundSection";
import ServerSideApiSection from "./ServerSideApiSection";
import DemoAppSection from "./DemoAppSection";
import DocumentationSearch from "./DocumentationSearch";
import AnchorLink from "./AnchorLink";
import FeedbackWidget from "./FeedbackWidget";
import UpdatedTimestamp from "./UpdatedTimestamp";
import CollapsibleSidebar from "./CollapsibleSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useDocumentationSections, convertContentToJSX } from "@/hooks/useDocumentationSections";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

// This is a minimal example component that shows how to use the documentation system
const DocumentationSection = () => {
  const docRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeSection, setActiveSection] = useState("");
  const isMobile = useIsMobile();
  const { data: dbSections, isLoading, error } = useDocumentationSections();
  const { profile } = useSupabaseUser();

  const sections = dbSections?.map(dbSection => {
    const IconComponent = (() => {
      const allIcons = {
        Book, FileText, Code, FileCode, Shield, Settings, Copy, 
        Terminal, Database, Key, Fingerprint, AlertTriangle, 
        User, LayoutDashboard, AppWindow, Lock
      };
      return allIcons[dbSection.icon as keyof typeof allIcons] || FileText;
    })();

    return {
      ...dbSection,
      content: (
        <div className="prose dark:prose-invert max-w-none">
          {convertContentToJSX(dbSection.content)}
        </div>
      ),
      icon: IconComponent,
      lastUpdated: dbSection.updated_at ? dbSection.updated_at.split("T")[0] : "",
    };
  }) || [];

  const scrollToSection = (id: string) => {
    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(id);
    
    window.history.pushState(null, "", `#${id}`);
  };
  
  useEffect(() => {
    const sectionId = window.location.hash.replace('#', '');
    if (sectionId && sections.some(section => section.id === sectionId)) {
      setTimeout(() => scrollToSection(sectionId), 100);
    }
  }, [sections]);

  if (isLoading) {
    return <div className="p-12 text-center text-muted-foreground">Loading documentation…</div>
  }
  if (error) {
    return <div className="p-12 text-center text-red-600">Error loading documentation.</div>
  }

  // If no sections are found, show a message for developers
  if (sections.length === 0) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No Documentation Sections Found</h2>
        <p className="text-muted-foreground mb-6">
          You need to add documentation sections to the database. Use the Supabase dashboard or programmatically add sections.
        </p>
        
        <div className="bg-muted p-6 rounded-lg border text-left max-w-3xl mx-auto">
          <h3 className="text-lg font-semibold mb-2">Example Content Structure</h3>
          <CodeBlock 
            code={`// Example of adding a documentation section:
const section = {
  title: "Getting Started",
  icon: "Book",  // Must match a Lucide icon name
  slug: "getting-started",
  order_index: 1,
  content: [
    {
      type: "heading",
      level: 2,
      content: "Welcome to the Documentation"
    },
    {
      type: "paragraph",
      content: "This is an introduction to our platform."
    },
    {
      type: "callout",
      style: "info",
      title: "Important Note",
      content: "Make sure to read this documentation carefully."
    },
    {
      type: "code",
      language: "javascript",
      content: "const api = new API('your-api-key');"
    }
  ]
};

// Insert into Supabase
const { data, error } = await supabase
  .from('documentation_sections')
  .insert([section]);`} 
          />

          {profile?.role === 'admin' && (
            <div className="mt-4">
              <Button>Add New Section</Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <section id="documentation" className="py-12 lg:py-24">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text animate-fade-in">Documentation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in">
            Comprehensive guides, tutorials, and technical references for integrating GuardianLayer security features.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {isMobile && (
            <div className="lg:hidden mb-6">
              <DocumentationSearch 
                sections={sections}
                onSelectSection={id => {
                  docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                  setActiveSection(id);
                  window.history.pushState(null, "", `#${id}`);
                }}
              />
            </div>
          )}
          
          <CollapsibleSidebar>
            <div className="p-4 pt-6">
              {!isMobile && (
                <DocumentationSearch 
                  sections={sections}
                  onSelectSection={id => {
                    docRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                    setActiveSection(id);
                    window.history.pushState(null, "", `#${id}`);
                  }}
                />
              )}
              
              <h2 className="text-xl font-bold mb-4">Documentation</h2>
              <nav>
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => {
                          docRefs.current[section.id]?.scrollIntoView({ behavior: "smooth", block: "start" });
                          setActiveSection(section.id);
                          window.history.pushState(null, "", `#${section.id}`);
                        }}
                        className={`flex w-full items-center gap-2 py-2 px-3 rounded-md hover:bg-muted transition-colors text-left ${
                          activeSection === section.id
                            ? "bg-primary/10 text-primary font-medium"
                            : ""
                        }`}
                      >
                        <section.icon className="h-4 w-4 shrink-0" />
                        <span className="text-sm">{section.title}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </CollapsibleSidebar>

          <div className="flex-1">
            <div className="space-y-16">
              {sections.map((section) => (
                <div
                  ref={el => (docRefs.current[section.id] = el)}
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-24"
                >
                  <div className="flex items-center gap-3 mb-6 group">
                    <span className="inline-flex p-2.5 rounded-lg bg-primary/10">
                      <section.icon className="h-5 w-5 text-primary" />
                    </span>
                    <h2 className="text-2xl font-bold">
                      {section.title}
                      <AnchorLink id={section.id} />
                    </h2>
                  </div>
                  <UpdatedTimestamp date={section.lastUpdated} />
                  <div className="mt-6">{section.content}</div>
                  <FeedbackWidget sectionId={section.id} sectionTitle={section.title} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
