
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle } from "lucide-react";
import CodeBlock from "./CodeBlock";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const codeExamples = {
  nodejs: {
    authentication: `// Node.js authentication example
const { GuardianLayer } = require('@guardianlayer/server');

const guardian = new GuardianLayer({
  apiKey: process.env.GUARDIAN_SERVER_API_KEY, // Server API key
  environment: 'production' // or 'test'
});

// Verify user identity
async function verifyUser(userId, challengeResponse) {
  try {
    const result = await guardian.verifyIdentity({
      userId,
      challengeResponse,
      options: {
        requireMFA: true,
        auditLog: true
      }
    });
    
    return result.verified;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
}`,

    webhook: `// Express.js webhook verification
const express = require('express');
const { verifyGuardianWebhook } = require('@guardianlayer/server');
const app = express();

app.use(express.json());

app.post('/webhook/guardian', (req, res) => {
  const signature = req.headers['x-gl-signature'];
  
  // Verify webhook signature
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
    // Handle other events...
  }
  
  res.status(200).json({ received: true });
})`,

    transaction: `// Node.js transaction verification
const { GuardianLayer } = require('@guardianlayer/server');

const guardian = new GuardianLayer({
  apiKey: process.env.GUARDIAN_SERVER_API_KEY,
  environment: 'production'
});

// Server-side transaction verification
async function verifyTransaction(transaction) {
  try {
    // Check if this transaction is safe
    const analysis = await guardian.analyzeTransaction(transaction);
    
    if (analysis.risk === 'high') {
      // Reject high-risk transactions
      return {
        approved: false,
        reason: analysis.warnings.join(', ')
      };
    }
    
    if (analysis.risk === 'medium') {
      // For medium risk, log and notify but allow
      await guardian.logSecurityEvent({
        type: 'transaction.warning',
        userId: transaction.userId,
        details: {
          warnings: analysis.warnings,
          transactionId: transaction.id
        }
      });
    }
    
    return { approved: true };
  } catch (error) {
    console.error('Transaction verification error:', error);
    return { 
      approved: false, 
      reason: 'Verification error' 
    };
  }
}`
  },
  python: {
    authentication: `# Python authentication example
from guardianlayer import GuardianServerSDK

# Initialize the SDK
guardian = GuardianServerSDK(
    api_key=os.environ.get("GUARDIAN_SERVER_API_KEY"),
    environment="production"  # or "test"
)

# Verify user identity
async def verify_user(user_id, challenge_response):
    try:
        result = await guardian.verify_identity(
            user_id=user_id,
            challenge_response=challenge_response,
            options={
                "require_mfa": True,
                "audit_log": True
            }
        )
        
        return result.verified
    except Exception as e:
        print(f"Verification error: {e}")
        return False`,

    webhook: `# Flask webhook verification
from flask import Flask, request, jsonify
from guardianlayer import verify_guardian_webhook
import os

app = Flask(__name__)

@app.route('/webhook/guardian', methods=['POST'])
def guardian_webhook():
    signature = request.headers.get('x-gl-signature')
    
    # Verify webhook signature
    is_valid = verify_guardian_webhook(
        request.json,
        signature,
        os.environ.get('GUARDIAN_WEBHOOK_SECRET')
    )
    
    if not is_valid:
        return jsonify({"error": "Invalid signature"}), 401
    
    # Process the webhook based on event type
    event = request.json.get('event')
    data = request.json.get('data')
    
    if event == 'transaction.blocked':
        # Handle blocked transaction
        print(f"Blocked transaction: {data['transactionId']}")
    # Handle other events...
    
    return jsonify({"received": True})`,

    transaction: `# Python transaction verification
from guardianlayer import GuardianServerSDK
import os

# Initialize the SDK
guardian = GuardianServerSDK(
    api_key=os.environ.get("GUARDIAN_SERVER_API_KEY"),
    environment="production"
)

# Server-side transaction verification
async def verify_transaction(transaction):
    try:
        # Check if this transaction is safe
        analysis = await guardian.analyze_transaction(transaction)
        
        if analysis.risk == 'high':
            # Reject high-risk transactions
            return {
                "approved": False,
                "reason": ", ".join(analysis.warnings)
            }
        
        if analysis.risk == 'medium':
            # For medium risk, log and notify but allow
            await guardian.log_security_event(
                type="transaction.warning",
                user_id=transaction['user_id'],
                details={
                    "warnings": analysis.warnings,
                    "transaction_id": transaction['id']
                }
            )
        
        return {"approved": True}
    except Exception as e:
        print(f"Transaction verification error: {e}")
        return {
            "approved": False,
            "reason": "Verification error"
        }`
  },
  go: {
    authentication: `// Go authentication example
package main

import (
	"os"

	guardian "github.com/guardianlayer/go-sdk"
)

func main() {
	// Initialize the SDK
	gl := guardian.New(guardian.Config{
		APIKey:      os.Getenv("GUARDIAN_SERVER_API_KEY"),
		Environment: "production", // or "test"
	})

	// Verify user identity
	verified, err := verifyUser(gl, "user123", "challenge-response-token")
	if err != nil {
		// Handle error
	}
	
	if verified {
		// User is verified
	}
}

func verifyUser(gl *guardian.GuardianLayer, userID, challengeResponse string) (bool, error) {
	result, err := gl.VerifyIdentity(guardian.VerifyIdentityParams{
		UserID:            userID,
		ChallengeResponse: challengeResponse,
		Options: guardian.VerifyOptions{
			RequireMFA: true,
			AuditLog:   true,
		},
	})

	if err != nil {
		return false, err
	}

	return result.Verified, nil
}`,

    webhook: `// Go webhook verification
package main

import (
	"encoding/json"
	"net/http"
	"os"

	guardian "github.com/guardianlayer/go-sdk"
)

func main() {
	http.HandleFunc("/webhook/guardian", guardianWebhookHandler)
	http.ListenAndServe(":8080", nil)
}

func guardianWebhookHandler(w http.ResponseWriter, r *http.Request) {
	signature := r.Header.Get("x-gl-signature")

	var payload map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Verify webhook signature
	isValid := guardian.VerifyWebhook(
		payload,
		signature,
		os.Getenv("GUARDIAN_WEBHOOK_SECRET"),
	)

	if !isValid {
		http.Error(w, "Invalid signature", http.StatusUnauthorized)
		return
	}

	// Process the webhook based on event type
	event := payload["event"].(string)
	data := payload["data"].(map[string]interface{})

	switch event {
	case "transaction.blocked":
		// Handle blocked transaction
		txID := data["transactionId"].(string)
		// Process blocked transaction
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]bool{"received": true})
}`,

    transaction: `// Go transaction verification
package main

import (
	"os"

	guardian "github.com/guardianlayer/go-sdk"
)

func main() {
	// Initialize the SDK
	gl := guardian.New(guardian.Config{
		APIKey:      os.Getenv("GUARDIAN_SERVER_API_KEY"),
		Environment: "production",
	})

	// Example transaction
	tx := map[string]interface{}{
		"id":     "tx123",
		"from":   "0x1234567890",
		"to":     "0x0987654321",
		"amount": "5.0",
		"token":  "ETH",
		"userId": "user123",
	}

	// Verify transaction
	approved, reason, err := verifyTransaction(gl, tx)
	if err != nil {
		// Handle error
	}

	if approved {
		// Process transaction
	} else {
		// Transaction rejected
		// reason contains the rejection reason
	}
}

func verifyTransaction(gl *guardian.GuardianLayer, tx map[string]interface{}) (bool, string, error) {
	analysis, err := gl.AnalyzeTransaction(tx)
	if err != nil {
		return false, "Verification error", err
	}

	if analysis.Risk == "high" {
		// Join warnings into a string
		reason := ""
		for i, warning := range analysis.Warnings {
			if i > 0 {
				reason += ", "
			}
			reason += warning
		}
		return false, reason, nil
	}

	if analysis.Risk == "medium" {
		// For medium risk, log and notify but allow
		gl.LogSecurityEvent(guardian.SecurityEvent{
			Type:   "transaction.warning",
			UserID: tx["userId"].(string),
			Details: map[string]interface{}{
				"warnings":      analysis.Warnings,
				"transactionId": tx["id"],
			},
		})
	}

	return true, "", nil
}`
  }
};

const ServerSideApiSection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("nodejs");
  const [copiedSection, setCopiedSection] = useState<{ language: string, section: string } | null>(null);
  
  const handleCopy = (language: string, section: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection({ language, section });
    setTimeout(() => setCopiedSection(null), 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-xl shadow-md border border-border/50">
        <h3 className="text-xl font-bold mb-4">Server-Side API</h3>
        <p className="text-muted-foreground mb-6">
          How to integrate GuardianLayer security features in your backend services.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={selectedLanguage === "nodejs" ? "default" : "outline"}
            onClick={() => setSelectedLanguage("nodejs")}
          >
            Node.js
          </Button>
          <Button
            variant={selectedLanguage === "python" ? "default" : "outline"}
            onClick={() => setSelectedLanguage("python")}
          >
            Python
          </Button>
          <Button
            variant={selectedLanguage === "go" ? "default" : "outline"}
            onClick={() => setSelectedLanguage("go")}
          >
            Go
          </Button>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Verification</CardTitle>
              <CardDescription>Verify authentication challenges server-side</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={codeExamples[selectedLanguage].authentication}
                language={selectedLanguage === "nodejs" ? "javascript" : 
                         selectedLanguage === "python" ? "python" : "go"}
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(
                  selectedLanguage, 
                  "authentication", 
                  codeExamples[selectedLanguage].authentication
                )}
              >
                {copiedSection?.language === selectedLanguage && 
                 copiedSection?.section === "authentication" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Webhook Handling</CardTitle>
              <CardDescription>Securely receive and process GuardianLayer webhooks</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={codeExamples[selectedLanguage].webhook}
                language={selectedLanguage === "nodejs" ? "javascript" : 
                         selectedLanguage === "python" ? "python" : "go"}
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(
                  selectedLanguage, 
                  "webhook", 
                  codeExamples[selectedLanguage].webhook
                )}
              >
                {copiedSection?.language === selectedLanguage && 
                 copiedSection?.section === "webhook" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analysis</CardTitle>
              <CardDescription>Analyze transaction risk on the server</CardDescription>
            </CardHeader>
            <CardContent className="relative">
              <CodeBlock
                code={codeExamples[selectedLanguage].transaction}
                language={selectedLanguage === "nodejs" ? "javascript" : 
                         selectedLanguage === "python" ? "python" : "go"}
              />
              <Button 
                variant="ghost" 
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => handleCopy(
                  selectedLanguage, 
                  "transaction", 
                  codeExamples[selectedLanguage].transaction
                )}
              >
                {copiedSection?.language === selectedLanguage && 
                 copiedSection?.section === "transaction" ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServerSideApiSection;
