import React, { useState } from 'react';
import { Cloud, Shield, AlertTriangle, CheckCircle, Settings, ExternalLink } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CloudResource {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'network' | 'database' | 'security';
  provider: 'aws' | 'azure' | 'gcp';
  region: string;
  status: 'compliant' | 'misconfigured' | 'vulnerable' | 'unknown';
  issues: number;
  lastScan: string;
  compliance: number;
}

const mockCloudResources: CloudResource[] = [
  {
    id: 'AWS-001',
    name: 'Production VPC',
    type: 'network',
    provider: 'aws',
    region: 'us-east-1',
    status: 'compliant',
    issues: 0,
    lastScan: '2024-01-15 14:30:00',
    compliance: 100
  },
  {
    id: 'AWS-002',
    name: 'Web Server Instances',
    type: 'compute',
    provider: 'aws',
    region: 'us-east-1',
    status: 'misconfigured',
    issues: 3,
    lastScan: '2024-01-15 14:25:00',
    compliance: 75
  },
  {
    id: 'AZURE-001',
    name: 'Storage Account',
    type: 'storage',
    provider: 'azure',
    region: 'eastus',
    status: 'vulnerable',
    issues: 5,
    lastScan: '2024-01-15 14:20:00',
    compliance: 60
  },
  {
    id: 'GCP-001',
    name: 'Cloud SQL Database',
    type: 'database',
    provider: 'gcp',
    region: 'us-central1',
    status: 'compliant',
    issues: 1,
    lastScan: '2024-01-15 14:15:00',
    compliance: 95
  }
];

interface ComplianceCheck {
  id: string;
  framework: string;
  control: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  resource: string;
  severity: 'high' | 'medium' | 'low';
}

const mockComplianceChecks: ComplianceCheck[] = [
  {
    id: 'CC-001',
    framework: 'CIS AWS',
    control: '2.1.1',
    description: 'Ensure CloudTrail is enabled in all regions',
    status: 'pass',
    resource: 'CloudTrail Service',
    severity: 'high'
  },
  {
    id: 'CC-002',
    framework: 'SOC 2',
    control: 'CC6.1',
    description: 'S3 bucket with public read access',
    status: 'fail',
    resource: 'S3 Bucket: web-assets',
    severity: 'high'
  },
  {
    id: 'CC-003',
    framework: 'NIST',
    control: 'AC-3',
    description: 'IAM policies should not allow admin access',
    status: 'warning',
    resource: 'IAM Role: developer-role',
    severity: 'medium'
  }
];

interface CloudStats {
  totalResources: number;
  compliant: number;
  misconfigured: number;
  vulnerable: number;
  complianceScore: number;
}

const cloudStats: CloudStats = {
  totalResources: 127,
  compliant: 89,
  misconfigured: 23,
  vulnerable: 15,
  complianceScore: 82
};

export default function CloudSecurity() {
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-success';
      case 'misconfigured': return 'text-warning';
      case 'vulnerable': return 'text-critical';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      compliant: 'default',
      misconfigured: 'secondary',
      vulnerable: 'destructive',
      unknown: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getComplianceStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      pass: 'default',
      warning: 'secondary',
      fail: 'destructive'
    };
    const labels: { [key: string]: string } = {
      pass: 'PASS',
      warning: 'WARNING',
      fail: 'FAIL'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status.toUpperCase()}
      </Badge>
    );
  };

  const getProviderIcon = (provider: string) => {
    return <Cloud className="h-4 w-4" />;
  };

  const filteredResources = mockCloudResources.filter(resource => {
    const matchesProvider = selectedProvider === 'all' || resource.provider === selectedProvider;
    const matchesStatus = selectedStatus === 'all' || resource.status === selectedStatus;
    return matchesProvider && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Cloud Security</h1>
          <p className="text-muted-foreground">Cloud Security Posture Management (CSPM)</p>
        </div>
        <Button className="gap-2">
          <Shield className="h-4 w-4" />
          Run Compliance Scan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cloudStats.totalResources}</p>
                <p className="text-sm text-muted-foreground">Total Resources</p>
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
                <p className="text-2xl font-bold text-foreground">{cloudStats.compliant}</p>
                <p className="text-sm text-muted-foreground">Compliant</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cloudStats.vulnerable}</p>
                <p className="text-sm text-muted-foreground">Vulnerable</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cloudStats.complianceScore}%</p>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Compliance Score */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Overall Compliance Score</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cloud Security Posture</span>
              <span className="text-sm text-muted-foreground">{cloudStats.complianceScore}%</span>
            </div>
            <Progress value={cloudStats.complianceScore} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Critical issues need attention</span>
              <span>Good security posture</span>
            </div>
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedProvider} onValueChange={setSelectedProvider}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by provider" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Providers</SelectItem>
            <SelectItem value="aws">AWS</SelectItem>
            <SelectItem value="azure">Azure</SelectItem>
            <SelectItem value="gcp">Google Cloud</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="compliant">Compliant</SelectItem>
            <SelectItem value="misconfigured">Misconfigured</SelectItem>
            <SelectItem value="vulnerable">Vulnerable</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cloud Resources */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Cloud Resources</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredResources.map((resource) => (
              <div
                key={resource.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getProviderIcon(resource.provider)}
                  <div>
                    <h3 className="font-medium text-foreground">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {resource.type} • {resource.provider.toUpperCase()} • {resource.region}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Last scan: {resource.lastScan} • Issues: {resource.issues}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{resource.compliance}%</p>
                    <p className="text-xs text-muted-foreground">Compliance</p>
                  </div>
                  
                  {getStatusBadge(resource.status)}
                  
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Compliance Checks */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Compliance Checks</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {mockComplianceChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Shield className="h-5 w-5 text-primary" />
                  <div>
                    <h3 className="font-medium text-foreground">{check.description}</h3>
                    <p className="text-sm text-muted-foreground">
                      {check.framework} {check.control} • {check.resource}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-xs">
                    {check.severity.toUpperCase()}
                  </Badge>
                  {getComplianceStatusBadge(check.status)}
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