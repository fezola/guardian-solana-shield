
import { supabase } from "@/integrations/supabase/client";

// Fetch documentation sections ordered by order_index
export async function fetchDocumentationSections() {
  const { data, error } = await supabase
    .from("documentation_sections")
    .select("id,title,icon,content,order_index,last_updated_by,slug,updated_at")
    .order("order_index", { ascending: true });
  if (error) throw error;
  
  return data;
}

// Fetch a single documentation section by slug
export async function fetchDocumentationSectionBySlug(slug: string) {
  const { data, error } = await supabase
    .from("documentation_sections")
    .select("id,title,icon,content,order_index,last_updated_by,slug,updated_at")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return data;
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

// Create a new documentation section
export async function createDocumentationSection(section: {
  title: string;
  icon: string;
  content: any;
  order_index: number;
  slug: string;
}) {
  const { data, error } = await supabase
    .from("documentation_sections")
    .insert([section])
    .select();
  if (error) throw error;
  return data[0];
}

// Update a documentation section
export async function updateDocumentationSection(
  id: string,
  updates: {
    title?: string;
    icon?: string;
    content?: any;
    order_index?: number;
    slug?: string;
  }
) {
  const { data, error } = await supabase
    .from("documentation_sections")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select();
  if (error) throw error;
  return data[0];
}

// Delete a documentation section
export async function deleteDocumentationSection(id: string) {
  const { error } = await supabase
    .from("documentation_sections")
    .delete()
    .eq("id", id);
  if (error) throw error;
  return true;
}
