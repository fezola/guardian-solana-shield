
import { useQuery } from "@tanstack/react-query";
import { fetchDocumentationSections } from "@/integrations/supabase/documentationApi";

export function useDocumentationSections() {
  return useQuery({
    queryKey: ["documentation-sections"],
    queryFn: fetchDocumentationSections,
  });
}

// Helper function to convert JSON content to React JSX
export function convertContentToJSX(content: any) {
  // If content is a string, return it directly
  if (typeof content === 'string') {
    return content;
  }
  
  // If it's a plain object but meant to represent JSX or React components,
  // you'd need to implement logic to convert it based on your data structure
  // For now, we'll stringify it to prevent rendering errors
  return JSON.stringify(content);
}
