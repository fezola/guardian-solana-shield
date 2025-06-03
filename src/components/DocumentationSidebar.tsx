import { 
  FileText, 
  Code, 
  Terminal, 
  Shield, 
  Settings, 
  Key, 
  Database,
  BookOpen,
  Search
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import VersionSelector from "@/components/VersionSelector";
import GlobalDocSearch from "@/components/GlobalDocSearch";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const documentationItems = [
  { 
    title: "API Reference", 
    icon: FileText, 
    href: "#api-reference",
    description: "Core API functions and usage"
  },
  { 
    title: "Integration Guides", 
    icon: Code, 
    href: "#integration-guides",
    description: "Step-by-step integration tutorials" 
  },
  { 
    title: "zkProof Circuit Explanation", 
    icon: Code, 
    href: "#zkproof-circuits",
    description: "How our zero-knowledge proofs work" 
  },
  { 
    title: "Demo App", 
    icon: Terminal, 
    href: "#demo-app",
    description: "Interactive transaction security demo" 
  },
  { 
    title: "Security Model Overview", 
    icon: Shield, 
    href: "#security-model",
    description: "Multi-layer security approach" 
  },
  { 
    title: "Recovery Configuration", 
    icon: Settings, 
    href: "#recovery-config",
    description: "Wallet recovery options and setup" 
  },
  { 
    title: "API Key Management", 
    icon: Key, 
    href: "#api-key",
    description: "Securing and managing API keys" 
  },
  { 
    title: "Server API", 
    icon: Database, 
    href: "#server-api",
    description: "Server-side API documentation" 
  },
  { 
    title: "Interactive Playground", 
    icon: Terminal, 
    href: "#playground",
    description: "Try GuardianLayer features" 
  },
];

interface DocumentationSidebarProps {
  currentVersion: string;
  onVersionChange: (version: string) => void;
}

const DocumentationSidebar = ({ currentVersion, onVersionChange }: DocumentationSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  const filteredItems = documentationItems.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="pb-2">
        <div className="flex items-center px-4 py-3">
          <BookOpen className="mr-2 h-5 w-5" />
          <span className="font-semibold text-lg">Documentation</span>
          <div className="ml-auto flex items-center space-x-2">
            <ThemeToggle />
            <SidebarTrigger />
          </div>
        </div>
        <div className="px-4 py-2">
          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center">
              <VersionSelector onVersionChange={onVersionChange} />
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search section..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarContent className="pt-3 overflow-y-auto max-h-[calc(100vh-220px)]">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2">Documentation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-4 px-2">
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-3">
                  <SidebarMenuButton asChild tooltip={item.description}>
                    <a href={item.href} className="flex items-start py-3 px-4 rounded-md hover:bg-accent/50 transition-colors">
                      <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.title}</span>
                        <span className="text-xs text-muted-foreground mt-1.5">{item.description}</span>
                      </div>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="p-4">
          <div className="rounded-md bg-primary/10 p-3">
            <h4 className="text-xs font-medium flex items-center">
              <FileText className="h-3.5 w-3.5 mr-1" />
              Latest Updates
            </h4>
            <div className="mt-2 text-xs">
              <p className="text-muted-foreground">API {currentVersion} is now available with improved zkProof circuit performance</p>
              <a href="#" className="text-primary text-xs mt-1 inline-block hover:underline">Read more</a>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default DocumentationSidebar;
