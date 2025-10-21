import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Monitor, Plus, MoreHorizontal, CheckCircle, AlertCircle, XCircle, Eye } from 'lucide-react';
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

export default function AgentManagement() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://localhost:8000/api/agents/list';

  // Fetch agents from API
  const fetchAgents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_URL);
      
      if (!Array.isArray(response.data)) {
        throw new Error('Unexpected response format (not an array)');
      }

      const mappedAgents: Agent[] = response.data.map((a: any) => ({
        id: a.id,
        hostname: a.hostname,
        os: a.os,
        version: a.os_version,
        status: a.status === 'online' ? 'online' : 'offline', // can add warning logic later
        lastSeen: new Date(a.last_seen).toLocaleString(),
        ip: a.ip_address,
        events: 0, // default since API doesn't provide
      }));

      setAgents(mappedAgents);
    } catch (err: any) {
      console.error('Error fetching agents:', err);
      setError('Failed to fetch agents. Make sure your ngrok URL is active.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 30s
  useEffect(() => {
    fetchAgents();
    const interval = setInterval(fetchAgents, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'offline': return <XCircle className="h-4 w-4 text-critical" />;
      default: return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      online: 'default',
      warning: 'secondary',
      offline: 'destructive'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status.toUpperCase()}</Badge>;
  };

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          agent.ip.includes(searchTerm);
    const matchesStatus = selectedStatus === 'all' || agent.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Management</h1>
          <p className="text-muted-foreground">Monitor and manage endpoint agents</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/add-agent')}>
          <Plus className="h-4 w-4" /> Deploy Agent
        </Button>
      </div>

      {/* Loading / Error */}
      {loading && <p>Loading agents...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{agents.filter(a => a.status === 'online').length}</p>
              <p className="text-sm text-muted-foreground">Online Agents</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{agents.filter(a => a.status === 'warning').length}</p>
              <p className="text-sm text-muted-foreground">Warning</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
              <XCircle className="h-6 w-6 text-critical" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{agents.filter(a => a.status === 'offline').length}</p>
              <p className="text-sm text-muted-foreground">Offline</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Monitor className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{agents.length}</p>
              <p className="text-sm text-muted-foreground">Total Agents</p>
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
            {filteredAgents.map(agent => (
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
                  
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(`/agent/${agent.id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  
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
