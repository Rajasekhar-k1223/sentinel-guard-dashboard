import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wifi, Server, Plus, Settings, CheckCircle, AlertTriangle, XCircle, Key, Eye } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AgentlessTarget {
  id: string;
  hostname: string;
  ipAddress: string;
  os: 'windows' | 'linux' | 'macos' | 'cloud';
  platform: string;
  connectionType: 'ssh' | 'winrm' | 'api' | 'cloud_api';
  status: 'connected' | 'disconnected' | 'error' | 'scanning';
  lastScan: string;
  lastConnection: string;
  vulnerabilities: number;
  compliance: number;
  region?: string;
  credentials: string;
}

const mockAgentlessTargets: AgentlessTarget[] = [
  {
    id: 'AL-001',
    hostname: 'prod-web-server',
    ipAddress: '10.0.1.50',
    os: 'linux',
    platform: 'Ubuntu 22.04',
    connectionType: 'ssh',
    status: 'connected',
    lastScan: '2024-01-15 14:30:00',
    lastConnection: '2024-01-15 14:35:00',
    vulnerabilities: 3,
    compliance: 94,
    credentials: 'ssh-key-web-prod'
  },
  {
    id: 'AL-002',
    hostname: 'dc-controller-01',
    ipAddress: '192.168.1.10',
    os: 'windows',
    platform: 'Windows Server 2022',
    connectionType: 'winrm',
    status: 'connected',
    lastScan: '2024-01-15 14:25:00',
    lastConnection: '2024-01-15 14:30:00',
    vulnerabilities: 7,
    compliance: 87,
    credentials: 'winrm-admin-creds'
  },
  {
    id: 'AL-003',
    hostname: 'aws-ec2-instance',
    ipAddress: '172.31.45.123',
    os: 'cloud',
    platform: 'AWS EC2',
    connectionType: 'cloud_api',
    status: 'scanning',
    lastScan: '2024-01-15 14:35:00',
    lastConnection: '2024-01-15 14:35:00',
    vulnerabilities: 12,
    compliance: 78,
    region: 'us-east-1',
    credentials: 'aws-access-key'
  },
  {
    id: 'AL-004',
    hostname: 'legacy-server',
    ipAddress: '10.0.2.100',
    os: 'linux',
    platform: 'CentOS 7',
    connectionType: 'ssh',
    status: 'error',
    lastScan: '2024-01-15 12:00:00',
    lastConnection: '2024-01-15 12:00:00',
    vulnerabilities: 23,
    compliance: 45,
    credentials: 'ssh-key-legacy'
  }
];

interface ScanResult {
  id: string;
  targetName: string;
  scanType: 'vulnerability' | 'compliance' | 'configuration' | 'full';
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  findings: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const mockScanResults: ScanResult[] = [
  {
    id: 'SCAN-001',
    targetName: 'aws-ec2-instance',
    scanType: 'vulnerability',
    status: 'running',
    startTime: '2024-01-15 14:35:00',
    findings: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  },
  {
    id: 'SCAN-002',
    targetName: 'prod-web-server',
    scanType: 'compliance',
    status: 'completed',
    startTime: '2024-01-15 14:30:00',
    endTime: '2024-01-15 14:32:15',
    findings: 8,
    critical: 0,
    high: 1,
    medium: 3,
    low: 4
  },
  {
    id: 'SCAN-003',
    targetName: 'dc-controller-01',
    scanType: 'full',
    status: 'completed',
    startTime: '2024-01-15 14:25:00',
    endTime: '2024-01-15 14:28:45',
    findings: 15,
    critical: 2,
    high: 4,
    medium: 6,
    low: 3
  }
];

export default function Agentless() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOS, setSelectedOS] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-success';
      case 'scanning': return 'text-warning';
      case 'disconnected': return 'text-muted-foreground';
      case 'error': return 'text-critical';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'scanning':
        return <AlertTriangle className="h-4 w-4 text-warning animate-pulse" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-critical" />;
      default:
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      connected: 'default',
      scanning: 'secondary',
      disconnected: 'outline',
      error: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getScanStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      running: 'secondary',
      completed: 'default',
      failed: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getOSIcon = (os: string) => {
    return <Server className="h-4 w-4" />;
  };

  const filteredTargets = mockAgentlessTargets.filter(target => {
    const matchesSearch = target.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         target.ipAddress.includes(searchTerm);
    const matchesOS = selectedOS === 'all' || target.os === selectedOS;
    const matchesStatus = selectedStatus === 'all' || target.status === selectedStatus;
    return matchesSearch && matchesOS && matchesStatus;
  });

  const stats = {
    totalTargets: mockAgentlessTargets.length,
    connected: mockAgentlessTargets.filter(t => t.status === 'connected').length,
    scanning: mockAgentlessTargets.filter(t => t.status === 'scanning').length,
    errors: mockAgentlessTargets.filter(t => t.status === 'error').length
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agentless Management</h1>
          <p className="text-muted-foreground">Remote security scanning without installed agents</p>
        </div>
        <Button className="gap-2" onClick={() => navigate('/add-agentless')}>
          <Plus className="h-4 w-4" />
          Add Target
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Wifi className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalTargets}</p>
                <p className="text-sm text-muted-foreground">Total Targets</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.connected}</p>
                <p className="text-sm text-muted-foreground">Connected</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.scanning}</p>
                <p className="text-sm text-muted-foreground">Scanning</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.errors}</p>
                <p className="text-sm text-muted-foreground">Errors</p>
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
        <Select value={selectedOS} onValueChange={setSelectedOS}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by OS" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Operating Systems</SelectItem>
            <SelectItem value="windows">Windows</SelectItem>
            <SelectItem value="linux">Linux</SelectItem>
            <SelectItem value="macos">macOS</SelectItem>
            <SelectItem value="cloud">Cloud</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="connected">Connected</SelectItem>
            <SelectItem value="scanning">Scanning</SelectItem>
            <SelectItem value="disconnected">Disconnected</SelectItem>
            <SelectItem value="error">Error</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Agentless Targets */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Agentless Targets</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredTargets.map((target) => (
              <div
                key={target.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(target.status)}
                  <div>
                    <h3 className="font-medium text-foreground">{target.hostname}</h3>
                    <p className="text-sm text-muted-foreground">
                      {target.ipAddress} • {target.platform} • {target.connectionType.toUpperCase()}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                      <span>Last scan: {target.lastScan}</span>
                      <span>Last connection: {target.lastConnection}</span>
                      {target.region && <span>Region: {target.region}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{target.vulnerabilities}</p>
                    <p className="text-xs text-muted-foreground">Vulns</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{target.compliance}%</p>
                    <p className="text-xs text-muted-foreground">Compliance</p>
                  </div>
                  
                  {getStatusBadge(target.status)}
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => navigate(`/agentless/${target.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Key className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Recent Scans */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Scan Results</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {mockScanResults.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Wifi className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">{scan.targetName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {scan.scanType.replace('_', ' ')} scan • Started: {scan.startTime}
                      {scan.endTime && ` • Completed: ${scan.endTime}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {scan.status === 'completed' && (
                    <>
                      <div className="text-center">
                        <p className="text-sm font-medium text-critical">{scan.critical}</p>
                        <p className="text-xs text-muted-foreground">Critical</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-warning">{scan.high}</p>
                        <p className="text-xs text-muted-foreground">High</p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{scan.findings}</p>
                        <p className="text-xs text-muted-foreground">Total</p>
                      </div>
                    </>
                  )}
                  
                  {getScanStatusBadge(scan.status)}
                  
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
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