import React from 'react';
import { AlertTriangle, Shield, Clock, User } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Badge } from '@/components/ui/badge';

interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  timestamp: string;
  source: string;
  description: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'Suspicious Process Execution',
    severity: 'critical',
    timestamp: '2 minutes ago',
    source: 'Endpoint-WKS-001',
    description: 'Unauthorized PowerShell execution detected'
  },
  {
    id: '2',
    title: 'Failed Login Attempts',
    severity: 'high',
    timestamp: '5 minutes ago',
    source: 'Domain Controller',
    description: 'Multiple failed authentication attempts from external IP'
  },
  {
    id: '3',
    title: 'Network Anomaly',
    severity: 'medium',
    timestamp: '12 minutes ago',
    source: 'Firewall-FW-02',
    description: 'Unusual outbound traffic pattern detected'
  },
  {
    id: '4',
    title: 'File Integrity Change',
    severity: 'medium',
    timestamp: '18 minutes ago',
    source: 'Server-SRV-003',
    description: 'Critical system file modification detected'
  }
];

export function AlertsPanel() {
  const getSeverityBadge = (severity: string) => {
    const variants = {
      critical: 'bg-critical/20 text-critical border-critical/50',
      high: 'bg-warning/20 text-warning border-warning/50',
      medium: 'bg-primary/20 text-primary border-primary/50',
      low: 'bg-muted/20 text-muted-foreground border-muted/50'
    };
    
    return variants[severity as keyof typeof variants] || variants.low;
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3" />;
      case 'high':
        return <AlertTriangle className="h-3 w-3" />;
      default:
        return <Shield className="h-3 w-3" />;
    }
  };

  return (
    <SecurityCard className="col-span-2">
      <SecurityCardHeader>
        <SecurityCardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-critical" />
          Recent Security Alerts
        </SecurityCardTitle>
      </SecurityCardHeader>
      <SecurityCardContent>
        <div className="space-y-4">
          {mockAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start justify-between p-4 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityBadge(alert.severity)}>
                    {getSeverityIcon(alert.severity)}
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <h4 className="font-medium text-foreground">{alert.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {alert.timestamp}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {alert.source}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-border/50">
          <button className="text-sm text-primary hover:text-primary-glow transition-colors">
            View all alerts →
          </button>
        </div>
      </SecurityCardContent>
    </SecurityCard>
  );
}