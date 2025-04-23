
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createDocumentationSection, updateDocumentationSection, deleteDocumentationSection } from "@/integrations/supabase/documentationApi";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";

const ICONS = [
  "Book", "FileText", "Code", "FileCode", "Shield", "Settings", "Copy", 
  "Terminal", "Database", "Key", "Fingerprint", "AlertTriangle", 
  "User", "LayoutDashboard", "AppWindow", "Lock"
];

interface AdminDocumentationEditorProps {
  sectionId?: string;
  defaultValues?: {
    title: string;
    icon: string;
    slug: string;
    order_index: number;
    content: any;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AdminDocumentationEditor = ({ 
  sectionId, 
  defaultValues, 
  onSuccess, 
  onCancel 
}: AdminDocumentationEditorProps) => {
  const { toast } = useToast();
  const { profile } = useSupabaseUser();
  const isAdmin = profile?.role === 'admin';
  
  const [title, setTitle] = useState(defaultValues?.title || "");
  const [icon, setIcon] = useState(defaultValues?.icon || "FileText");
  const [slug, setSlug] = useState(defaultValues?.slug || "");
  const [orderIndex, setOrderIndex] = useState(defaultValues?.order_index || 0);
  const [contentJSON, setContentJSON] = useState(
    typeof defaultValues?.content === 'string' 
      ? defaultValues?.content 
      : JSON.stringify(defaultValues?.content || [], null, 2)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Generate slug from title
  useEffect(() => {
    if (title && !slug) {
      setSlug(title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''));
    }
  }, [title, slug]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title) newErrors.title = "Title is required";
    if (!icon) newErrors.icon = "Icon is required";
    if (!slug) newErrors.slug = "Slug is required";
    
    try {
      JSON.parse(contentJSON);
    } catch (e) {
      newErrors.content = "Content must be valid JSON";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only admin users can edit documentation",
        variant: "destructive"
      });
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSaving(true);
    
    try {
      const parsedContent = JSON.parse(contentJSON);
      
      if (sectionId) {
        // Update existing section
        await updateDocumentationSection(sectionId, {
          title,
          icon,
          slug,
          order_index: orderIndex,
          content: parsedContent
        });
        
        toast({
          title: "Documentation updated",
          description: "Your changes have been saved"
        });
      } else {
        // Create new section
        await createDocumentationSection({
          title,
          icon,
          slug,
          order_index: orderIndex,
          content: parsedContent
        });
        
        toast({
          title: "Documentation created",
          description: "New section has been added"
        });
      }
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error saving documentation:", error);
      toast({
        title: "Error",
        description: "Failed to save documentation",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!sectionId || !isAdmin) return;
    
    if (!confirm("Are you sure you want to delete this documentation section? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    
    try {
      await deleteDocumentationSection(sectionId);
      
      toast({
        title: "Documentation deleted",
        description: "The section has been removed"
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error deleting documentation:", error);
      toast({
        title: "Error",
        description: "Failed to delete documentation",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Permission Denied</CardTitle>
          <CardDescription>Only admin users can edit documentation.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sectionId ? "Edit Documentation" : "Create Documentation"}</CardTitle>
        <CardDescription>
          {sectionId 
            ? "Update existing documentation section" 
            : "Add a new documentation section"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Getting Started"
            className={errors.title ? "border-red-500" : ""}
          />
          {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="icon">Icon</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger>
              <SelectValue placeholder="Select an icon" />
            </SelectTrigger>
            <SelectContent>
              {ICONS.map((iconName) => (
                <SelectItem key={iconName} value={iconName}>{iconName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="getting-started"
            className={errors.slug ? "border-red-500" : ""}
          />
          {errors.slug && <p className="text-sm text-red-500">{errors.slug}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="orderIndex">Order</Label>
          <Input
            id="orderIndex"
            type="number"
            value={orderIndex}
            onChange={(e) => setOrderIndex(parseInt(e.target.value))}
            placeholder="1"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content (JSON)</Label>
          <Textarea
            id="content"
            value={contentJSON}
            onChange={(e) => setContentJSON(e.target.value)}
            rows={15}
            className={`font-mono ${errors.content ? "border-red-500" : ""}`}
          />
          {errors.content && <p className="text-sm text-red-500">{errors.content}</p>}
          
          <p className="text-sm text-muted-foreground mt-2">
            Content should be a JSON array of content blocks.
          </p>
          
          <Card className="bg-muted/50 border-dashed">
            <CardHeader className="py-3">
              <CardTitle className="text-sm">Example Content Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs overflow-auto max-h-40 p-2 bg-muted rounded-md">
{`[
  {
    "type": "heading",
    "level": 2,
    "content": "Getting Started"
  },
  {
    "type": "paragraph",
    "content": "This is an introduction paragraph."
  },
  {
    "type": "callout",
    "style": "info",
    "title": "Important Note",
    "content": "Read this documentation carefully."
  }
]`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <div className="space-x-2">
          {sectionId && (
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isDeleting || isSaving}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          )}
          <Button 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : sectionId ? "Update" : "Create"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AdminDocumentationEditor;
