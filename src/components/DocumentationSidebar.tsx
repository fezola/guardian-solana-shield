
import { Book, Code, FileText, Shield, Key, Terminal, Settings } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarItems = [
  { title: "API Reference", icon: FileText, href: "#api-reference" },
  { title: "Integration Guides", icon: Code, href: "#integration-guides" },
  { title: "zkProof Circuit Explanation", icon: Code, href: "#zkproof-circuits" },
  { title: "Demo App", icon: Terminal, href: "#demo-app" },
  { title: "Security Model Overview", icon: Shield, href: "#security-model" },
  { title: "Recovery Configuration", icon: Settings, href: "#recovery-config" },
  { title: "API Key Management", icon: Key, href: "#api-key" },
];

const DocumentationSidebar = () => {
  const isMobile = useIsMobile();
  
  if (isMobile) {
    return null; // Don't render the sidebar on mobile
  }
  
  return (
    <div className="h-full w-64 border-r border-border/50 bg-sidebar">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Documentation</h2>
        <nav>
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.title}>
                <a 
                  href={item.href} 
                  className="flex items-center gap-2 py-2 px-3 rounded-md hover:bg-muted transition-colors"
                >
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{item.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default DocumentationSidebar;
