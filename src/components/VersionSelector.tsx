
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const versions = [
  { version: "v2.5", label: "Latest (v2.5)" },
  { version: "v2.4", label: "v2.4" },
  { version: "v2.3", label: "v2.3" },
  { version: "v2.0", label: "v2.0" },
  { version: "v1.0", label: "Legacy (v1.0)" },
];

interface VersionSelectorProps {
  onVersionChange: (version: string) => void;
}

const VersionSelector = ({ onVersionChange }: VersionSelectorProps) => {
  const [selectedVersion, setSelectedVersion] = useState(versions[0]);

  const handleVersionSelect = (version: typeof versions[0]) => {
    setSelectedVersion(version);
    onVersionChange(version.version);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 h-8 px-3">
          <span className="text-xs font-medium">{selectedVersion.label}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {versions.map((version) => (
          <DropdownMenuItem
            key={version.version}
            className="flex items-center justify-between"
            onClick={() => handleVersionSelect(version)}
          >
            <span>{version.label}</span>
            {version.version === selectedVersion.version && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VersionSelector;
