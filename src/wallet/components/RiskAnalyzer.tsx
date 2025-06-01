
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Activity,
  Eye,
  Database,
  Clock
} from 'lucide-react';
import { Transaction } from '@solana/web3.js';
import { RiskAnalysis } from '../types';

interface RiskAnalyzerProps {
  transaction: Transaction | null;
  onAnalysisComplete: (analysis: RiskAnalysis) => void;
}

interface RiskFactor {
  name: string;
  score: number;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface SmartContractRisk {
  address: string;
  verified: boolean;
  riskScore: number;
  issues: string[];
}

export const RiskAnalyzer: React.FC<RiskAnalyzerProps> = ({
  transaction,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<RiskAnalysis | null>(null);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [contractRisks, setContractRisks] = useState<SmartContractRisk[]>([]);

  useEffect(() => {
    if (transaction) {
      analyzeTransaction();
    }
  }, [transaction]);

  const analyzeTransaction = async () => {
    setIsAnalyzing(true);
    
    // Simulate comprehensive risk analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const factors: RiskFactor[] = [
      {
        name: 'Transaction Amount',
        score: 15,
        severity: 'low',
        description: 'Transaction amount is within normal range'
      },
      {
        name: 'Recipient Address',
        score: 25,
        severity: 'medium',
        description: 'New recipient address not in whitelist'
      },
      {
        name: 'Gas Fees',
        score: 10,
        severity: 'low',
        description: 'Gas fees are reasonable'
      },
      {
        name: 'Time of Day',
        score: 5,
        severity: 'low',
        description: 'Transaction during normal hours'
      },
      {
        name: 'Smart Contract Interaction',
        score: 30,
        severity: 'medium',
        description: 'Interacting with unverified contract'
      }
    ];

    const contracts: SmartContractRisk[] = [
      {
        address: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
        verified: false,
        riskScore: 65,
        issues: [
          'Unverified contract source code',
          'High complexity functions',
          'Recent deployment (< 30 days)'
        ]
      }
    ];

    setRiskFactors(factors);
    setContractRisks(contracts);

    const totalScore = factors.reduce((sum, factor) => sum + factor.score, 0);
    const avgScore = totalScore / factors.length;

    let level: 'safe' | 'medium' | 'high';
    let recommendation: string;

    if (avgScore < 15) {
      level = 'safe';
      recommendation = 'Transaction appears safe to proceed';
    } else if (avgScore < 25) {
      level = 'medium';
      recommendation = 'Exercise caution - consider additional verification';
    } else {
      level = 'high';
      recommendation = 'High risk detected - strongly recommend canceling transaction';
    }

    const riskAnalysis: RiskAnalysis = {
      level,
      score: Math.round(100 - avgScore * 3),
      reasons: factors.map(f => f.description),
      recommendation
    };

    setAnalysis(riskAnalysis);
    setIsAnalyzing(false);
    onAnalysisComplete(riskAnalysis);
  };

  const getRiskColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (!transaction) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5" />
            <span>Risk Analyzer</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transaction to analyze</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Advanced Risk Analysis</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isAnalyzing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 animate-pulse" />
              <span className="text-sm">Analyzing transaction risks...</span>
            </div>
            <Progress value={65} className="w-full" />
          </div>
        ) : analysis ? (
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="factors">Risk Factors</TabsTrigger>
              <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${
                    analysis.level === 'safe' ? 'bg-green-500' : 
                    analysis.level === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span className="font-semibold capitalize">{analysis.level} Risk</span>
                </div>
                <Badge variant={analysis.level === 'safe' ? 'default' : 'destructive'}>
                  {analysis.score}/100
                </Badge>
              </div>

              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm font-medium">Recommendation:</p>
                <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Risk Score Breakdown</span>
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Security Score</span>
                    <span>{analysis.score}/100</span>
                  </div>
                  <Progress value={analysis.score} className="w-full" />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="factors" className="space-y-4">
              <div className="space-y-3">
                {riskFactors.map((factor, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{factor.name}</span>
                      <Badge variant={factor.severity === 'low' ? 'default' : 'destructive'}>
                        {factor.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{factor.description}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Risk Impact</span>
                        <span>{factor.score}/100</span>
                      </div>
                      <Progress value={factor.score} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              {contractRisks.length > 0 ? (
                <div className="space-y-3">
                  {contractRisks.map((contract, index) => (
                    <div key={index} className="p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Database className="w-4 h-4" />
                          <span className="font-medium">Smart Contract</span>
                        </div>
                        <Badge variant={contract.verified ? 'default' : 'destructive'}>
                          {contract.verified ? 'Verified' : 'Unverified'}
                        </Badge>
                      </div>
                      
                      <code className="text-xs bg-muted p-2 rounded block mb-2">
                        {contract.address}
                      </code>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Risk Score</span>
                          <span>{contract.riskScore}/100</span>
                        </div>
                        <Progress value={contract.riskScore} className="h-2" />
                      </div>

                      {contract.issues.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-1">Issues Detected:</p>
                          <ul className="space-y-1">
                            {contract.issues.map((issue, issueIndex) => (
                              <li key={issueIndex} className="text-xs text-muted-foreground flex items-center space-x-2">
                                <AlertTriangle className="w-3 h-3 text-yellow-500" />
                                <span>{issue}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No smart contract interactions detected</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : null}
      </CardContent>
    </Card>
  );
};
