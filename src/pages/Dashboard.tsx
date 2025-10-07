import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Activity, AlertTriangle, Target, Server, Users, Eye, Zap, Brain, MessageCircle, FileWarning, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react';
import { SecurityMetricsCard } from '@/components/dashboard/SecurityMetricsCard';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { SystemStatusPanel } from '@/components/dashboard/SystemStatusPanel';
import { ThreatMapPanel } from '@/components/dashboard/ThreatMapPanel';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const navigate = useNavigate();

  const recentIncidents = [
    { id: 'INC-001', title: 'Suspicious Login Attempt', severity: 'high', time: '5 min ago', status: 'investigating' },
    { id: 'INC-002', title: 'Malware Detected on File Server', severity: 'critical', time: '12 min ago', status: 'contained' },
    { id: 'INC-003', title: 'Unusual Network Traffic', severity: 'medium', time: '23 min ago', status: 'monitoring' }
  ];

  const aiInsights = [
    { id: '1', title: 'Anomaly in Database Access Pattern', confidence: 94, type: 'threat' },
    { id: '2', title: 'Potential Insider Threat Detected', confidence: 87, type: 'warning' },
    { id: '3', title: 'Recommend MFA Enhancement', confidence: 91, type: 'recommendation' }
  ];

  const agentStatus = {
    online: 12,
    offline: 2,
    warning: 3,
    total: 17
  };

  const recentActivity = [
    { id: '1', action: 'New agent registered', time: '2 min ago', icon: CheckCircle, color: 'text-success' },
    { id: '2', action: 'YARA scan completed', time: '8 min ago', icon: CheckCircle, color: 'text-success' },
    { id: '3', action: 'Failed authentication attempt', time: '15 min ago', icon: XCircle, color: 'text-critical' },
    { id: '4', action: 'System backup completed', time: '1 hour ago', icon: CheckCircle, color: 'text-success' }
  ];

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and threat detection</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            All systems operational
          </div>
          <Button onClick={() => navigate('/agent-communication')} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Agent Communication
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SecurityMetricsCard
          title="Active Threats"
          value="3"
          change="+2 from last hour"
          changeType="negative"
          icon={AlertTriangle}
          variant="critical"
        />
        <SecurityMetricsCard
          title="Protected Endpoints"
          value="1,247"
          change="+5 today"
          changeType="positive"
          icon={Shield}
          variant="success"
        />
        <SecurityMetricsCard
          title="System Uptime"
          value="99.9%"
          change="Last 30 days"
          changeType="positive"
          icon={Activity}
          variant="primary"
        />
        <SecurityMetricsCard
          title="Events/Hour"
          value="15,429"
          change="+12% from avg"
          changeType="neutral"
          icon={Zap}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SecurityMetricsCard
          title="Failed Logins"
          value="127"
          change="+45% increase"
          changeType="negative"
          icon={Users}
          variant="warning"
        />
        <SecurityMetricsCard
          title="Network Flows"
          value="2.3M"
          change="Last 24h"
          changeType="neutral"
          icon={Server}
        />
        <SecurityMetricsCard
          title="Active Sessions"
          value="892"
          change="Currently online"
          changeType="neutral"
          icon={Eye}
        />
        <SecurityMetricsCard
          title="Threat Score"
          value="Medium"
          description="Based on 24h activity"
          changeType="neutral"
          icon={Target}
          variant="warning"
        />
      </div>

      {/* Quick Actions & Agent Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Quick Actions</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/incidents')}>
                <FileWarning className="h-4 w-4" />
                View Incidents
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/ai')}>
                <Brain className="h-4 w-4" />
                AI Analysis
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/agents')}>
                <Shield className="h-4 w-4" />
                Agent Management
              </Button>
              <Button variant="outline" className="justify-start gap-2" onClick={() => navigate('/threat-intelligence')}>
                <Target className="h-4 w-4" />
                Threat Intel
              </Button>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center justify-between">
              <span>Agent Status Overview</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/agents')}>
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-2xl font-bold text-foreground">{agentStatus.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/10 border border-success/20">
                <p className="text-2xl font-bold text-success">{agentStatus.online}</p>
                <p className="text-xs text-muted-foreground">Online</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-2xl font-bold text-warning">{agentStatus.warning}</p>
                <p className="text-xs text-muted-foreground">Warning</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-muted">
                <p className="text-2xl font-bold text-muted-foreground">{agentStatus.offline}</p>
                <p className="text-xs text-muted-foreground">Offline</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <AlertsPanel />
        <div className="space-y-6">
          <SystemStatusPanel />
          <ThreatMapPanel />
        </div>
      </div>

      {/* Recent Incidents & AI Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center justify-between">
              <span>Recent Incidents</span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/incidents')}>
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-3">
              {recentIncidents.map(incident => (
                <div key={incident.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-foreground">{incident.title}</h4>
                      <Badge variant={incident.severity === 'critical' ? 'destructive' : incident.severity === 'high' ? 'secondary' : 'outline'} className="text-xs">
                        {incident.severity.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {incident.time}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{incident.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                AI Security Insights
              </span>
              <Button variant="ghost" size="sm" onClick={() => navigate('/ai')}>
                View All <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-3">
              {aiInsights.map(insight => (
                <div key={insight.id} className="p-3 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground">{insight.title}</h4>
                    <Badge variant={insight.type === 'threat' ? 'destructive' : insight.type === 'warning' ? 'secondary' : 'default'} className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${insight.confidence}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Activity Timeline */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Activity</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors">
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
                <span className="text-sm text-foreground flex-1">{activity.action}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}