
import { Book, FileText, Code, FileCode, Shield, Settings } from "lucide-react";

const DocumentationSection = () => {
  const docItems = [
    {
      icon: FileText,
      title: "API Reference",
      description: "Complete technical documentation for all SDK functions and components."
    },
    {
      icon: Code,
      title: "Integration Guides",
      description: "Step-by-step guides for integrating with Phantom, Backpack, and Solflare wallets."
    },
    {
      icon: FileCode,
      title: "zkProof Circuit Explanation",
      description: "Technical deep dive into the zero-knowledge proof circuits and their implementation."
    },
    {
      icon: Book,
      title: "Demo App Tutorial",
      description: "Follow along to build a complete demo app with all GuardianLayer features."
    },
    {
      icon: Shield,
      title: "Security Model Overview",
      description: "Understand the security principles and architecture behind GuardianLayer."
    },
    {
      icon: Settings,
      title: "Recovery Configuration",
      description: "Best practices for setting up and managing wallet recovery options."
    },
  ];

  return (
    <section id="documentation" className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4 gradient-text">Documentation</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive guides, tutorials, and technical references to help you implement GuardianLayer effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {docItems.map((item, index) => (
            <div 
              key={index} 
              className="feature-card flex flex-col"
            >
              <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            All documentation is available in our docs repository, with regular updates as new features and improvements are released.
          </p>
        </div>
      </div>
    </section>
  );
};

export default DocumentationSection;
