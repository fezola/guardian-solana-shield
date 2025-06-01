
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Shield,
  Zap
} from 'lucide-react';
import { RiskAnalysis } from '../types';
import { Transaction } from '@solana/web3.js';

interface TransactionSimulatorProps {
  transaction: Transaction | null;
  onSimulationComplete: (analysis: RiskAnalysis) => void;
  isSimulating: boolean;
}

export const TransactionSimulator: React.FC<TransactionSimulatorProps> = ({
  transaction,
  onSimulationComplete,
  isSimulating
}) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);

  const simulationSteps = [
    'Parsing transaction instructions',
    'Checking account balances',
    'Validating signatures',
    'Analyzing smart contract interactions',
    'Calculating fees and slippage',
    'Risk assessment complete'
  ];

  useEffect(() => {
    if (isSimulating && transaction) {
      runSimulation();
    }
  }, [isSimulating, transaction]);

  const runSimulation = async () => {
    setProgress(0);
    setAnalysis(null);

    for (let i = 0; i < simulationSteps.length; i++) {
      setCurrentStep(simulationSteps[i]);
      setProgress(((i + 1) / simulationSteps.length) * 100);
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Generate mock risk analysis
    const mockAnalysis: RiskAnalysis = generateMockAnalysis();
    setAnalysis(mockAnalysis);
    onSimulationComplete(mockAnalysis);
  };

  const generateMockAnalysis = (): RiskAnalysis => {
    // This would be replaced with actual transaction analysis
    const randomRisk = Math.random();
    
    if (randomRisk < 0.7) {
      return {
        level: 'safe',
        score: 95,
        reasons: [
          'Standard SOL transfer',
          'Recipient address verified',
          'Reasonable gas fees',
          'No smart contract interactions'
        ],
        recommendation: 'Transaction appears safe to proceed'
      };
    } else if (randomRisk < 0.9) {
      return {
        level: 'medium',
        score: 65,
        reasons: [
          'High transaction amount',
          'New recipient address',
          'Above-average gas fees'
        ],
        recommendation: 'Exercise caution - consider additional verification'
      };
    } else {
      return {
        level: 'high',
        score: 25,
        reasons: [
          'Suspicious smart contract interaction',
          'Very high gas fees',
          'Unverified token program',
          'Potential MEV attack vector'
        ],
        recommendation: 'High risk detected - strongly recommend canceling transaction'
      };
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'safe': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'high': return <XCircle className="w-5 h-5 text-red-600" />;
      default: return <Shield className="w-5 h-5" />;
    }
  };

  if (!transaction && !isSimulating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-blue-500" />
            <span>Transaction Simulator</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transaction to simulate</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-500" />
          <span>Transaction Simulator</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSimulating && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 animate-spin" />
              <span className="text-sm">{currentStep}</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {getRiskIcon(analysis.level)}
                <span className={`font-semibold capitalize ${getRiskColor(analysis.level)}`}>
                  {analysis.level} Risk
                </span>
              </div>
              <Badge variant={analysis.level === 'safe' ? 'default' : 'destructive'}>
                Score: {analysis.score}/100
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Analysis Details:</h4>
              <ul className="space-y-1">
                {analysis.reasons.map((reason, index) => (
                  <li key={index} className="text-sm flex items-center space-x-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium">Recommendation:</p>
              <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
