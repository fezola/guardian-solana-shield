
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Fingerprint, 
  Lock, 
  Mail, 
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { SecurityOptions as SecurityOptionsType } from '../types';

interface SecurityOptionsProps {
  onOptionsChange: (options: SecurityOptionsType) => void;
  defaultOptions?: SecurityOptionsType;
}

export const SecurityOptions: React.FC<SecurityOptionsProps> = ({ 
  onOptionsChange, 
  defaultOptions 
}) => {
  const [options, setOptions] = useState<SecurityOptionsType>(defaultOptions || {
    simulate: true,
    biometric: false,
    pin: false,
    otp: false,
    timeLockThreshold: 1.0,
    emailAddress: '',
  });

  const updateOption = (key: keyof SecurityOptionsType, value: any) => {
    const newOptions = { ...options, [key]: value };
    setOptions(newOptions);
    onOptionsChange(newOptions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-primary" />
          <span>Guardian Security Settings</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Simulation */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <Label htmlFor="simulate">Transaction Simulation</Label>
              <Badge variant="secondary">Recommended</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Simulate transactions before execution to detect risks
            </p>
          </div>
          <Switch
            id="simulate"
            checked={options.simulate}
            onCheckedChange={(checked) => updateOption('simulate', checked)}
          />
        </div>

        <Separator />

        {/* Biometric Authentication */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Fingerprint className="w-4 h-4 text-blue-500" />
              <Label htmlFor="biometric">Biometric Authentication</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Use fingerprint or face recognition for transactions
            </p>
          </div>
          <Switch
            id="biometric"
            checked={options.biometric}
            onCheckedChange={(checked) => updateOption('biometric', checked)}
          />
        </div>

        <Separator />

        {/* PIN Protection */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-green-500" />
              <Label htmlFor="pin">PIN Protection</Label>
            </div>
            <p className="text-sm text-muted-foreground">
              Require PIN for all transactions
            </p>
          </div>
          <Switch
            id="pin"
            checked={options.pin}
            onCheckedChange={(checked) => updateOption('pin', checked)}
          />
        </div>

        <Separator />

        {/* Email OTP */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <Label htmlFor="otp">Email OTP Verification</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Send verification codes to email for high-value transactions
              </p>
            </div>
            <Switch
              id="otp"
              checked={options.otp}
              onCheckedChange={(checked) => updateOption('otp', checked)}
            />
          </div>
          
          {options.otp && (
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={options.emailAddress || ''}
                onChange={(e) => updateOption('emailAddress', e.target.value)}
                placeholder="your@email.com"
              />
            </div>
          )}
        </div>

        <Separator />

        {/* Time Lock */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-amber-500" />
            <Label htmlFor="timelock">Time Lock Threshold</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Transactions above this amount require a time delay
          </p>
          <div className="space-y-2">
            <Label htmlFor="threshold">Amount (SOL)</Label>
            <Input
              id="threshold"
              type="number"
              step="0.1"
              value={options.timeLockThreshold || 1.0}
              onChange={(e) => updateOption('timeLockThreshold', parseFloat(e.target.value))}
              placeholder="1.0"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
