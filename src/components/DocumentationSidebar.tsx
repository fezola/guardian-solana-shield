
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
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Documentation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocumentationSidebar;
