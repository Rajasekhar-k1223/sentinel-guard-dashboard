import React, { useState } from 'react';
import { FileCheck, AlertTriangle, TrendingUp, Eye, Search } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface FIMEvent {
  id: string;
  timestamp: string;
  file: string;
  action: 'created' | 'modified' | 'deleted' | 'moved';
  agent: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  oldHash?: string;
  newHash?: string;
}

const mockFIMEvents: FIMEvent[] = [
  {
    id: 'fim-001',
    timestamp: '2024-01-15 14:30:22',
    file: '/etc/passwd',
    action: 'modified',
    agent: 'WEB-SERVER-01',
    severity: 'critical',
    oldHash: 'sha256:abc123...',
    newHash: 'sha256:def456...'
  },
  {
    id: 'fim-002',
    timestamp: '2024-01-15 14:25:15',
    file: 'C:\\Windows\\System32\\drivers\\etc\\hosts',
    action: 'modified',
    agent: 'DB-SERVER-01',
    severity: 'high',
    oldHash: 'sha256:ghi789...',
    newHash: 'sha256:jkl012...'
  },
  {
    id: 'fim-003',
    timestamp: '2024-01-15 14:20:08',
    file: '/var/log/auth.log',
    action: 'created',
    agent: 'APP-SERVER-01',
    severity: 'medium'
  },
  {
    id: 'fim-004',
    timestamp: '2024-01-15 14:15:33',
    file: '/tmp/suspicious_script.sh',
    action: 'deleted',
    agent: 'WEB-SERVER-01',
    severity: 'high'
  }
];

export default function FileIntegrityMonitoring() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-critical';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      critical: 'destructive',
      high: 'default',
      medium: 'default',
      low: 'secondary'
    };
    return (
      <Badge variant={variants[severity] || 'secondary'}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getActionIcon = (action: string) => {
    const colors = {
      created: 'text-success',
      modified: 'text-warning',
      deleted: 'text-critical',
      moved: 'text-primary'
    };
    return <div className={`w-2 h-2 rounded-full ${colors[action as keyof typeof colors] || 'bg-muted-foreground'}`} />;
  };

  const filteredEvents = mockFIMEvents.filter(event => {
    const matchesSearch = event.file.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.agent.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || event.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="flex-1 space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">File Integrity Monitoring</h1>
          <p className="text-muted-foreground">Monitor and detect file system changes</p>
        </div>
        <Button className="gap-2" onClick={() => window.location.href = '/file-integrity/create-baseline'}>
          <Search className="h-4 w-4" />
          Create Baseline
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard variant="critical">
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockFIMEvents.filter(e => e.severity === 'critical').length}
                </p>
                <p className="text-sm text-muted-foreground">Critical Changes</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockFIMEvents.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <p className="text-sm text-muted-foreground">Monitored Files</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-sm text-muted-foreground">Active Monitors</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Input
          placeholder="Search by file path or agent..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 sm:max-w-sm"
        />
        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Severities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* FIM Events */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent File Changes</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex flex-col gap-4 p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors md:flex-row md:items-center md:justify-between"
              >
                <div className="flex items-center gap-4">
                  {getActionIcon(event.action)}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground break-all">{event.file}</h3>
                    <p className="text-sm text-muted-foreground">
                      {event.action.toUpperCase()} on {event.agent} • {event.timestamp}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground capitalize">{event.action}</p>
                    <p className="text-xs text-muted-foreground">Action</p>
                  </div>
                  
                  {event.oldHash && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{event.oldHash.slice(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground">Old Hash</p>
                    </div>
                  )}
                  
                  {event.newHash && (
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{event.newHash.slice(0, 12)}...</p>
                      <p className="text-xs text-muted-foreground">New Hash</p>
                    </div>
                  )}
                  
                  {getSeverityBadge(event.severity)}
                  
                  <Button variant="ghost" size="sm" className="whitespace-nowrap">
                    View Details
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