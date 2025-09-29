import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Brain, Activity, TrendingUp, Play, Pause, Settings } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'threat_classification' | 'behavioral_analysis' | 'predictive';
  status: 'active' | 'training' | 'inactive';
  accuracy: number;
  lastTrained: string;
  predictions: number;
}

interface ViewModelDialogProps {
  model: AIModel | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onModelAction: (id: string, action: string) => void;
}

export default function ViewModelDialog({ model, open, onOpenChange, onModelAction }: ViewModelDialogProps) {
  if (!model) return null;

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'anomaly_detection': return 'text-warning';
      case 'threat_classification': return 'text-critical';
      case 'behavioral_analysis': return 'text-primary';
      case 'predictive': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const mockMetrics = {
    precision: 92.4,
    recall: 89.7,
    f1Score: 91.0,
    falsePositives: 15,
    falseNegatives: 8,
    totalSamples: 10450
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Brain className={`h-6 w-6 ${getTypeColor(model.type)}`} />
            AI Model Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">{model.name}</h2>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {model.type.replace('_', ' ').toUpperCase()}
              </Badge>
              {getModelStatusBadge(model.status)}
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h3 className="font-medium text-foreground">Accuracy</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">{model.accuracy}%</p>
              <Progress value={model.accuracy} className="h-2 mt-2" />
            </div>

            <div className="p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-success" />
                <h3 className="font-medium text-foreground">Predictions</h3>
              </div>
              <p className="text-2xl font-bold text-foreground">{model.predictions.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground mt-1">Total processed</p>
            </div>

            <div className="p-4 bg-accent/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Brain className="h-5 w-5 text-warning" />
                <h3 className="font-medium text-foreground">Last Trained</h3>
              </div>
              <p className="text-sm font-medium text-foreground">{model.lastTrained}</p>
              <p className="text-sm text-muted-foreground mt-1">Training completed</p>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="space-y-4">
            <h3 className="font-medium text-foreground">Performance Metrics</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Precision</span>
                  <span className="text-sm font-medium text-foreground">{mockMetrics.precision}%</span>
                </div>
                <Progress value={mockMetrics.precision} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Recall</span>
                  <span className="text-sm font-medium text-foreground">{mockMetrics.recall}%</span>
                </div>
                <Progress value={mockMetrics.recall} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">F1 Score</span>
                  <span className="text-sm font-medium text-foreground">{mockMetrics.f1Score}%</span>
                </div>
                <Progress value={mockMetrics.f1Score} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Samples</span>
                  <span className="text-sm font-medium text-foreground">{mockMetrics.totalSamples.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Analysis */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <h3 className="font-medium text-foreground mb-3">Error Analysis</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">False Positives</p>
                <p className="text-lg font-semibold text-warning">{mockMetrics.falsePositives}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">False Negatives</p>
                <p className="text-lg font-semibold text-critical">{mockMetrics.falseNegatives}</p>
              </div>
            </div>
          </div>

          {/* Model Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Model Actions</h3>
            <div className="flex gap-2">
              {model.status === 'active' && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onModelAction(model.id, 'pause')}
                >
                  <Pause className="h-4 w-4 mr-1" />
                  Pause Model
                </Button>
              )}
              {model.status === 'inactive' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onModelAction(model.id, 'activate')}
                >
                  <Play className="h-4 w-4 mr-1" />
                  Activate Model
                </Button>
              )}
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => onModelAction(model.id, 'retrain')}
              >
                <Brain className="h-4 w-4 mr-1" />
                Retrain Model
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onModelAction(model.id, 'configure')}
              >
                <Settings className="h-4 w-4 mr-1" />
                Configure
              </Button>
            </div>
          </div>

          {/* Model Description */}
          <div className="p-4 bg-accent/50 rounded-lg">
            <h3 className="font-medium text-foreground mb-2">Model Description</h3>
            <p className="text-sm text-muted-foreground">
              This {model.type.replace('_', ' ')} model uses advanced machine learning algorithms to 
              analyze security patterns and detect potential threats. It has been trained on a comprehensive 
              dataset and continuously learns from new security events to improve its accuracy over time.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}