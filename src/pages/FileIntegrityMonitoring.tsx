import React, { useState } from 'react';
import { FileCheck, AlertTriangle, TrendingUp, Eye, Search, Settings, Shield, Clock, AlertCircle } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

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
  const [selectedEvent, setSelectedEvent] = useState<FIMEvent | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

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
        <div className="flex gap-2">
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>FIM Configuration</DialogTitle>
                <DialogDescription>
                  Configure file integrity monitoring rules and monitored paths
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Monitored Directories</h3>
                  <div className="space-y-3">
                    {[
                      { path: '/etc/', description: 'System configuration files' },
                      { path: '/var/log/', description: 'System logs' },
                      { path: 'C:\\Windows\\System32\\', description: 'Windows system files' },
                      { path: '/usr/bin/', description: 'User binaries' }
                    ].map((dir, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <Checkbox defaultChecked id={`dir-${idx}`} />
                        <div className="flex-1">
                          <Label htmlFor={`dir-${idx}`} className="font-medium cursor-pointer">
                            {dir.path}
                          </Label>
                          <p className="text-sm text-muted-foreground">{dir.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Monitoring Options</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Real-time monitoring', desc: 'Monitor file changes in real-time' },
                      { name: 'Hash verification', desc: 'Verify file integrity using SHA-256 hashes' },
                      { name: 'Alert on modifications', desc: 'Send alerts when files are modified' },
                      { name: 'Track file permissions', desc: 'Monitor changes to file permissions' }
                    ].map((option, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <Checkbox defaultChecked id={`opt-${idx}`} />
                        <div className="flex-1">
                          <Label htmlFor={`opt-${idx}`} className="font-medium cursor-pointer">
                            {option.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gap-2" onClick={() => window.location.href = '/file-integrity/create-baseline'}>
            <Search className="h-4 w-4" />
            Create Baseline
          </Button>
        </div>
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
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="whitespace-nowrap"
                        onClick={() => setSelectedEvent(event)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl">
                      <DialogHeader>
                        <DialogTitle>File Integrity Event Details</DialogTitle>
                        <DialogDescription>
                          Detailed information about the file change event
                        </DialogDescription>
                      </DialogHeader>
                      {selectedEvent && (
                        <div className="space-y-6 py-4">
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-muted-foreground">Event ID</Label>
                                <p className="font-mono text-foreground">{selectedEvent.id}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">File Path</Label>
                                <p className="font-medium text-foreground break-all">{selectedEvent.file}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Agent</Label>
                                <p className="font-medium text-foreground">{selectedEvent.agent}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Timestamp</Label>
                                <p className="flex items-center gap-2 text-foreground">
                                  <Clock className="h-4 w-4" />
                                  {selectedEvent.timestamp}
                                </p>
                              </div>
                            </div>
                            
                            <div className="space-y-4">
                              <div>
                                <Label className="text-muted-foreground">Action</Label>
                                <p className="font-medium text-foreground capitalize flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  {selectedEvent.action}
                                </p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground">Severity</Label>
                                <div className="mt-1">
                                  {getSeverityBadge(selectedEvent.severity)}
                                </div>
                              </div>
                              {selectedEvent.oldHash && (
                                <div>
                                  <Label className="text-muted-foreground">Old Hash</Label>
                                  <p className="font-mono text-sm text-foreground break-all">{selectedEvent.oldHash}</p>
                                </div>
                              )}
                              {selectedEvent.newHash && (
                                <div>
                                  <Label className="text-muted-foreground">New Hash</Label>
                                  <p className="font-mono text-sm text-foreground break-all">{selectedEvent.newHash}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="border-t border-border pt-4">
                            <Label className="text-muted-foreground mb-2 block">Recommended Actions</Label>
                            <div className="space-y-2">
                              {selectedEvent.severity === 'critical' && (
                                <div className="flex items-start gap-2 p-3 bg-critical/10 border border-critical/20 rounded-lg">
                                  <Shield className="h-5 w-5 text-critical mt-0.5" />
                                  <div>
                                    <p className="font-medium text-foreground">Critical Alert</p>
                                    <p className="text-sm text-muted-foreground">
                                      Investigate immediately. Review system logs and verify authorized change.
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-start gap-2 p-3 bg-accent/50 border border-border rounded-lg">
                                <FileCheck className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground">Verify Change</p>
                                  <p className="text-sm text-muted-foreground">
                                    Confirm if this change was authorized and expected.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}