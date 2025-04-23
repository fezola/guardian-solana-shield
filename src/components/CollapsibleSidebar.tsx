
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

interface CollapsibleSidebarProps {
  children: React.ReactNode;
}

const CollapsibleSidebar = ({ children }: CollapsibleSidebarProps) => {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(isMobile);
  
  // Reset sidebar state when screen size changes
  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  if (isMobile) {
    return (
      <div className={`fixed z-30 left-0 top-16 h-screen transition-transform duration-300 ${isCollapsed ? "-translate-x-full" : "translate-x-0"}`}>
        <div className="h-full w-64 bg-background border-r border-border/50 overflow-y-auto pb-16">
          {children}
        </div>
        <Button
          variant="secondary" 
          size="icon"
          className="absolute top-4 -right-10 shadow-md"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={`relative transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
      <div className={`fixed top-16 left-0 h-screen border-r border-border/50 bg-background overflow-y-auto pb-16 transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
        <div className={`${isCollapsed ? "opacity-0 invisible" : "opacity-100 visible"} transition-opacity duration-200`}>
          {children}
        </div>
        <Button
          variant="ghost" 
          size="icon"
          className="absolute top-4 right-4"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
