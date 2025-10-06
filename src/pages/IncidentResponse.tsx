import React, { useState } from 'react';
import { AlertCircle, Clock, CheckCircle, User, FileText, Play } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignee: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  affectedAssets: string[];
}

const mockIncidents: Incident[] = [
  {
    id: 'INC-001',
    title: 'Malware Outbreak on Production Servers',
    description: 'Multiple production servers detected with malware. Immediate containment required.',
    severity: 'critical',
    status: 'in_progress',
    assignee: 'analyst@sentinel.ai',
    createdAt: '2024-01-15 14:00:00',
    updatedAt: '2024-01-15 14:30:00',
    category: 'Malware',
    affectedAssets: ['WEB-SERVER-01', 'WEB-SERVER-02', 'DB-SERVER-01']
  },
  {
    id: 'INC-002',
    title: 'Suspected Data Exfiltration',
    description: 'Unusual outbound traffic pattern detected from internal database server.',
    severity: 'high',
    status: 'open',
    assignee: 'admin@sentinel.ai',
    createdAt: '2024-01-15 13:45:00',
    updatedAt: '2024-01-15 13:45:00',
    category: 'Data Breach',
    affectedAssets: ['DB-SERVER-02']
  },
  {
    id: 'INC-003',
    title: 'Brute Force Attack on SSH',
    description: 'Multiple failed SSH login attempts from external IP addresses.',
    severity: 'medium',
    status: 'resolved',
    assignee: 'analyst@sentinel.ai',
    createdAt: '2024-01-14 10:20:00',
    updatedAt: '2024-01-14 15:30:00',
    category: 'Brute Force',
    affectedAssets: ['SSH-SERVER-01']
  }
];

export default function IncidentResponse() {
  const { toast } = useToast();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      critical: 'destructive',
      high: 'secondary',
      medium: 'outline',
      low: 'default'
    };
    return (
      <Badge variant={variants[severity] || 'outline'}>
        {severity.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      open: 'destructive',
      in_progress: 'secondary',
      resolved: 'default',
      closed: 'outline'
    };
    const labels: { [key: string]: string } = {
      open: 'OPEN',
      in_progress: 'IN PROGRESS',
      resolved: 'RESOLVED',
      closed: 'CLOSED'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status.toUpperCase()}
      </Badge>
    );
  };

  const filteredIncidents = mockIncidents.filter(incident => {
    const matchesStatus = selectedStatus === 'all' || incident.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || incident.severity === selectedSeverity;
    return matchesStatus && matchesSeverity;
  });

  const stats = {
    total: mockIncidents.length,
    open: mockIncidents.filter(i => i.status === 'open').length,
    inProgress: mockIncidents.filter(i => i.status === 'in_progress').length,
    critical: mockIncidents.filter(i => i.severity === 'critical').length,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Response</h1>
          <p className="text-muted-foreground">Manage and track security incidents</p>
        </div>
        <Button className="gap-2">
          <AlertCircle className="h-4 w-4" />
          Create Incident
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Incidents</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.open}</p>
                <p className="text-sm text-muted-foreground">Open</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
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
      </div>

      {/* Incidents List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Active Incidents ({filteredIncidents.length})</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{incident.title}</h3>
                      <Badge variant="outline" className="text-xs">{incident.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{incident.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {incident.assignee}
                      </span>
                      <span>Category: {incident.category}</span>
                      <span>Created: {incident.createdAt}</span>
                      <span>Assets: {incident.affectedAssets.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(incident.severity)}
                    {getStatusBadge(incident.status)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Play className="h-3 w-3" />
                    Run Playbook
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <FileText className="h-3 w-3" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Update Status
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
