import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Monitor, Activity, AlertTriangle, CheckCircle, XCircle, Download, Trash2 } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const agent = {
    id: id || 'agent-001',
    hostname: 'WEB-SERVER-01',
    os: 'Windows Server 2019',
    version: '2.1.3',
    status: 'online',
    lastSeen: '2 minutes ago',
    ip: '192.168.1.10',
    events: 1247,
    uptime: '45 days 3 hours',
    cpu: '24%',
    memory: '67%',
    disk: '45%',
    installedDate: '2023-11-15',
    groups: ['Production', 'Web Servers'],
    policies: ['Security Baseline', 'Windows Hardening'],
  };

  const recentEvents = [
    { id: 1, time: '2 minutes ago', type: 'Info', message: 'Heartbeat received', severity: 'low' },
    { id: 2, time: '15 minutes ago', type: 'Warning', message: 'High CPU usage detected', severity: 'medium' },
    { id: 3, time: '1 hour ago', type: 'Info', message: 'Security scan completed', severity: 'low' },
    { id: 4, time: '2 hours ago', type: 'Critical', message: 'Suspicious process detected', severity: 'high' },
  ];

  const getStatusBadge = () => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" } = {
      online: 'default',
      warning: 'secondary',
      offline: 'destructive'
    };
    return (
      <Badge variant={variants[agent.status] || 'secondary'}>
        {agent.status.toUpperCase()}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" } = {
      high: 'destructive',
      medium: 'secondary',
      low: 'default'
    };
    return (
      <Badge variant={variants[severity] || 'default'}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/agents')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{agent.hostname}</h1>
            <p className="text-muted-foreground">{agent.os} • {agent.ip}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Agent
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{agent.events}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{agent.uptime}</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{agent.cpu}</p>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{agent.memory}</p>
                <p className="text-sm text-muted-foreground">Memory Usage</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Agent Information */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Agent Information</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Agent ID:</span>
                <span className="font-medium text-foreground">{agent.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium text-foreground">v{agent.version}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Last Seen:</span>
                <span className="font-medium text-foreground">{agent.lastSeen}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Disk Usage:</span>
                <span className="font-medium text-foreground">{agent.disk}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Installed:</span>
                <span className="font-medium text-foreground">{agent.installedDate}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Groups:</span>
                <div className="flex gap-2">
                  {agent.groups.map((group) => (
                    <Badge key={group} variant="outline">{group}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Policies */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Applied Policies</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-3">
              {agent.policies.map((policy, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium text-foreground">{policy}</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Recent Events */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Events</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {event.severity === 'high' && <XCircle className="h-5 w-5 text-critical" />}
                  {event.severity === 'medium' && <AlertTriangle className="h-5 w-5 text-warning" />}
                  {event.severity === 'low' && <CheckCircle className="h-5 w-5 text-success" />}
                  <div>
                    <p className="font-medium text-foreground">{event.message}</p>
                    <p className="text-sm text-muted-foreground">{event.time} • {event.type}</p>
                  </div>
                </div>
                {getSeverityBadge(event.severity)}
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}
