import { useState } from "react";
import { Clock, Filter, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const AuditLogsSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // Mock audit logs data
  const auditLogs = [
    {
      id: "log-1",
      timestamp: "2023-11-15T14:32:45Z",
      action: "API Key Generated",
      details: "New API key created for project 'My Solana dApp'",
      user: "demo@example.com",
      ip: "192.168.1.1",
      type: "api"
    },
    {
      id: "log-2",
      timestamp: "2023-11-15T13:21:10Z",
      action: "Login Successful",
      details: "User logged in via email verification",
      user: "demo@example.com",
      ip: "192.168.1.1",
      type: "auth"
    },
    {
      id: "log-3",
      timestamp: "2023-11-14T18:45:22Z",
      action: "Transaction Secured",
      details: "High-risk transaction verified with biometric auth",
      user: "demo@example.com",
      ip: "192.168.1.1",
      type: "security"
    },
    {
      id: "log-4",
      timestamp: "2023-11-14T16:12:05Z",
      action: "Project Created",
      details: "New project 'Test Project' created",
      user: "demo@example.com",
      ip: "192.168.1.1",
      type: "project"
    },
    {
      id: "log-5",
      timestamp: "2023-11-13T09:34:18Z",
      action: "API Key Revoked",
      details: "API key for 'Old Project' was revoked",
      user: "demo@example.com",
      ip: "192.168.1.1",
      type: "api"
    }
  ];
  
  // Filter logs based on search term and filter type
  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || log.type === filterType;
    
    return matchesSearch && matchesFilter;
  });
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Audit Logs</h3>
        <p className="text-muted-foreground mb-6">
          Track all activity and security events across your GuardianLayer account.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <select 
            className="px-3 py-2 rounded-md border"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="auth">Authentication</option>
            <option value="api">API Keys</option>
            <option value="security">Security</option>
            <option value="project">Projects</option>
          </select>
          <Button variant="outline" className="flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        
        <div className="space-y-3">
          {filteredLogs.length > 0 ? (
            filteredLogs.map(log => (
              <div key={log.id} className="p-4 border rounded-md hover:bg-muted/20 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{formatTimestamp(log.timestamp)}</span>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`
                      ${log.type === 'auth' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' : ''}
                      ${log.type === 'api' ? 'bg-purple-500/10 text-purple-500 border-purple-500/20' : ''}
                      ${log.type === 'security' ? 'bg-red-500/10 text-red-500 border-red-500/20' : ''}
                      ${log.type === 'project' ? 'bg-green-500/10 text-green-500 border-green-500/20' : ''}
                    `}
                  >
                    {log.type.toUpperCase()}
                  </Badge>
                </div>
                <h4 className="font-semibold">{log.action}</h4>
                <p className="text-sm">{log.details}</p>
                <div className="mt-2 pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between text-xs text-muted-foreground">
                  <span>User: {log.user}</span>
                  <span>IP: {log.ip}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No logs found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditLogsSection;