import React, { useState } from 'react';
import { Monitor, Plus, MoreHorizontal, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

interface Agent {
  id: string;
  hostname: string;
  os: string;
  version: string;
  status: 'online' | 'offline' | 'warning';
  lastSeen: string;
  ip: string;
  events: number;
}

const mockAgents: Agent[] = [
  {
    id: 'agent-001',
    hostname: 'WEB-SERVER-01',
    os: 'Windows Server 2019',
    version: '2.1.3',
    status: 'online',
    lastSeen: '2 minutes ago',
    ip: '192.168.1.10',
    events: 1247
  },
  {
    id: 'agent-002',
    hostname: 'DB-SERVER-01',
    os: 'Ubuntu 20.04',
    version: '2.1.3',
    status: 'online',
    lastSeen: '1 minute ago',
    ip: '192.168.1.20',
    events: 892
  },
  {
    id: 'agent-003',
    hostname: 'APP-SERVER-01',
    os: 'CentOS 8',
    version: '2.1.2',
    status: 'warning',
    lastSeen: '15 minutes ago',
    ip: '192.168.1.30',
    events: 456
  },
  {
    id: 'agent-004',
    hostname: 'DEV-WORKSTATION',
    os: 'Windows 11',
    version: '2.1.3',
    status: 'offline',
    lastSeen: '2 hours ago',
    ip: '192.168.1.100',
    events: 23
  }
];

export default function AgentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'offline':
        return <XCircle className="h-4 w-4 text-critical" />;
      default:
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      online: 'default',
      warning: 'secondary',
      offline: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.ip.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Management</h1>
          <p className="text-muted-foreground">Monitor and manage endpoint agents</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Deploy Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAgents.filter(a => a.status === 'online').length}
                </p>
                <p className="text-sm text-muted-foreground">Online Agents</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAgents.filter(a => a.status === 'warning').length}
                </p>
                <p className="text-sm text-muted-foreground">Warning</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAgents.filter(a => a.status === 'offline').length}
                </p>
                <p className="text-sm text-muted-foreground">Offline</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockAgents.length}</p>
                <p className="text-sm text-muted-foreground">Total Agents</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input
          placeholder="Search by hostname or IP..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md text-sm"
        >
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="warning">Warning</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Agents Table */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Registered Agents</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(agent.status)}
                  <div>
                    <h3 className="font-medium text-foreground">{agent.hostname}</h3>
                    <p className="text-sm text-muted-foreground">{agent.os} • {agent.ip}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{agent.events.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Events</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">v{agent.version}</p>
                    <p className="text-xs text-muted-foreground">Version</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{agent.lastSeen}</p>
                    <p className="text-xs text-muted-foreground">Last Seen</p>
                  </div>
                  
                  {getStatusBadge(agent.status)}
                  
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
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