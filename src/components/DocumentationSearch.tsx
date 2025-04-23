
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DocumentationSearchProps {
  sections: {
    id: string;
    title: string;
  }[];
  onSelectSection: (sectionId: string) => void;
}

const DocumentationSearch = ({ sections, onSelectSection }: DocumentationSearchProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const filteredSections = sections.filter((section) =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search documentation..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onBlur={() => setTimeout(() => setIsSearching(false), 200)}
        />
      </div>

      {isSearching && searchQuery.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="p-2">
            {filteredSections.length > 0 ? (
              filteredSections.map((section) => (
                <button
                  key={section.id}
                  className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  onClick={() => {
                    onSelectSection(section.id);
                    setSearchQuery("");
                  }}
                >
                  {section.title}
                </button>
              ))
            ) : (
              <p className="px-2 py-1.5 text-sm text-muted-foreground">
                No results found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentationSearch;
