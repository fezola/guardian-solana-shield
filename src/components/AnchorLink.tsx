
import { useState } from "react";
import { Link, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface AnchorLinkProps {
  id: string;
}

const AnchorLink = ({ id }: AnchorLinkProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyAnchorLink = () => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`;
    navigator.clipboard.writeText(url);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copied",
      description: "Anchor link has been copied to clipboard",
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={copyAnchorLink}
          className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground"
          aria-label="Copy anchor link"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link className="h-4 w-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy anchor link</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AnchorLink;
