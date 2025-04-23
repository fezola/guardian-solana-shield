
import { useQuery } from "@tanstack/react-query";
import { fetchDocumentationSections } from "@/integrations/supabase/documentationApi";

export function useDocumentationSections() {
  return useQuery({
    queryKey: ["documentation-sections"],
    queryFn: fetchDocumentationSections,
  });
}
