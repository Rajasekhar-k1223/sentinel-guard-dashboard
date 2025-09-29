import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, CheckCircle, X } from 'lucide-react';

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

interface ViewInsightDialogProps {
  insight: AIInsight | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: string) => void;
}

export default function ViewInsightDialog({ insight, open, onOpenChange, onStatusChange }: ViewInsightDialogProps) {
  if (!insight) return null;

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
        {type.replace('_', ' ').toUpperCase()}
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Brain className={`h-6 w-6 ${getTypeColor(insight.type)}`} />
            AI Insight Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Header Info */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">{insight.title}</h2>
            <div className="flex items-center gap-2">
              {getTypeBadge(insight.type)}
              {getSeverityBadge(insight.severity)}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Description</h3>
            <p className="text-muted-foreground">{insight.description}</p>
          </div>

          {/* Confidence */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Confidence Level</h3>
            <div className="space-y-2">
              <Progress value={insight.confidence} className="h-3" />
              <p className="text-sm text-muted-foreground">{insight.confidence}% confidence</p>
            </div>
          </div>

          {/* Affected Assets */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Affected Assets</h3>
            <div className="flex flex-wrap gap-2">
              {insight.affectedAssets.map((asset) => (
                <Badge key={asset} variant="outline">
                  {asset}
                </Badge>
              ))}
            </div>
          </div>

          {/* Timestamp */}
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">Detection Time</h3>
            <p className="text-sm text-muted-foreground">{insight.timestamp}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="font-medium text-foreground">Actions</h3>
            <div className="flex gap-2">
              {insight.status === 'new' && (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => onStatusChange(insight.id, 'reviewed')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark as Reviewed
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onStatusChange(insight.id, 'dismissed')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </>
              )}
              {insight.status === 'reviewed' && (
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onStatusChange(insight.id, 'actioned')}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Mark as Actioned
                </Button>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {insight.type === 'recommendation' && (
            <div className="p-4 bg-accent/50 rounded-lg">
              <h3 className="font-medium text-foreground mb-2">Recommended Actions</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Review security policies for affected assets</li>
                <li>• Implement suggested security controls</li>
                <li>• Monitor for similar patterns in the future</li>
                <li>• Schedule regular security assessments</li>
              </ul>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}