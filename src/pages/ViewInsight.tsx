import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Brain, AlertTriangle, TrendingUp, Shield, Clock, Target } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

// Mock insight data (in real app, this would come from API)
const mockInsight = {
  id: 'AI-001',
  type: 'anomaly',
  title: 'Unusual Network Traffic Pattern Detected',
  description: 'AI detected 347% increase in outbound traffic from DB-SERVER-01 during off-hours',
  detailedAnalysis: 'The anomaly detection model identified a significant spike in network traffic originating from DB-SERVER-01 between 2:00 AM and 4:00 AM. The traffic pattern shows characteristics consistent with data exfiltration attempts, including sustained high-volume transfers to external IP addresses not typically accessed during business hours.',
  confidence: 94,
  severity: 'high',
  timestamp: '2024-01-15 14:35:22',
  affectedAssets: ['DB-SERVER-01', 'NETWORK-SWITCH-03'],
  status: 'new',
  mlModel: 'Network Anomaly Detector v2.1',
  features: [
    { name: 'Traffic Volume', value: '2.4 GB/hour', normal: '0.7 GB/hour', variance: 347 },
    { name: 'Connection Count', value: '1,247', normal: '89', variance: 1301 },
    { name: 'Unique Destinations', value: '23', normal: '5', variance: 360 },
    { name: 'Protocol Distribution', value: 'TCP: 94%', normal: 'TCP: 67%', variance: 40 }
  ],
  timeline: [
    { time: '02:15', event: 'Initial anomaly detected', confidence: 67 },
    { time: '02:32', event: 'Traffic volume threshold exceeded', confidence: 78 },
    { time: '02:45', event: 'Suspicious destination pattern identified', confidence: 84 },
    { time: '03:12', event: 'Final confidence score calculated', confidence: 94 }
  ],
  recommendations: [
    'Isolate DB-SERVER-01 from network immediately',
    'Investigate user activity logs for the affected timeframe',
    'Review firewall logs for external connection attempts',
    'Perform forensic analysis of the database server'
  ]
};

export default function ViewInsight() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">AI Insight Details</h1>
            <p className="text-muted-foreground">Detailed analysis of AI-generated security insight</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Mark as Reviewed</Button>
          <Button>Take Action</Button>
        </div>
      </div>

      {/* Insight Overview */}
      <SecurityCard>
        <SecurityCardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Brain className={`h-6 w-6 ${getTypeColor(mockInsight.type)}`} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">{mockInsight.title}</h2>
                <p className="text-muted-foreground">ID: {mockInsight.id} • {mockInsight.timestamp}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {getTypeBadge(mockInsight.type)}
              {getSeverityBadge(mockInsight.severity)}
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Confidence</p>
                <p className="text-lg font-semibold text-foreground">{mockInsight.confidence}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">ML Model</p>
                <p className="text-lg font-semibold text-foreground">{mockInsight.mlModel}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Affected Assets</p>
                <p className="text-lg font-semibold text-foreground">{mockInsight.affectedAssets.length}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground">{mockInsight.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Detailed Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">{mockInsight.detailedAnalysis}</p>
            </div>
          </div>
        </SecurityCardContent>
      </SecurityCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Key Features */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Key Features Analyzed</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              {mockInsight.features.map((feature, index) => (
                <div key={index} className="p-4 border border-border/50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-foreground">{feature.name}</h4>
                    <Badge variant="outline">+{feature.variance}%</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-semibold text-foreground">{feature.value}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Normal</p>
                      <p className="font-semibold text-foreground">{feature.normal}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Detection Timeline */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Detection Timeline
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              {mockInsight.timeline.map((event, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-foreground font-mono">
                    {event.time}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{event.event}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={event.confidence} className="h-2 flex-1" />
                      <span className="text-xs text-muted-foreground">{event.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Affected Assets */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Affected Assets</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {mockInsight.affectedAssets.map((asset, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{asset}</p>
                  <p className="text-sm text-muted-foreground">Database Server</p>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Recommendations */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Recommended Actions
          </SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {mockInsight.recommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-3 border border-border/50 rounded-lg">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{index + 1}</span>
                </div>
                <p className="text-foreground">{recommendation}</p>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}