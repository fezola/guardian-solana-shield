import {
  FileText,
  Code,
  Terminal,
  Shield,
  Settings,
  Key,
  Database
} from "lucide-react";
import VersionSelector from "@/components/VersionSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

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
  const isMobile = useIsMobile();

  return (
    <div className="fixed left-0 top-0 z-40 h-screen w-80 bg-background border-r border-border">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <Link to="/" className="text-xl font-bold gradient-text">
            Guardian Shield
          </Link>
        </div>
        <VersionSelector onVersionChange={onVersionChange} />
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-6 py-4 documentation-sidebar" style={{ height: 'calc(100vh - 90px)' }}>
        <nav className="space-y-1">
          {documentationItems.map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="group flex items-start space-x-3 rounded-lg px-3 py-3 text-sm transition-all hover:bg-accent/50 hover:text-accent-foreground"
            >
              <div className="flex-shrink-0 mt-0.5">
                <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                  {item.title}
                </div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {item.description}
                </div>
              </div>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default DocumentationSidebar;
