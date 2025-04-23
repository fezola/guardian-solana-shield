
import { useState } from "react";
import { Calendar, Download, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Mock data for different log types
const transactionLogs = [
  { id: 1, timestamp: "2023-11-15T14:32:45Z", type: "transaction", action: "Simulated", details: "Transaction simulation completed", project: "My Solana dApp", status: "simulated" },
  { id: 2, timestamp: "2023-11-15T13:21:10Z", type: "transaction", action: "Blocked", details: "High-risk transaction blocked (unlimited approval)", project: "NFT Marketplace", status: "blocked" },
  { id: 3, timestamp: "2023-11-14T18:45:22Z", type: "transaction", action: "Allowed", details: "Medium-risk transaction allowed with user confirmation", project: "DeFi Dashboard", status: "allowed" },
  { id: 4, timestamp: "2023-11-14T16:12:05Z", type: "transaction", action: "Warned", details: "User warned about potential risks", project: "My Solana dApp", status: "warned" },
  { id: 5, timestamp: "2023-11-13T09:34:18Z", type: "transaction", action: "Simulated", details: "Transaction simulation completed", project: "NFT Marketplace", status: "simulated" },
];

const authLogs = [
  { id: 1, timestamp: "2023-11-15T15:45:22Z", type: "auth", action: "PIN Verified", details: "User verified with PIN", user: "demo@example.com", project: "My Solana dApp", status: "success" },
  { id: 2, timestamp: "2023-11-15T12:34:18Z", type: "auth", action: "Biometric Auth", details: "User authenticated with biometrics", user: "alex@example.com", project: "NFT Marketplace", status: "success" },
  { id: 3, timestamp: "2023-11-14T19:22:05Z", type: "auth", action: "OTP Failed", details: "Failed OTP verification attempt", user: "jordan@example.com", project: "DeFi Dashboard", status: "failure" },
  { id: 4, timestamp: "2023-11-14T11:15:30Z", type: "auth", action: "PIN Failed", details: "Multiple PIN verification failures", user: "demo@example.com", project: "My Solana dApp", status: "failure" },
  { id: 5, timestamp: "2023-11-13T08:45:10Z", type: "auth", action: "Biometric Auth", details: "User authenticated with biometrics", user: "alex@example.com", project: "NFT Marketplace", status: "success" },
];

const apiLogs = [
  { id: 1, timestamp: "2023-11-15T16:45:10Z", type: "api", action: "API Call", details: "secureTransaction() called", apiKey: "gl_live_abcd1234", project: "My Solana dApp", status: "success" },
  { id: 2, timestamp: "2023-11-15T14:22:30Z", type: "api", action: "API Call", details: "requireBiometric() called", apiKey: "gl_live_efgh5678", project: "NFT Marketplace", status: "success" },
  { id: 3, timestamp: "2023-11-14T20:10:15Z", type: "api", action: "Rate Limit", details: "Rate limit exceeded", apiKey: "gl_test_ijkl9012", project: "DeFi Dashboard", status: "failure" },
  { id: 4, timestamp: "2023-11-14T10:05:45Z", type: "api", action: "API Call", details: "verifyOTP() called", apiKey: "gl_live_abcd1234", project: "My Solana dApp", status: "success" },
  { id: 5, timestamp: "2023-11-13T09:30:20Z", type: "api", action: "Invalid Key", details: "Invalid API key used", apiKey: "gl_test_mnop3456", project: "Test Project", status: "failure" },
];

const LogsSection = () => {
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProject, setFilterProject] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Function to get logs based on active tab
  const getActiveLogs = () => {
    let logs = [];
    switch (activeTab) {
      case "transactions":
        logs = transactionLogs;
        break;
      case "auth":
        logs = authLogs;
        break;
      case "api":
        logs = apiLogs;
        break;
      default:
        logs = [...transactionLogs, ...authLogs, ...apiLogs];
    }
    
    // Apply filters
    return logs.filter(log => {
      const matchesSearch = JSON.stringify(log).toLowerCase().includes(searchTerm.toLowerCase());
      const matchesProject = filterProject === "all" || log.project === filterProject;
      const matchesStatus = filterStatus === "all" || log.status === filterStatus;
      
      return matchesSearch && matchesProject && matchesStatus;
    });
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Get unique project names for filter
  const projectNames = [...new Set([
    ...transactionLogs.map(log => log.project),
    ...authLogs.map(log => log.project),
    ...apiLogs.map(log => log.project)
  ])];
  
  // Get statuses based on active tab
  const getStatusOptions = () => {
    switch (activeTab) {
      case "transactions":
        return ["simulated", "blocked", "allowed", "warned"];
      case "auth":
        return ["success", "failure"];
      case "api":
        return ["success", "failure"];
      default:
        return ["simulated", "blocked", "allowed", "warned", "success", "failure"];
    }
  };
  
  const filteredLogs = getActiveLogs();
  
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Activity Logs</h3>
        <p className="text-muted-foreground mb-6">
          Comprehensive logs of all security-related events across your projects.
        </p>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="mb-4">
            <TabsTrigger value="transactions">Transaction Logs</TabsTrigger>
            <TabsTrigger value="auth">Authentication Logs</TabsTrigger>
            <TabsTrigger value="api">API Usage Logs</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={filterProject} onValueChange={setFilterProject}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projectNames.map((project) => (
                  <SelectItem key={project} value={project}>{project}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {getStatusOptions().map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead className="hidden md:table-cell">Details</TableHead>
                <TableHead className="hidden md:table-cell">Project</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2 text-muted-foreground" />
                        {formatTimestamp(log.timestamp)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs truncate">
                      {log.details}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{log.project}</TableCell>
                    <TableCell>
                      <Badge variant={
                        log.status === "blocked" || log.status === "failure" ? "destructive" :
                        log.status === "warned" ? "secondary" :
                        log.status === "allowed" || log.status === "success" ? "default" : "outline"
                      } className={
                        log.status === "allowed" || log.status === "success" ? "bg-green-500 hover:bg-green-600" : ""
                      }>
                        {log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No logs found matching your criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LogsSection;
