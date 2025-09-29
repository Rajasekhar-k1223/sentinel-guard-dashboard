import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, AlertTriangle, Eye, Zap, Activity } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ViewInsightDialog from '@/components/dialogs/ViewInsightDialog';
import ViewModelDialog from '@/components/dialogs/ViewModelDialog';

interface AIInsight {
  id: string;
  type: 'anomaly' | 'threat' | 'recommendation' | 'prediction';
  title: string;
  description: string;
  confidence: number;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  affectedAssets: string[];
  status: 'new' | 'reviewed' | 'dismissed' | 'actioned';
}

const mockAIInsights: AIInsight[] = [
  {
    id: 'AI-001',
    type: 'anomaly',
    title: 'Unusual Network Traffic Pattern Detected',
    description: 'AI detected 347% increase in outbound traffic from DB-SERVER-01 during off-hours',
    confidence: 94,
    severity: 'high',
    timestamp: '2024-01-15 14:35:22',
    affectedAssets: ['DB-SERVER-01'],
    status: 'new'
  },
  {
    id: 'AI-002',
    type: 'threat',
    title: 'Potential Insider Threat Activity',
    description: 'User access pattern suggests possible data exfiltration attempt',
    confidence: 87,
    severity: 'high',
    timestamp: '2024-01-15 14:30:15',
    affectedAssets: ['FILE-SERVER-01', 'DB-SERVER-01'],
    status: 'reviewed'
  },
  {
    id: 'AI-003',
    type: 'recommendation',
    title: 'Security Policy Enhancement Suggested',
    description: 'AI recommends implementing additional MFA controls for admin accounts',
    confidence: 91,
    severity: 'medium',
    timestamp: '2024-01-15 14:25:08',
    affectedAssets: ['AD-CONTROLLER'],
    status: 'actioned'
  },
  {
    id: 'AI-004',
    type: 'prediction',
    title: 'Potential System Compromise Forecast',
    description: 'Predictive model indicates 76% likelihood of compromise within 48 hours',
    confidence: 76,
    severity: 'high',
    timestamp: '2024-01-15 14:20:33',
    affectedAssets: ['WEB-SERVER-02'],
    status: 'new'
  }
];

interface AIModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'threat_classification' | 'behavioral_analysis' | 'predictive';
  status: 'active' | 'training' | 'inactive';
  accuracy: number;
  lastTrained: string;
  predictions: number;
}

const mockAIModels: AIModel[] = [
  {
    id: 'MODEL-001',
    name: 'Network Anomaly Detector',
    type: 'anomaly_detection',
    status: 'active',
    accuracy: 94.2,
    lastTrained: '2024-01-14 02:00:00',
    predictions: 1247
  },
  {
    id: 'MODEL-002',
    name: 'Malware Classifier',
    type: 'threat_classification',
    status: 'active',
    accuracy: 98.7,
    lastTrained: '2024-01-13 03:30:00',
    predictions: 892
  },
  {
    id: 'MODEL-003',
    name: 'User Behavior Analytics',
    type: 'behavioral_analysis',
    status: 'training',
    accuracy: 89.5,
    lastTrained: '2024-01-15 14:00:00',
    predictions: 567
  },
  {
    id: 'MODEL-004',
    name: 'Threat Intelligence Predictor',
    type: 'predictive',
    status: 'active',
    accuracy: 85.3,
    lastTrained: '2024-01-12 01:15:00',
    predictions: 234
  }
];

interface AIStats {
  totalInsights: number;
  highSeverity: number;
  modelsActive: number;
  avgAccuracy: number;
}

const aiStats: AIStats = {
  totalInsights: 156,
  highSeverity: 23,
  modelsActive: 3,
  avgAccuracy: 91.7
};

export default function AIAnalysis() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [isInsightDialogOpen, setIsInsightDialogOpen] = useState(false);
  const [isModelDialogOpen, setIsModelDialogOpen] = useState(false);
  const [insights, setInsights] = useState<AIInsight[]>(mockAIInsights);
  const [models, setModels] = useState<AIModel[]>(mockAIModels);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'anomaly': return 'text-warning';
      case 'threat': return 'text-critical';
      case 'recommendation': return 'text-success';
      case 'prediction': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getTypeBadge = (type: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      anomaly: 'secondary',
      threat: 'destructive',
      recommendation: 'default',
      prediction: 'outline'
    };
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      high: 'destructive',
      medium: 'secondary',
      low: 'outline'
    };
    return (
      <Badge variant={variants[severity] || 'outline'}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      new: 'destructive',
      reviewed: 'secondary',
      actioned: 'default',
      dismissed: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const getModelStatusBadge = (status: string) => {
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

  const handleInsightStatusChange = (id: string, status: string) => {
    setInsights(prev => prev.map(insight => 
      insight.id === id ? { ...insight, status: status as AIInsight['status'] } : insight
    ));
    toast({
      title: "Status Updated",
      description: `Insight status changed to ${status}`,
    });
  };

  const handleModelAction = (id: string, action: string) => {
    setModels(prev => prev.map(model => {
      if (model.id === id) {
        switch (action) {
          case 'pause':
            return { ...model, status: 'inactive' as AIModel['status'] };
          case 'activate':
            return { ...model, status: 'active' as AIModel['status'] };
          case 'retrain':
            return { ...model, status: 'training' as AIModel['status'] };
          default:
            return model;
        }
      }
      return model;
    }));
    toast({
      title: "Model Action",
      description: `Model ${action} initiated successfully`,
    });
  };

  const handleViewInsight = (insight: AIInsight) => {
    setSelectedInsight(insight);
    setIsInsightDialogOpen(true);
  };

  const handleViewModel = (model: AIModel) => {
    setSelectedModel(model);
    setIsModelDialogOpen(true);
  };

  const filteredInsights = insights.filter(insight => {
    const matchesType = selectedType === 'all' || insight.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || insight.severity === selectedSeverity;
    return matchesType && matchesSeverity;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">AI Analysis</h1>
          <p className="text-muted-foreground">AI-powered security insights and threat detection</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/train-model')}>
          <Brain className="h-4 w-4" />
          Train Model
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aiStats.totalInsights}</p>
                <p className="text-sm text-muted-foreground">AI Insights</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aiStats.highSeverity}</p>
                <p className="text-sm text-muted-foreground">High Severity</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aiStats.modelsActive}</p>
                <p className="text-sm text-muted-foreground">Active Models</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{aiStats.avgAccuracy}%</p>
                <p className="text-sm text-muted-foreground">Avg Accuracy</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* AI Models Performance */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>AI Models Performance</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Brain className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">{model.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {model.type.replace('_', ' ')} • Last trained: {model.lastTrained}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{model.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Accuracy</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{model.predictions}</p>
                    <p className="text-xs text-muted-foreground">Predictions</p>
                  </div>
                  
                  {getModelStatusBadge(model.status)}
                  
                  <Button variant="ghost" size="sm" onClick={() => handleViewModel(model)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="anomaly">Anomaly</SelectItem>
            <SelectItem value="threat">Threat</SelectItem>
            <SelectItem value="recommendation">Recommendation</SelectItem>
            <SelectItem value="prediction">Prediction</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* AI Insights */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>AI Security Insights</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredInsights.map((insight) => (
              <div
                key={insight.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Brain className={`h-5 w-5 ${getTypeColor(insight.type)}`} />
                  <div>
                    <h3 className="font-medium text-foreground">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Assets: {insight.affectedAssets.join(', ')}</span>
                      <span>Confidence: {insight.confidence}%</span>
                      <span>{insight.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-20">
                    <Progress value={insight.confidence} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-center">
                      {insight.confidence}%
                    </p>
                  </div>
                  
                  {getTypeBadge(insight.type)}
                  {getSeverityBadge(insight.severity)}
                  {getStatusBadge(insight.status)}
                  
                  <Button variant="ghost" size="sm" onClick={() => handleViewInsight(insight)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Dialogs */}
      <ViewInsightDialog
        insight={selectedInsight}
        open={isInsightDialogOpen}
        onOpenChange={setIsInsightDialogOpen}
        onStatusChange={handleInsightStatusChange}
      />
      
      <ViewModelDialog
        model={selectedModel}
        open={isModelDialogOpen}
        onOpenChange={setIsModelDialogOpen}
        onModelAction={handleModelAction}
      />
    </div>
  );
}