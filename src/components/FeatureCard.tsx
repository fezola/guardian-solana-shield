
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  apiExample?: string;
}

const FeatureCard = ({ icon: Icon, title, description, apiExample }: FeatureCardProps) => {
  return (
    <div className="feature-card group">
      <div className="inline-flex p-3 rounded-lg bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {apiExample && (
        <div className="mt-2 p-3 bg-muted/50 rounded-md text-sm font-mono overflow-x-auto text-left">
          <code>{apiExample}</code>
        </div>
      )}
    </div>
  );
};

export default FeatureCard;
