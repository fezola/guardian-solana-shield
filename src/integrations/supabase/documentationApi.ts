import { supabase } from "@/integrations/supabase/client";

// Fetch documentation sections ordered by order_index
export async function fetchDocumentationSections() {
  const { data, error } = await supabase
    .from("documentation_sections")
    .select("id,title,icon,content,order_index,last_updated_by,slug,updated_at")
    .order("order_index", { ascending: true });
  if (error) throw error;
  
  // Transform the content field if needed
  return data.map(section => ({
    ...section,
    // Convert content to string if it's not already
    content: section.content
  }));
}

// Fetch code examples for a section
export async function fetchCodeExamples(sectionId: string) {
  const { data, error } = await supabase
    .from("code_examples")
    .select("*")
    .eq("section_id", sectionId);
  if (error) throw error;
  return data;
}

// Send feedback
export async function submitFeedback({
  sectionId,
  helpful,
  message,
  userId
}: {
  sectionId: string;
  helpful: boolean;
  message: string;
  userId: string | null;
}) {
  const { data, error } = await supabase
    .from("documentation_feedback")
    .insert([{ section_id: sectionId, helpful, message, user_id: userId }]);
  if (error) throw error;
  return data;
}
