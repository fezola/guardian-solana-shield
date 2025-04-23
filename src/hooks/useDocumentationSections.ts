
import { useQuery } from "@tanstack/react-query";
import { fetchDocumentationSections } from "@/integrations/supabase/documentationApi";
import { ReactNode } from "react";

export function useDocumentationSections() {
  return useQuery({
    queryKey: ["documentation-sections"],
    queryFn: fetchDocumentationSections,
  });
}

// Improved helper function to convert JSON content to React JSX
export function convertContentToJSX(content: any): ReactNode {
  // If content is a string, return it directly
  if (typeof content === 'string') {
    return content;
  }
  
  // Handle different content types
  if (content && typeof content === 'object') {
    // If content has a type property, it might be a structured content block
    if (content.type) {
      switch (content.type) {
        case 'paragraph':
          return <p className="mb-4">{convertContentToJSX(content.content)}</p>;
        case 'heading':
          return renderHeading(content.level, content.content);
        case 'code':
          return <pre className="bg-muted p-4 rounded-md my-4 overflow-auto">
            <code>{content.content}</code>
          </pre>;
        case 'list':
          return content.style === 'ordered' 
            ? <ol className="list-decimal ml-6 my-4 space-y-2">{content.items.map((item: any, i: number) => 
                <li key={i}>{convertContentToJSX(item)}</li>
              )}</ol>
            : <ul className="list-disc ml-6 my-4 space-y-2">{content.items.map((item: any, i: number) => 
                <li key={i}>{convertContentToJSX(item)}</li>
              )}</ul>;
        case 'link':
          return <a href={content.href} className="text-primary hover:underline">{content.content}</a>;
        case 'callout':
          return <div className={`p-4 rounded-lg border ${getCalloutStyles(content.style)}`}>
            {content.title && <h4 className="font-semibold mb-2">{content.title}</h4>}
            <div>{convertContentToJSX(content.content)}</div>
          </div>;
        default:
          console.warn('Unknown content type:', content.type);
          return JSON.stringify(content);
      }
    }
    
    // Handle arrays (lists of content)
    if (Array.isArray(content)) {
      return <>{content.map((item, index) => <span key={index}>{convertContentToJSX(item)}</span>)}</>;
    }
    
    // Default case for objects
    return JSON.stringify(content);
  }
  
  // Default case for null, undefined, etc.
  return content?.toString() || '';
}

// Helper function to render headings
function renderHeading(level: number, content: any): ReactNode {
  switch (level) {
    case 1:
      return <h1 className="text-3xl font-bold mb-4">{convertContentToJSX(content)}</h1>;
    case 2:
      return <h2 className="text-2xl font-bold mb-3">{convertContentToJSX(content)}</h2>;
    case 3:
      return <h3 className="text-xl font-bold mb-2">{convertContentToJSX(content)}</h3>;
    case 4:
      return <h4 className="text-lg font-bold mb-2">{convertContentToJSX(content)}</h4>;
    default:
      return <h5 className="text-base font-bold mb-2">{convertContentToJSX(content)}</h5>;
  }
}

// Helper for callout styles
function getCalloutStyles(style: string): string {
  switch (style) {
    case 'info':
      return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30';
    case 'warning':
      return 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30';
    case 'error':
      return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900/30';
    case 'success':
      return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/30';
    default:
      return 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-900/30';
  }
}
