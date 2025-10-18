import React, { useState } from 'react';
import { Bug, AlertTriangle, Shield, Search, Filter, ExternalLink, Play, CheckCircle, Download, Settings, Database, Server, Cloud } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '@/hooks/use-toast';

interface Vulnerability {
  id: string;
  cve: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  score: number;
  description: string;
  affectedAssets: string[];
  status: 'open' | 'patched' | 'mitigated' | 'false_positive';
  discoveredDate: string;
  dueDate?: string;
  category: string;
}

const mockVulnerabilities: Vulnerability[] = [
  {
    id: 'VULN-001',
    cve: 'CVE-2024-1234',
    title: 'Remote Code Execution in Apache HTTP Server',
    severity: 'critical',
    score: 9.8,
    description: 'A critical vulnerability allowing remote code execution through HTTP request processing.',
    affectedAssets: ['WEB-SERVER-01', 'WEB-SERVER-02'],
    status: 'open',
    discoveredDate: '2024-01-15',
    dueDate: '2024-01-22',
    category: 'Web Application'
  },
  {
    id: 'VULN-002',
    cve: 'CVE-2024-5678',
    title: 'SQL Injection in User Authentication',
    severity: 'high',
    score: 8.1,
    description: 'SQL injection vulnerability in the user authentication module.',
    affectedAssets: ['DB-SERVER-01'],
    status: 'mitigated',
    discoveredDate: '2024-01-14',
    category: 'Database'
  },
  {
    id: 'VULN-003',
    cve: 'CVE-2024-9012',
    title: 'Cross-Site Scripting (XSS)',
    severity: 'medium',
    score: 6.1,
    description: 'Stored XSS vulnerability in user comment system.',
    affectedAssets: ['WEB-SERVER-01'],
    status: 'patched',
    discoveredDate: '2024-01-13',
    category: 'Web Application'
  },
  {
    id: 'VULN-004',
    cve: 'CVE-2024-3456',
    title: 'Information Disclosure',
    severity: 'low',
    score: 3.7,
    description: 'Server configuration exposes sensitive information in error messages.',
    affectedAssets: ['APP-SERVER-01'],
    status: 'open',
    discoveredDate: '2024-01-12',
    category: 'Configuration'
  }
];

interface VulnStats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  patched: number;
}

const vulnStats: VulnStats = {
  total: 247,
  critical: 3,
  high: 12,
  medium: 45,
  low: 187,
  patched: 198
};

export default function Vulnerabilities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [selectedTargets, setSelectedTargets] = useState<string[]>([]);
  const [scanType, setScanType] = useState('full');

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
      mitigated: 'secondary',
      patched: 'default',
      false_positive: 'outline'
    };
    const labels: { [key: string]: string } = {
      open: 'OPEN',
      mitigated: 'MITIGATED',
      patched: 'PATCHED',
      false_positive: 'FALSE POSITIVE'
    };
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status.toUpperCase()}
      </Badge>
    );
  };

  const scanTargets = [
    { id: 'web-servers', label: 'Web Servers', icon: Server, count: 12 },
    { id: 'databases', label: 'Database Servers', icon: Database, count: 8 },
    { id: 'cloud', label: 'Cloud Infrastructure', icon: Cloud, count: 25 },
    { id: 'endpoints', label: 'Endpoints', icon: Server, count: 156 }
  ];

  const handleTargetToggle = (targetId: string) => {
    setSelectedTargets(prev => 
      prev.includes(targetId) 
        ? prev.filter(id => id !== targetId)
        : [...prev, targetId]
    );
  };

  const handleStartScan = () => {
    if (selectedTargets.length === 0) {
      toast({
        title: "No targets selected",
        description: "Please select at least one target to scan",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Scan Started",
      description: `Running ${scanType} vulnerability scan on ${selectedTargets.length} target(s)`
    });
    setScanDialogOpen(false);
    setSelectedTargets([]);
  };

  const handlePatchVulnerability = (vuln: Vulnerability) => {
    toast({
      title: "Patch Process Started",
      description: `Initiating patch for ${vuln.cve} on ${vuln.affectedAssets.length} asset(s)`,
    });
  };

  const handleDownloadPatch = (vuln: Vulnerability) => {
    toast({
      title: "Downloading Patch",
      description: `Preparing patch package for ${vuln.cve}`,
    });
  };

  const filteredVulnerabilities = mockVulnerabilities.filter(vuln => {
    const matchesSearch = vuln.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.cve.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vuln.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = selectedSeverity === 'all' || vuln.severity === selectedSeverity;
    const matchesStatus = selectedStatus === 'all' || vuln.status === selectedStatus;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Vulnerability Management</h1>
          <p className="text-muted-foreground">Track and remediate security vulnerabilities</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={scanDialogOpen} onOpenChange={setScanDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Shield className="h-4 w-4" />
                Run Scan
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Run Vulnerability Scan</DialogTitle>
                <DialogDescription>
                  Configure and start a new vulnerability scan
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6 py-4">
                {/* Scan Type */}
                <div className="space-y-2">
                  <Label>Scan Type</Label>
                  <Select value={scanType} onValueChange={setScanType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Scan (Comprehensive)</SelectItem>
                      <SelectItem value="quick">Quick Scan (Critical only)</SelectItem>
                      <SelectItem value="custom">Custom Scan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Selection */}
                <div className="space-y-3">
                  <Label>Select Targets</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {scanTargets.map((target) => {
                      const Icon = target.icon;
                      return (
                        <div
                          key={target.id}
                          className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                            selectedTargets.includes(target.id)
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:bg-accent/50'
                          }`}
                          onClick={() => handleTargetToggle(target.id)}
                        >
                          <Checkbox
                            checked={selectedTargets.includes(target.id)}
                            onCheckedChange={() => handleTargetToggle(target.id)}
                          />
                          <Icon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{target.label}</p>
                            <p className="text-xs text-muted-foreground">{target.count} assets</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Vulnerability Checks */}
                <div className="space-y-3">
                  <Label>Vulnerability Checks</Label>
                  <div className="space-y-2 p-4 border rounded-lg bg-accent/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        CVE Database
                      </span>
                      <Badge variant="outline">15,847 signatures</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Configuration Issues
                      </span>
                      <Badge variant="outline">2,341 checks</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Outdated Software
                      </span>
                      <Badge variant="outline">8,923 packages</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        Known Exploits
                      </span>
                      <Badge variant="outline">4,562 patterns</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setScanDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleStartScan} className="gap-2">
                  <Play className="h-4 w-4" />
                  Start Scan
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{vulnStats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-critical">{vulnStats.critical}</p>
              <p className="text-sm text-muted-foreground">Critical</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-warning">{vulnStats.high}</p>
              <p className="text-sm text-muted-foreground">High</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">{vulnStats.medium}</p>
              <p className="text-sm text-muted-foreground">Medium</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{vulnStats.low}</p>
              <p className="text-sm text-muted-foreground">Low</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{vulnStats.patched}</p>
              <p className="text-sm text-muted-foreground">Patched</p>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Patch Rate Progress */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Patch Rate Progress</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Patch Rate</span>
              <span className="text-sm text-muted-foreground">
                {Math.round((vulnStats.patched / vulnStats.total) * 100)}%
              </span>
            </div>
            <Progress value={(vulnStats.patched / vulnStats.total) * 100} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{vulnStats.patched} patched</span>
              <span>{vulnStats.total - vulnStats.patched} remaining</span>
            </div>
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vulnerabilities..."
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
            <SelectItem value="mitigated">Mitigated</SelectItem>
            <SelectItem value="patched">Patched</SelectItem>
            <SelectItem value="false_positive">False Positive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Vulnerabilities List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Vulnerabilities ({filteredVulnerabilities.length} results)</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredVulnerabilities.map((vuln) => (
              <div
                key={vuln.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Bug className={`h-5 w-5 ${getSeverityColor(vuln.severity)}`} />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{vuln.title}</h3>
                      <Badge variant="outline" className="text-xs">{vuln.cve}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{vuln.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Assets: {vuln.affectedAssets.join(', ')}</span>
                      <span>Category: {vuln.category}</span>
                      <span>Discovered: {vuln.discoveredDate}</span>
                      {vuln.dueDate && <span>Due: {vuln.dueDate}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{vuln.score}</p>
                    <p className="text-xs text-muted-foreground">CVSS</p>
                  </div>
                  
                  {getSeverityBadge(vuln.severity)}
                  {getStatusBadge(vuln.status)}
                  
                  <div className="flex gap-2">
                    {vuln.status === 'open' && (
                      <>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handlePatchVulnerability(vuln)}
                          className="gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Patch
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDownloadPatch(vuln)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}