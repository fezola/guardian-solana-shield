
import { useState } from "react";
import { Key, Shield, Mail, Fingerprint, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const AuthSection = () => {
  const navigate = useNavigate();

  const redirectToAuth = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Get Started with GuardianLayer</CardTitle>
          <CardDescription>
            Sign up or sign in to access your secure dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 border rounded-md bg-muted/30">
              <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-xs">Email Auth</p>
            </div>
            <div className="p-3 border rounded-md bg-muted/30">
              <Key className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-xs">Passkey</p>
            </div>
            <div className="p-3 border rounded-md bg-muted/30">
              <Fingerprint className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-xs">Biometric</p>
            </div>
          </div>
          
          <Button onClick={redirectToAuth} className="w-full">
            Sign In / Sign Up
          </Button>
        </CardContent>
      </Card>
      
      <div className="p-4 border rounded-md bg-amber-500/10 border-amber-500/30">
        <div className="flex items-center mb-2">
          <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
          <h4 className="font-semibold">Security Features</h4>
        </div>
        <p className="text-sm">
          GuardianLayer provides enterprise-grade security for your Solana applications with multi-factor authentication and recovery options.
        </p>
      </div>
    </div>
  );
};

export default AuthSection;
