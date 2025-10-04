import React, { useState } from 'react';
import { Network, Activity, Shield, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface NetworkEvent {
  id: string;
  timestamp: string;
  sourceIP: string;
  destIP: string;
  port: number;
  protocol: string;
  action: 'allow' | 'block' | 'alert';
  severity: 'high' | 'medium' | 'low';
  rule: string;
  bytes: number;
}

const mockNetworkEvents: NetworkEvent[] = [
  {
    id: 'NET-001',
    timestamp: '2024-01-15 14:35:22',
    sourceIP: '192.168.1.100',
    destIP: '185.220.101.45',
    port: 443,
    protocol: 'HTTPS',
    action: 'block',
    severity: 'high',
    rule: 'TOR Exit Node',
    bytes: 1420
  },
  {
    id: 'NET-002',
    timestamp: '2024-01-15 14:33:15',
    sourceIP: '10.0.0.50',
    destIP: '8.8.8.8',
    port: 53,
    protocol: 'DNS',
    action: 'allow',
    severity: 'low',
    rule: 'DNS Query',
    bytes: 512
  },
  {
    id: 'NET-003',
    timestamp: '2024-01-15 14:32:08',
    sourceIP: '192.168.1.25',
    destIP: '203.0.113.15',
    port: 22,
    protocol: 'SSH',
    action: 'alert',
    severity: 'medium',
    rule: 'Suspicious SSH',
    bytes: 2048
  }
];

interface NetworkStats {
  totalTraffic: string;
  blockedConnections: number;
  allowedConnections: number;
  alerts: number;
  bandwidth: number;
}

const networkStats: NetworkStats = {
  totalTraffic: '2.4 TB',
  blockedConnections: 1247,
  allowedConnections: 58392,
  alerts: 23,
  bandwidth: 85
};

export default function NetworkSecurity() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedAction, setSelectedAction] = useState('all');

  const getActionColor = (action: string) => {
    switch (action) {
      case 'block': return 'text-critical';
      case 'alert': return 'text-warning';
      case 'allow': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getActionBadge = (action: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      block: 'destructive',
      alert: 'secondary',
      allow: 'default'
    };
    return (
      <Badge variant={variants[action] || 'outline'}>
        {action.toUpperCase()}
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
      <Badge variant={variants[severity] || 'outline'} className="ml-2">
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const filteredEvents = mockNetworkEvents.filter(event => {
    const matchesAction = selectedAction === 'all' || event.action === selectedAction;
    return matchesAction;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Network Security</h1>
          <p className="text-muted-foreground">Network traffic monitoring and intrusion detection</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = '/network-scanning'}>
            <Network className="h-4 w-4" />
            Network Scanning
          </Button>
          <Button className="gap-2" onClick={() => window.location.href = '/network-security/create-rule'}>
            <Shield className="h-4 w-4" />
            Create Firewall Rule
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{networkStats.totalTraffic}</p>
                <p className="text-sm text-muted-foreground">Total Traffic</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {networkStats.blockedConnections.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Network className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {networkStats.allowedConnections.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Allowed</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{networkStats.alerts}</p>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Bandwidth Usage */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Network Bandwidth Usage</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Bandwidth Utilization</span>
              <span className="text-sm text-muted-foreground">{networkStats.bandwidth}%</span>
            </div>
            <Progress value={networkStats.bandwidth} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0 Mbps</span>
              <span>1 Gbps</span>
            </div>
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedAction} onValueChange={setSelectedAction}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="allow">Allow</SelectItem>
            <SelectItem value="block">Block</SelectItem>
            <SelectItem value="alert">Alert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Network Events */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Network Events</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Network className={`h-5 w-5 ${getActionColor(event.action)}`} />
                  <div>
                    <h3 className="font-medium text-foreground">
                      {event.sourceIP} → {event.destIP}:{event.port}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {event.protocol} • {event.rule} • {event.bytes} bytes
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{event.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getActionBadge(event.action)}
                  {getSeverityBadge(event.severity)}
                  <Button variant="ghost" size="sm">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}