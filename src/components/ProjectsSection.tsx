
import { useState } from "react";
import { Plus, Settings, Trash2, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";

const ProjectsSection = () => {
  const { projects, isLoading, createProject, isCreating } = useProjects();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    environment: "development" as "development" | "staging" | "production"
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) return;
    
    createProject(newProject);
    setIsCreateDialogOpen(false);
    setNewProject({ name: "", description: "", environment: "development" });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-muted-foreground">Manage your GuardianLayer projects</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Set up a new project to organize your security configurations.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="My Awesome dApp"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="A brief description of your project..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select 
                  value={newProject.environment} 
                  onValueChange={(value: "development" | "staging" | "production") => 
                    setNewProject({ ...newProject, environment: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="staging">Staging</SelectItem>
                    <SelectItem value="production">Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleCreateProject}
                disabled={isCreating || !newProject.name.trim()}
              >
                {isCreating ? "Creating..." : "Create Project"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>
                      {project.description || "No description provided"}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      project.environment === 'production' ? 'destructive' : 
                      project.environment === 'staging' ? 'default' : 
                      'secondary'
                    }>
                      {project.environment.charAt(0).toUpperCase() + project.environment.slice(1)}
                    </Badge>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Active' : project.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Created {format(new Date(project.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      {project.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first project to start securing your Solana applications.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ProjectsSection;
