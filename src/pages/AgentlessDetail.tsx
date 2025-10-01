import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Server, Activity, Shield, AlertTriangle, CheckCircle, XCircle, Key, Trash2 } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AgentlessDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - in real app, fetch based on id
  const target = {
    id: id || 'AL-001',
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
    credentials: 'ssh-key-web-prod',
    port: 22,
    region: 'us-east-1',
    scanFrequency: 'Daily at 2:00 AM',
  };

  const scanHistory = [
    { id: 1, date: '2024-01-15 14:30:00', type: 'Full Scan', findings: 8, critical: 0, high: 1, status: 'completed' },
    { id: 2, date: '2024-01-14 14:30:00', type: 'Vulnerability', findings: 12, critical: 1, high: 2, status: 'completed' },
    { id: 3, date: '2024-01-13 14:30:00', type: 'Compliance', findings: 5, critical: 0, high: 0, status: 'completed' },
    { id: 4, date: '2024-01-12 14:30:00', type: 'Full Scan', findings: 15, critical: 2, high: 3, status: 'completed' },
  ];

  const vulnerabilities = [
    { id: 1, cve: 'CVE-2023-12345', severity: 'high', title: 'OpenSSL Vulnerability', status: 'open' },
    { id: 2, cve: 'CVE-2023-67890', severity: 'medium', title: 'Apache Configuration Issue', status: 'open' },
    { id: 3, cve: 'CVE-2023-11111', severity: 'low', title: 'Outdated Package', status: 'mitigated' },
  ];

  const getStatusBadge = () => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      connected: 'default',
      scanning: 'secondary',
      disconnected: 'outline',
      error: 'destructive'
    };
    return (
      <Badge variant={variants[target.status] || 'outline'}>
        {target.status.toUpperCase()}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" } = {
      high: 'destructive',
      critical: 'destructive',
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
          <Button variant="ghost" size="icon" onClick={() => navigate('/agentless')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{target.hostname}</h1>
            <p className="text-muted-foreground">{target.platform} • {target.ipAddress}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button variant="outline" size="sm">
            Test Connection
          </Button>
          <Button variant="outline" size="sm">
            Start Scan
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Target
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{target.vulnerabilities}</p>
                <p className="text-sm text-muted-foreground">Vulnerabilities</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{target.compliance}%</p>
                <p className="text-sm text-muted-foreground">Compliance</p>
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
                <p className="text-2xl font-bold text-foreground">{scanHistory.length}</p>
                <p className="text-sm text-muted-foreground">Total Scans</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Server className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{target.connectionType.toUpperCase()}</p>
                <p className="text-sm text-muted-foreground">Connection</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Target Information */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Target Information</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Target ID:</span>
                <span className="font-medium text-foreground">{target.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Operating System:</span>
                <span className="font-medium text-foreground">{target.platform}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Connection Type:</span>
                <span className="font-medium text-foreground">{target.connectionType.toUpperCase()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Port:</span>
                <span className="font-medium text-foreground">{target.port}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Last Connection:</span>
                <span className="font-medium text-foreground">{target.lastConnection}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Last Scan:</span>
                <span className="font-medium text-foreground">{target.lastScan}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Scan Frequency:</span>
                <span className="font-medium text-foreground">{target.scanFrequency}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Credentials:</span>
                <div className="flex items-center gap-2">
                  <Key className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{target.credentials}</span>
                </div>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Vulnerabilities */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Active Vulnerabilities</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-3">
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln.id}
                  className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{vuln.cve}</span>
                      {getSeverityBadge(vuln.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{vuln.title}</p>
                  </div>
                  <Badge variant={vuln.status === 'open' ? 'destructive' : 'default'}>
                    {vuln.status}
                  </Badge>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Scan History */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Scan History</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {scanHistory.map((scan) => (
              <div
                key={scan.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-foreground">{scan.type}</p>
                    <p className="text-sm text-muted-foreground">{scan.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
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
                  <Badge variant="default">{scan.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}
