
import { Search, X } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

type SearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  content: string;
  url: string;
};

interface GlobalDocSearchProps {
  sections: Array<{
    id: string;
    title: string;
    content: React.ReactNode;
  }>;
}

const GlobalDocSearch = ({ sections }: GlobalDocSearchProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Extract searchable content from React components
  const getSearchableContent = useCallback(() => {
    return sections.map(section => ({
      id: section.id,
      title: section.title,
      content: JSON.stringify(section.content).toLowerCase(),
      url: `#${section.id}`
    }));
  }, [sections]);

  const handleSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    
    const searchTerm = searchQuery.toLowerCase();
    const content = getSearchableContent();
    
    const searchResults = content
      .filter(item => 
        item.title.toLowerCase().includes(searchTerm) || 
        item.content.includes(searchTerm)
      )
      .map(item => ({
        id: item.id,
        title: item.title,
        content: item.content.substring(0, 100) + "...",
        url: item.url
      }));
      
    setResults(searchResults);
  }, [getSearchableContent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    handleSearch(query);
  }, [query, handleSearch]);

  const handleResultClick = (url: string) => {
    setIsOpen(false);
    window.location.href = url;
  };

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full sm:w-64 justify-start text-sm text-muted-foreground px-3"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span>Search documentation...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="p-0 max-w-2xl">
          <div className="flex items-center border-b p-4">
            <Search className="h-4 w-4 mr-2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search documentation..."
              className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="max-h-[50vh]">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <button
                    key={result.id}
                    className="w-full text-left px-4 py-2 hover:bg-muted/50 flex flex-col"
                    onClick={() => handleResultClick(result.url)}
                  >
                    <span className="font-medium">{result.title}</span>
                    {result.subtitle && (
                      <span className="text-sm text-muted-foreground">
                        {result.subtitle}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ) : query.length > 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                No results found for "{query}"
              </p>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                Type to start searching...
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalDocSearch;
