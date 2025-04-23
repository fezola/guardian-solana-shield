
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useDocumentationSections } from "@/hooks/useDocumentationSections";
import { useSupabaseUser } from "@/hooks/useSupabaseUser";
import AdminDocumentationEditor from "@/components/AdminDocumentationEditor";

const AdminDocumentation = () => {
  const { data: sections, isLoading, error, refetch } = useDocumentationSections();
  const { profile, loading: userLoading } = useSupabaseUser();
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  
  const isAdmin = profile?.role === 'admin';
  
  if (userLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="text-center py-12">
            Loading user profile...
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12">
          <div className="max-w-lg mx-auto text-center py-12">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="mb-4 text-muted-foreground">
              You don't have permission to view this page. 
              Only administrators can manage documentation.
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleSuccess = () => {
    setEditingSectionId(null);
    setIsCreating(false);
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">Documentation Management</h1>
        
        {editingSectionId ? (
          <AdminDocumentationEditor
            sectionId={editingSectionId}
            defaultValues={sections?.find(s => s.id === editingSectionId)}
            onSuccess={handleSuccess}
            onCancel={() => setEditingSectionId(null)}
          />
        ) : isCreating ? (
          <AdminDocumentationEditor
            onSuccess={handleSuccess}
            onCancel={() => setIsCreating(false)}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Documentation Sections</h2>
              <Button onClick={() => setIsCreating(true)}>Add New Section</Button>
            </div>
            
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading documentation sections...
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                Error loading documentation sections
              </div>
            ) : sections?.length === 0 ? (
              <div className="text-center py-12 border rounded-lg bg-muted/30">
                <h3 className="text-lg font-medium mb-2">No Documentation Sections</h3>
                <p className="text-muted-foreground mb-4">
                  Start by adding your first documentation section.
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  Create First Section
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {sections?.map(section => (
                  <div 
                    key={section.id} 
                    className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/20"
                  >
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {section.slug} • Order: {section.order_index}
                      </div>
                    </div>
                    <Button 
                      variant="outline"
                      onClick={() => setEditingSectionId(section.id)}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDocumentation;
