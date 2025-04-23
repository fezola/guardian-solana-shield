
import { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import CodeBlock from "./CodeBlock";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle } from "lucide-react";

const frameworks = [
  { id: "react", name: "React" },
  { id: "nextjs", name: "Next.js" },
  { id: "vanilla", name: "Vanilla JS" },
  { id: "flutter", name: "Flutter" },
  { id: "react-native", name: "React Native" }
];

const codeExamples = {
  react: {
    installation: `npm install @guardianlayer/react @guardianlayer/sdk`,
    basicSetup: `// src/App.jsx
import { GuardianProvider } from '@guardianlayer/react';

function App() {
  return (
    <GuardianProvider 
      apiKey={process.env.REACT_APP_GUARDIAN_API_KEY}
      environment="production" // or "test"
    >
      <YourApp />
    </GuardianProvider>
  );
}

export default App;`,
    secureTransaction: `// src/components/SendButton.jsx
import { useGuardian } from '@guardianlayer/react';

function SendButton({ transaction }) {
  const { secureTransaction } = useGuardian();
  
  const handleSend = async () => {
    try {
      await secureTransaction({
        transaction,
        wallet: yourWalletProvider,
        userEmail: "user@example.com", // For OTP if needed
        options: {
          riskLevel: "auto", // or "low", "medium", "high"
          biometric: true,
          otp: true,
          simulate: true
        }
      });
      
      // Transaction was approved and secured
      console.log("Transaction secured successfully");
      
    } catch (error) {
      // Transaction was rejected or failed security checks
      console.error("Transaction security failed:", error);
    }
  };
  
  return <button onClick={handleSend}>Send Securely</button>;
}`
  },
  nextjs: {
    installation: `npm install @guardianlayer/react @guardianlayer/sdk`,
    basicSetup: `// src/app/layout.jsx
"use client";
import { GuardianProvider } from '@guardianlayer/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GuardianProvider 
          apiKey={process.env.NEXT_PUBLIC_GUARDIAN_API_KEY}
          environment="production" // or "test"
        >
          {children}
        </GuardianProvider>
      </body>
    </html>
  );
}`,
    secureTransaction: `// src/app/components/SendButton.jsx
"use client";
import { useGuardian } from '@guardianlayer/react';

export default function SendButton({ transaction }) {
  const { secureTransaction } = useGuardian();
  
  const handleSend = async () => {
    try {
      await secureTransaction({
        transaction,
        wallet: yourWalletProvider,
        userEmail: "user@example.com",
        options: {
          riskLevel: "auto",
          biometric: true,
          otp: true,
          simulate: true
        }
      });
      
      // Transaction was approved and secured
      console.log("Transaction secured successfully");
      
    } catch (error) {
      // Transaction was rejected or failed security checks
      console.error("Transaction security failed:", error);
    }
  };
  
  return <button onClick={handleSend}>Send Securely</button>;
}`
  },
  vanilla: {
    installation: `npm install @guardianlayer/sdk`,
    basicSetup: `// Initialize GuardianLayer SDK
import { GuardianLayer } from '@guardianlayer/sdk';

const guardian = new GuardianLayer({
  apiKey: "YOUR_PUBLIC_API_KEY",
  environment: "production", // or "test"
  wallet: yourWalletProvider
});`,
    secureTransaction: `// Secure a transaction
const secureAndSendTransaction = async (transaction) => {
  try {
    await guardian.secureTransaction({
      transaction,
      userEmail: "user@example.com", // For OTP if needed
      options: {
        riskLevel: "auto", // or "low", "medium", "high"
        biometric: true,
        otp: true,
        simulate: true
      }
    });
    
    // Transaction was approved and secured
    console.log("Transaction secured successfully");
    
  } catch (error) {
    // Transaction was rejected or failed security checks
    console.error("Transaction security failed:", error);
  }
};

// Usage
document.getElementById('send-button').addEventListener('click', () => {
  secureAndSendTransaction(yourTransaction);
});`
  },
  flutter: {
    installation: `flutter pub add guardianlayer_sdk`,
    basicSetup: `// Initialize GuardianLayer SDK in your app
import 'package:guardianlayer_sdk/guardianlayer_sdk.dart';

void main() {
  GuardianLayer.initialize(
    apiKey: "YOUR_PUBLIC_API_KEY",
    environment: "production", // or "test"
  );
  runApp(MyApp());
}`,
    secureTransaction: `// In your transaction widget
import 'package:guardianlayer_sdk/guardianlayer_sdk.dart';

class SendButton extends StatelessWidget {
  final Transaction transaction;
  
  const SendButton({required this.transaction, Key? key}) : super(key: key);
  
  Future<void> _secureAndSendTransaction() async {
    try {
      await GuardianLayer.secureTransaction(
        transaction: transaction,
        userEmail: "user@example.com",
        options: TransactionOptions(
          riskLevel: RiskLevel.auto,
          biometric: true,
          otp: true,
          simulate: true
        )
      );
      
      // Transaction was approved and secured
      print("Transaction secured successfully");
      
    } catch (error) {
      // Transaction was rejected or failed security checks
      print("Transaction security failed: $error");
    }
  }
  
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: _secureAndSendTransaction,
      child: Text('Send Securely'),
    );
  }
}`
  },
  "react-native": {
    installation: `npm install @guardianlayer/react-native`,
    basicSetup: `// App.js
import { GuardianProvider } from '@guardianlayer/react-native';

export default function App() {
  return (
    <GuardianProvider 
      apiKey="YOUR_PUBLIC_API_KEY"
      environment="production" // or "test"
    >
      <YourApp />
    </GuardianProvider>
  );
}`,
    secureTransaction: `// In your component
import { useGuardian } from '@guardianlayer/react-native';
import { Button } from 'react-native';

function SendButton({ transaction }) {
  const { secureTransaction } = useGuardian();
  
  const handleSend = async () => {
    try {
      await secureTransaction({
        transaction,
        wallet: yourWalletProvider,
        userEmail: "user@example.com",
        options: {
          riskLevel: "auto",
          biometric: true,
          otp: true,
          simulate: true
        }
      });
      
      // Transaction was approved and secured
      console.log("Transaction secured successfully");
      
    } catch (error) {
      // Transaction was rejected or failed security checks
      console.error("Transaction security failed:", error);
    }
  };
  
  return <Button title="Send Securely" onPress={handleSend} />;
}`
  }
};

const webhookExample = `// Express.js example
const express = require('express');
const { verifyGuardianWebhook } = require('@guardianlayer/sdk');
const app = express();

app.use(express.json());

app.post('/webhook/guardian', (req, res) => {
  const signature = req.headers['x-gl-signature'];
  
  // Verify webhook signature with your webhook secret
  const isValid = verifyGuardianWebhook(
    req.body, 
    signature, 
    process.env.GUARDIAN_WEBHOOK_SECRET
  );
  
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid signature' });
  }
  
  // Process the webhook based on event type
  const { event, data } = req.body;
  
  switch (event) {
    case 'transaction.blocked':
      // Handle blocked transaction
      console.log('Blocked transaction:', data.transactionId);
      break;
    case 'transaction.flagged':
      // Handle flagged transaction
      console.log('Flagged transaction:', data.transactionId);
      break;
    case 'auth.failed':
      // Handle authentication failure
      console.log('Auth failed for user:', data.userId);
      break;
    // Handle other events...
  }
  
  res.status(200).json({ received: true });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});`;

const SdkIntegrationSection = () => {
  const [selectedFramework, setSelectedFramework] = useState("react");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  const handleCopy = (code: string, section: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">SDK Integration</h3>
        <p className="text-muted-foreground mb-6">
          Get started with integrating GuardianLayer into your application.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {frameworks.map((framework) => (
            <Button
              key={framework.id}
              variant={selectedFramework === framework.id ? "default" : "outline"}
              onClick={() => setSelectedFramework(framework.id)}
            >
              {framework.name}
            </Button>
          ))}
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>Install the required packages</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={codeExamples[selectedFramework].installation}
                language="bash"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(codeExamples[selectedFramework].installation, "installation")}
              >
                {copiedSection === "installation" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Basic Setup</CardTitle>
              <CardDescription>Initialize the SDK in your application</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={codeExamples[selectedFramework].basicSetup}
                language="javascript"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(codeExamples[selectedFramework].basicSetup, "basicSetup")}
              >
                {copiedSection === "basicSetup" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Secure Transaction</CardTitle>
              <CardDescription>Implement transaction security in your application</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={codeExamples[selectedFramework].secureTransaction}
                language="javascript"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(codeExamples[selectedFramework].secureTransaction, "secureTransaction")}
              >
                {copiedSection === "secureTransaction" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Webhook Integration</h3>
        <p className="text-muted-foreground mb-6">
          Set up webhooks to receive real-time notifications about security events.
        </p>
        
        <div className="space-y-4">
          <p className="text-sm">
            GuardianLayer can send webhooks to your server when important security events occur, 
            such as blocked transactions, failed authentication attempts, or suspicious activities.
          </p>
          
          <Card>
            <CardHeader>
              <CardTitle>Webhook Handler Example</CardTitle>
              <CardDescription>Example code for handling GuardianLayer webhooks</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={webhookExample}
                language="javascript"
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(webhookExample, "webhook")}
              >
                {copiedSection === "webhook" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Available Webhook Events</CardTitle>
              <CardDescription>Events you can subscribe to</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Key Payload Properties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>transaction.blocked</TableCell>
                    <TableCell>A transaction was blocked due to security concerns</TableCell>
                    <TableCell>transactionId, reason, riskLevel</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>transaction.flagged</TableCell>
                    <TableCell>A transaction was flagged as suspicious</TableCell>
                    <TableCell>transactionId, flags, riskLevel</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>auth.failed</TableCell>
                    <TableCell>Authentication attempt failed</TableCell>
                    <TableCell>userId, method, reason</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>auth.success</TableCell>
                    <TableCell>Authentication completed successfully</TableCell>
                    <TableCell>userId, method</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>recovery.initiated</TableCell>
                    <TableCell>Wallet recovery process was initiated</TableCell>
                    <TableCell>recoveryId, method</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Import Table components
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default SdkIntegrationSection;
