import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, TrendingUp, Activity, Settings, BarChart3, Database } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock model data (in real app, this would come from API)
const mockModel = {
  id: 'MODEL-001',
  name: 'Network Anomaly Detector',
  type: 'anomaly_detection',
  status: 'active',
  accuracy: 94.2,
  lastTrained: '2024-01-14 02:00:00',
  predictions: 1247,
  version: '2.1.3',
  description: 'Advanced neural network model designed to detect anomalous network traffic patterns and potential security threats in real-time.',
  architecture: 'Deep Autoencoder with LSTM layers',
  trainingData: {
    records: 2450000,
    timeframe: '6 months',
    sources: ['Network Logs', 'Firewall Events', 'IDS Alerts']
  },
  performance: {
    precision: 92.8,
    recall: 95.7,
    f1Score: 94.2,
    falsePositiveRate: 2.3
  },
  metrics: [
    { name: 'True Positives', value: 1156, change: '+12%' },
    { name: 'False Positives', value: 31, change: '-8%' },
    { name: 'True Negatives', value: 2847, change: '+3%' },
    { name: 'False Negatives', value: 18, change: '-15%' }
  ],
  features: [
    'Packet size distribution',
    'Connection frequency patterns',
    'Protocol usage analysis',
    'Temporal behavior modeling',
    'Destination IP clustering',
    'Port access patterns'
  ],
  recentPredictions: [
    { timestamp: '2024-01-15 14:35:22', prediction: 'Anomaly Detected', confidence: 94, outcome: 'True Positive' },
    { timestamp: '2024-01-15 14:12:45', prediction: 'Normal Traffic', confidence: 98, outcome: 'True Negative' },
    { timestamp: '2024-01-15 13:58:33', prediction: 'Anomaly Detected', confidence: 87, outcome: 'True Positive' },
    { timestamp: '2024-01-15 13:44:12', prediction: 'Normal Traffic', confidence: 96, outcome: 'True Negative' },
    { timestamp: '2024-01-15 13:31:55', prediction: 'Anomaly Detected', confidence: 91, outcome: 'False Positive' }
  ]
};

export default function ViewModel() {
  const navigate = useNavigate();
  const { id } = useParams();

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      active: 'default',
      training: 'secondary',
      inactive: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getOutcomeBadge = (outcome: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      'True Positive': 'default',
      'True Negative': 'default',
      'False Positive': 'destructive',
      'False Negative': 'destructive'
    };
    return (
      <Badge variant={variants[outcome] || 'outline'} className="text-xs">
        {outcome}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Model Details</h1>
            <p className="text-muted-foreground">Detailed view of AI model performance and configuration</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Settings className="h-4 w-4" />
            Configure
          </Button>
          <Button className="gap-2">
            <Brain className="h-4 w-4" />
            Retrain Model
          </Button>
        </div>
      </div>

      {/* Model Overview */}
      <SecurityCard>
        <SecurityCardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{mockModel.name}</h2>
                <p className="text-muted-foreground">v{mockModel.version} • {mockModel.type.replace('_', ' ')}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {getStatusBadge(mockModel.status)}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-2xl font-bold text-foreground">{mockModel.accuracy}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Predictions</p>
                <p className="text-2xl font-bold text-foreground">{mockModel.predictions.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Training Records</p>
                <p className="text-2xl font-bold text-foreground">{(mockModel.trainingData.records / 1000000).toFixed(1)}M</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BarChart3 className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">F1 Score</p>
                <p className="text-2xl font-bold text-foreground">{mockModel.performance.f1Score}%</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground mb-4">{mockModel.description}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Architecture</p>
                <p className="font-semibold text-foreground">{mockModel.architecture}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Trained</p>
                <p className="font-semibold text-foreground">{mockModel.lastTrained}</p>
              </div>
            </div>
          </div>
        </SecurityCardContent>
      </SecurityCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Metrics */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Performance Metrics</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-border/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Precision</p>
                  <p className="text-2xl font-bold text-foreground">{mockModel.performance.precision}%</p>
                </div>
                <div className="p-3 border border-border/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Recall</p>
                  <p className="text-2xl font-bold text-foreground">{mockModel.performance.recall}%</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {mockModel.metrics.map((metric, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">{metric.name}</p>
                      <p className="text-sm text-muted-foreground">{metric.change} from last period</p>
                    </div>
                    <p className="text-lg font-bold text-foreground">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Training Data */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Training Information</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-border/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Records</p>
                  <p className="text-lg font-bold text-foreground">{mockModel.trainingData.records.toLocaleString()}</p>
                </div>
                <div className="p-3 border border-border/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Timeframe</p>
                  <p className="text-lg font-bold text-foreground">{mockModel.trainingData.timeframe}</p>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
                <div className="space-y-2">
                  {mockModel.trainingData.sources.map((source, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-foreground">{source}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Feature Engineering</h4>
                <div className="space-y-2">
                  {mockModel.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Recent Predictions */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Predictions</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {mockModel.recentPredictions.map((prediction, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground font-mono">
                    {prediction.timestamp}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{prediction.prediction}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={prediction.confidence} className="h-2 w-24" />
                      <span className="text-xs text-muted-foreground">{prediction.confidence}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getOutcomeBadge(prediction.outcome)}
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}