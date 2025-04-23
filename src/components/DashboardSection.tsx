
import { Activity, AlertTriangle, CheckCircle, Clock, Globe, Key, Lock, Shield, UserCheck, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Mock data for dashboard
const securityEvents = [
  { id: 1, event: "Phishing Attempt Blocked", wallet: "0x1a2...3b4c", date: "2025-04-22", status: "blocked" },
  { id: 2, event: "Timelock Trigger", wallet: "0x5d6...7e8f", date: "2025-04-21", status: "triggered" },
  { id: 3, event: "Suspicious Transaction", wallet: "0x9g0...1h2i", date: "2025-04-20", status: "flagged" },
  { id: 4, event: "Multiple Auth Failures", wallet: "0x3j4...5k6l", date: "2025-04-20", status: "blocked" },
  { id: 5, event: "Recovery Attempt", wallet: "0x7m8...9n0o", date: "2025-04-19", status: "verified" },
];

const geoData = [
  { country: "United States", percent: 35 },
  { country: "Germany", percent: 18 },
  { country: "Singapore", percent: 15 },
  { country: "United Kingdom", percent: 12 },
  { country: "Others", percent: 20 },
];

const flaggedTransactions = [
  { 
    id: "tx-001", 
    type: "Transfer", 
    from: "0x1a2...3b4c", 
    to: "0x5d6...7e8f", 
    amount: "5.2 ETH", 
    risk: "high", 
    reason: "Suspicious recipient (known scammer)", 
    action: "blocked" 
  },
  { 
    id: "tx-002", 
    type: "Approval", 
    from: "0x9g0...1h2i", 
    to: "0x3j4...5k6l", 
    amount: "∞", 
    risk: "high", 
    reason: "Unlimited approval", 
    action: "allowed" 
  },
  { 
    id: "tx-003", 
    type: "Swap", 
    from: "0x7m8...9n0o", 
    to: "0xp1q...r2s3", 
    amount: "1,250 USDC", 
    risk: "medium", 
    reason: "High slippage (15%)", 
    action: "warned" 
  },
  { 
    id: "tx-004", 
    type: "NFT Purchase", 
    from: "0xt4u...v5w6", 
    to: "0xx7y...z8a9", 
    amount: "0.8 ETH", 
    risk: "medium", 
    reason: "Price significantly above floor", 
    action: "flagged" 
  },
  { 
    id: "tx-005", 
    type: "Transfer", 
    from: "0xb1c...d2e3", 
    to: "0xf4g...h5i6", 
    amount: "200,000 USDC", 
    risk: "high", 
    reason: "Unusual amount for this wallet", 
    action: "blocked" 
  },
];

const integrationHealth = [
  { project: "My Solana dApp", sdkVersion: "1.3.2", lastPing: "2 minutes ago", status: "healthy" },
  { project: "NFT Marketplace", sdkVersion: "1.3.1", lastPing: "5 hours ago", status: "healthy" },
  { project: "DeFi Dashboard", sdkVersion: "1.2.8", lastPing: "2 days ago", status: "outdated" },
];

const DashboardSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protected Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2 text-primary" />
              <span className="text-2xl font-bold">2,546</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+124 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions Secured</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2 text-primary" />
              <span className="text-2xl font-bold">18,354</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+2,841 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              <span className="text-2xl font-bold">347</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">+43 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-green-500" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">3 in development</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Latest Security Events</CardTitle>
            <CardDescription>Recent security events across your projects</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{event.event}</TableCell>
                    <TableCell className="font-mono text-sm">{event.wallet}</TableCell>
                    <TableCell>{event.date}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        event.status === "blocked" ? "bg-red-100 text-red-800" :
                        event.status === "triggered" ? "bg-yellow-100 text-yellow-800" :
                        event.status === "flagged" ? "bg-orange-100 text-orange-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {event.status === "blocked" ? <XCircle className="h-3 w-3 mr-1" /> :
                         event.status === "triggered" ? <Clock className="h-3 w-3 mr-1" /> :
                         event.status === "flagged" ? <AlertTriangle className="h-3 w-3 mr-1" /> :
                         <CheckCircle className="h-3 w-3 mr-1" />}
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Geographies</CardTitle>
            <CardDescription>User distribution by country</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {geoData.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center">
                      <Globe className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-sm">{item.country}</span>
                    </div>
                    <span className="text-sm font-medium">{item.percent}%</span>
                  </div>
                  <Progress value={item.percent} className="h-1" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Flagged Transactions</CardTitle>
            <CardDescription>Recently flagged or blocked transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {flaggedTransactions.map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{tx.type}</div>
                        <div className="text-xs text-muted-foreground font-mono">
                          {tx.from.substring(0, 8)}...→{tx.to.substring(0, 8)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tx.risk === "high" ? "bg-red-100 text-red-800" :
                        tx.risk === "medium" ? "bg-yellow-100 text-yellow-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {tx.risk.charAt(0).toUpperCase() + tx.risk.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{tx.reason}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        tx.action === "blocked" ? "bg-red-100 text-red-800" :
                        tx.action === "warned" ? "bg-yellow-100 text-yellow-800" :
                        tx.action === "flagged" ? "bg-orange-100 text-orange-800" :
                        "bg-green-100 text-green-800"
                      }`}>
                        {tx.action.charAt(0).toUpperCase() + tx.action.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Health</CardTitle>
            <CardDescription>Status of your SDK integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>SDK Version</TableHead>
                  <TableHead>Last Ping</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {integrationHealth.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.project}</TableCell>
                    <TableCell className="font-mono text-sm">{item.sdkVersion}</TableCell>
                    <TableCell>{item.lastPing}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        item.status === "healthy" ? "bg-green-100 text-green-800" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>
                        {item.status === "healthy" ? 
                          <CheckCircle className="h-3 w-3 mr-1" /> : 
                          <AlertTriangle className="h-3 w-3 mr-1" />}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardSection;
