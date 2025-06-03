
import { Activity, AlertTriangle, CheckCircle, Clock, Globe, Key, Lock, Shield, UserCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProjects } from "@/hooks/useProjects";
import { useSecurityEvents } from "@/hooks/useSecurityEvents";
import { useApiUsage } from "@/hooks/useApiUsage";
import { useApiKeys } from "@/hooks/useApiKeys";
import { format } from "date-fns";

const DashboardSection = () => {
  const { projects, isLoading: projectsLoading } = useProjects();
  const { securityEvents, isLoading: eventsLoading } = useSecurityEvents();
  const { usageStats, recentUsage, isLoading: usageLoading } = useApiUsage();
  const { apiKeys, isLoading: keysLoading } = useApiKeys();

  // Calculate stats from real data
  const activeProjects = projects?.filter(p => p.status === 'active').length || 0;
  const totalApiKeys = apiKeys?.length || 0;
  const threatCount = securityEvents?.filter(e => e.severity === 'high' || e.severity === 'critical').length || 0;

  if (projectsLoading || eventsLoading || usageLoading || keysLoading) {
    return <div className="flex items-center justify-center p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span className="text-2xl font-bold">{activeProjects}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Projects in development</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary" />
              <span className="text-2xl font-bold">{usageStats?.totalRequests || 0}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{usageStats?.requestsThisMonth || 0} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Security Threats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-2xl font-bold">{threatCount}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">High/Critical severity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Key className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-2xl font-bold">{totalApiKeys}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active keys</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Security Events</CardTitle>
            <CardDescription>Latest security events across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            {securityEvents && securityEvents.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {securityEvents.slice(0, 5).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.event_type}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.severity === "critical" ? "bg-red-100 text-red-800" :
                          event.severity === "high" ? "bg-orange-100 text-orange-800" :
                          event.severity === "medium" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {event.severity.charAt(0).toUpperCase() + event.severity.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(event.created_at), 'MMM dd, yyyy')}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.status === "resolved" ? "bg-green-100 text-green-800" :
                          event.status === "investigating" ? "bg-yellow-100 text-yellow-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {event.status === "resolved" ? <CheckCircle className="h-3 w-3 mr-1" /> :
                           event.status === "investigating" ? <Clock className="h-3 w-3 mr-1" /> :
                           <AlertTriangle className="h-3 w-3 mr-1" />}
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No security events detected</p>
                <p className="text-sm">Your projects are secure</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Performance</CardTitle>
            <CardDescription>Response times and success rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Success Rate</span>
                  <span className="text-sm font-medium">
                    {usageStats?.totalRequests ? Math.round((usageStats.successfulRequests / usageStats.totalRequests) * 100) : 0}%
                  </span>
                </div>
                <Progress 
                  value={usageStats?.totalRequests ? (usageStats.successfulRequests / usageStats.totalRequests) * 100 : 0} 
                  className="h-2" 
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="text-sm font-medium">{usageStats?.averageResponseTime || 0}ms</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">Total Requests</span>
                  <span className="text-sm font-medium">{usageStats?.totalRequests || 0}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>Manage and monitor your active projects</CardDescription>
          </CardHeader>
          <CardContent>
            {projects && projects.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Environment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.slice(0, 10).map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{project.name}</div>
                          {project.description && (
                            <div className="text-xs text-muted-foreground truncate max-w-xs">
                              {project.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.environment === "production" ? "bg-red-100 text-red-800" :
                          project.environment === "staging" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {project.environment.charAt(0).toUpperCase() + project.environment.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          project.status === "active" ? "bg-green-100 text-green-800" :
                          project.status === "paused" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {project.status === "active" ? 
                            <CheckCircle className="h-3 w-3 mr-1" /> : 
                            <Clock className="h-3 w-3 mr-1" />}
                          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                        </span>
                      </TableCell>
                      <TableCell>{format(new Date(project.created_at), 'MMM dd, yyyy')}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No projects created yet</p>
                <p className="text-sm">Create your first project to get started</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
