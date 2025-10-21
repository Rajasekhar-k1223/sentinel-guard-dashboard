import React, { useState } from 'react';
import { AlertTriangle, Shield, Filter, Search, Eye, CheckCircle, XCircle, Clock, Server, Tag } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface Alert {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  timestamp: string;
  source: string;
  category: string;
  description: string;
}

const mockAlerts: Alert[] = [
  {
    id: 'ALT-001',
    title: 'Suspicious PowerShell Activity',
    severity: 'critical',
    status: 'open',
    timestamp: '2024-01-15 14:32:15',
    source: 'WEB-SERVER-01',
    category: 'Malware',
    description: 'Detected obfuscated PowerShell script execution'
  },
  {
    id: 'ALT-002', 
    title: 'Failed Login Attempts',
    severity: 'high',
    status: 'investigating',
    timestamp: '2024-01-15 14:28:45',
    source: 'DB-SERVER-01',
    category: 'Authentication',
    description: 'Multiple failed SSH login attempts from external IP'
  },
  {
    id: 'ALT-003',
    title: 'Unusual Network Traffic',
    severity: 'medium',
    status: 'open',
    timestamp: '2024-01-15 14:15:22',
    source: 'FIREWALL-01',
    category: 'Network',
    description: 'High volume of outbound traffic to suspicious domain'
  },
  {
    id: 'ALT-004',
    title: 'File Integrity Violation',
    severity: 'high',
    status: 'resolved',
    timestamp: '2024-01-15 13:45:10',
    source: 'APP-SERVER-01',
    category: 'FIM',
    description: 'Critical system file modified unexpectedly'
  }
];

export default function AlertsSIEM() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-critical';
      case 'high': return 'text-warning';
      case 'medium': return 'text-accent';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      critical: 'destructive',
      high: 'secondary',
      medium: 'outline',
      low: 'default'
    };
    return (
      <Badge variant={variants[severity] || 'secondary'}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      open: 'destructive',
      investigating: 'secondary',
      resolved: 'default'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSearch = alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alert.source.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || alert.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || alert.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & SIEM</h1>
          <p className="text-muted-foreground">Security Information and Event Management</p>
        </div>
        <Button className="gap-2" onClick={() => window.location.href = '/alerts/create-rule'}>
          <Shield className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAlerts.filter(a => a.severity === 'critical').length}
                </p>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {mockAlerts.filter(a => a.severity === 'high').length}
                </p>
                <p className="text-sm text-muted-foreground">High Priority</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {mockAlerts.filter(a => a.status === 'resolved').length}
                </p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAlerts.filter(a => a.status === 'investigating').length}
                </p>
                <p className="text-sm text-muted-foreground">Investigating</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="investigating">Investigating</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Alerts List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Security Alerts</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`h-5 w-5 ${getSeverityColor(alert.severity)}`} />
                  <div>
                    <h3 className="font-medium text-foreground">{alert.title}</h3>
                    <p className="text-sm text-muted-foreground">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {alert.source} • {alert.category} • {alert.timestamp}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getSeverityBadge(alert.severity)}
                  {getStatusBadge(alert.status)}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setSelectedAlert(alert)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Alert Details</DialogTitle>
                        <DialogDescription>
                          Complete information about the security alert
                        </DialogDescription>
                      </DialogHeader>
                      {selectedAlert && (
                        <div className="space-y-6 py-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-1">
                              <h3 className="text-xl font-semibold text-foreground">{selectedAlert.title}</h3>
                              <p className="text-sm text-muted-foreground">{selectedAlert.id}</p>
                            </div>
                            <div className="flex gap-2">
                              {getSeverityBadge(selectedAlert.severity)}
                              {getStatusBadge(selectedAlert.status)}
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-muted-foreground flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Timestamp
                                </Label>
                                <p className="font-medium text-foreground mt-1">{selectedAlert.timestamp}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground flex items-center gap-2">
                                  <Server className="h-4 w-4" />
                                  Source
                                </Label>
                                <p className="font-medium text-foreground mt-1">{selectedAlert.source}</p>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <Label className="text-muted-foreground flex items-center gap-2">
                                  <Tag className="h-4 w-4" />
                                  Category
                                </Label>
                                <p className="font-medium text-foreground mt-1">{selectedAlert.category}</p>
                              </div>
                              <div>
                                <Label className="text-muted-foreground flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4" />
                                  Severity Level
                                </Label>
                                <p className="font-medium text-foreground mt-1 capitalize">{selectedAlert.severity}</p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-2">
                            <Label className="text-foreground font-semibold">Description</Label>
                            <p className="text-muted-foreground">{selectedAlert.description}</p>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-foreground font-semibold">Related Events</Label>
                            <div className="space-y-2">
                              {[
                                { time: '14:32:10', event: 'Initial detection triggered' },
                                { time: '14:32:15', event: 'Alert generated and logged' },
                                { time: '14:32:20', event: 'Notification sent to security team' }
                              ].map((event, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-accent/30 rounded-lg">
                                  <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                                  <div>
                                    <p className="text-sm font-medium text-foreground">{event.time}</p>
                                    <p className="text-sm text-muted-foreground">{event.event}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="space-y-3">
                            <Label className="text-foreground font-semibold">Recommended Actions</Label>
                            <div className="space-y-2">
                              <div className="flex items-start gap-3 p-3 bg-critical/10 border border-critical/20 rounded-lg">
                                <Shield className="h-5 w-5 text-critical mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground">Immediate Investigation Required</p>
                                  <p className="text-sm text-muted-foreground">
                                    Review system logs, verify user activity, and check for related indicators of compromise.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 bg-accent/50 border border-border rounded-lg">
                                <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                  <p className="font-medium text-foreground">Document Findings</p>
                                  <p className="text-sm text-muted-foreground">
                                    Record all investigation steps and findings in the incident response system.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button className="flex-1 gap-2">
                              <CheckCircle className="h-4 w-4" />
                              Mark as Resolved
                            </Button>
                            <Button variant="outline" className="flex-1 gap-2">
                              <Eye className="h-4 w-4" />
                              Start Investigation
                            </Button>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="h-4 w-4" />
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