import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, XCircle, FileText, Calendar, Eye, Clock, Info } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  totalControls: number;
  passedControls: number;
  failedControls: number;
  warningControls: number;
  lastAssessment: string;
  nextAssessment: string;
  complianceScore: number;
  status: 'compliant' | 'non_compliant' | 'partial';
}

const mockFrameworks: ComplianceFramework[] = [
  {
    id: 'SOC2',
    name: 'SOC 2 Type II',
    description: 'System and Organization Controls for service organizations',
    totalControls: 64,
    passedControls: 58,
    failedControls: 3,
    warningControls: 3,
    lastAssessment: '2024-01-10',
    nextAssessment: '2024-04-10',
    complianceScore: 91,
    status: 'partial'
  },
  {
    id: 'ISO27001',
    name: 'ISO 27001:2013',
    description: 'Information Security Management Systems standard',
    totalControls: 114,
    passedControls: 95,
    failedControls: 8,
    warningControls: 11,
    lastAssessment: '2024-01-08',
    nextAssessment: '2024-07-08',
    complianceScore: 83,
    status: 'partial'
  },
  {
    id: 'PCI_DSS',
    name: 'PCI DSS 4.0',
    description: 'Payment Card Industry Data Security Standard',
    totalControls: 320,
    passedControls: 312,
    failedControls: 2,
    warningControls: 6,
    lastAssessment: '2024-01-12',
    nextAssessment: '2024-01-12',
    complianceScore: 98,
    status: 'compliant'
  },
  {
    id: 'NIST',
    name: 'NIST CSF 2.0',
    description: 'NIST Cybersecurity Framework',
    totalControls: 108,
    passedControls: 89,
    failedControls: 12,
    warningControls: 7,
    lastAssessment: '2024-01-05',
    nextAssessment: '2024-04-05',
    complianceScore: 82,
    status: 'partial'
  }
];

interface ComplianceControl {
  id: string;
  framework: string;
  controlId: string;
  title: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'not_tested';
  severity: 'high' | 'medium' | 'low';
  lastTested: string;
  evidence?: string;
  remediation?: string;
}

const mockControls: ComplianceControl[] = [
  {
    id: 'CTRL-001',
    framework: 'SOC2',
    controlId: 'CC6.1',
    title: 'Logical and Physical Access Controls',
    description: 'Access to data and systems is restricted to authorized personnel',
    status: 'pass',
    severity: 'high',
    lastTested: '2024-01-10',
    evidence: 'Access control lists reviewed and validated'
  },
  {
    id: 'CTRL-002',
    framework: 'ISO27001',
    controlId: 'A.9.1.1',
    title: 'Access Control Policy',
    description: 'Access control policy should be established and maintained',
    status: 'fail',
    severity: 'high',
    lastTested: '2024-01-08',
    remediation: 'Update access control policy to include remote work guidelines'
  },
  {
    id: 'CTRL-003',
    framework: 'PCI_DSS',
    controlId: '8.2.3',
    title: 'Password Complexity',
    description: 'Passwords must meet minimum complexity requirements',
    status: 'warning',
    severity: 'medium',
    lastTested: '2024-01-12',
    remediation: 'Some systems do not enforce special character requirements'
  },
  {
    id: 'CTRL-004',
    framework: 'NIST',
    controlId: 'PR.AC-1',
    title: 'Identity and Access Management',
    description: 'Identities and credentials are issued and managed',
    status: 'pass',
    severity: 'high',
    lastTested: '2024-01-05',
    evidence: 'IAM system audit completed successfully'
  }
];

export default function Compliance() {
  const [selectedFramework, setSelectedFramework] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedFrameworkDetail, setSelectedFrameworkDetail] = useState<ComplianceFramework | null>(null);
  const [frameworkDialogOpen, setFrameworkDialogOpen] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass': return 'text-success';
      case 'fail': return 'text-critical';
      case 'warning': return 'text-warning';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-critical" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      pass: 'default',
      fail: 'destructive',
      warning: 'secondary',
      not_tested: 'outline'
    };
    const labels: { [key: string]: string } = {
      pass: 'PASS',
      fail: 'FAIL',
      warning: 'WARNING',
      not_tested: 'NOT TESTED'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status.toUpperCase()}
      </Badge>
    );
  };

  const getFrameworkStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      compliant: 'default',
      partial: 'secondary',
      non_compliant: 'destructive'
    };
    const labels: { [key: string]: string } = {
      compliant: 'COMPLIANT',
      partial: 'PARTIAL',
      non_compliant: 'NON-COMPLIANT'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {labels[status] || status.toUpperCase()}
      </Badge>
    );
  };

  const handleViewFramework = (framework: ComplianceFramework) => {
    setSelectedFrameworkDetail(framework);
    setFrameworkDialogOpen(true);
  };

  const filteredControls = mockControls.filter(control => {
    const matchesFramework = selectedFramework === 'all' || control.framework === selectedFramework;
    const matchesStatus = selectedStatus === 'all' || control.status === selectedStatus;
    return matchesFramework && matchesStatus;
  });

  const overallStats = {
    totalControls: mockFrameworks.reduce((sum, f) => sum + f.totalControls, 0),
    passedControls: mockFrameworks.reduce((sum, f) => sum + f.passedControls, 0),
    failedControls: mockFrameworks.reduce((sum, f) => sum + f.failedControls, 0),
    avgComplianceScore: Math.round(
      mockFrameworks.reduce((sum, f) => sum + f.complianceScore, 0) / mockFrameworks.length
    )
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Compliance Management</h1>
          <p className="text-muted-foreground">Regulatory compliance monitoring and reporting</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Assessment
          </Button>
        </div>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overallStats.avgComplianceScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Compliance</p>
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
                <p className="text-2xl font-bold text-foreground">{overallStats.passedControls}</p>
                <p className="text-sm text-muted-foreground">Passed Controls</p>
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
                <p className="text-2xl font-bold text-foreground">{overallStats.failedControls}</p>
                <p className="text-sm text-muted-foreground">Failed Controls</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockFrameworks.length}</p>
                <p className="text-sm text-muted-foreground">Frameworks</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Compliance Frameworks */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Compliance Frameworks</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {mockFrameworks.map((framework) => (
              <div
                key={framework.id}
                className="p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-foreground">{framework.name}</h3>
                    <p className="text-sm text-muted-foreground">{framework.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{framework.complianceScore}%</p>
                      <p className="text-xs text-muted-foreground">Score</p>
                    </div>
                    {getFrameworkStatusBadge(framework.status)}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Compliance Progress</span>
                    <span>{framework.complianceScore}%</span>
                  </div>
                  <Progress value={framework.complianceScore} className="h-2" />
                  
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-foreground">{framework.totalControls}</p>
                      <p className="text-xs text-muted-foreground">Total</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-success">{framework.passedControls}</p>
                      <p className="text-xs text-muted-foreground">Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-warning">{framework.warningControls}</p>
                      <p className="text-xs text-muted-foreground">Warnings</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-critical">{framework.failedControls}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
                    <span>Last Assessment: {framework.lastAssessment}</span>
                    <span>Next Assessment: {framework.nextAssessment}</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => handleViewFramework(framework)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Framework Details Dialog */}
      <Dialog open={frameworkDialogOpen} onOpenChange={setFrameworkDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Compliance Framework Details</DialogTitle>
            <DialogDescription>
              Detailed compliance status and control information
            </DialogDescription>
          </DialogHeader>
          {selectedFrameworkDetail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Framework</p>
                  <p className="font-medium">{selectedFrameworkDetail.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">
                    {getFrameworkStatusBadge(selectedFrameworkDetail.status)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Compliance Score</p>
                  <p className="font-medium text-2xl">{selectedFrameworkDetail.complianceScore}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Controls</p>
                  <p className="font-medium">{selectedFrameworkDetail.totalControls}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedFrameworkDetail.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Control Status Breakdown</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-success/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Passed</p>
                    <p className="text-2xl font-bold text-success">{selectedFrameworkDetail.passedControls}</p>
                  </div>
                  <div className="bg-warning/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Warnings</p>
                    <p className="text-2xl font-bold text-warning">{selectedFrameworkDetail.warningControls}</p>
                  </div>
                  <div className="bg-critical/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-critical">{selectedFrameworkDetail.failedControls}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold text-primary">{selectedFrameworkDetail.totalControls}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Assessment Timeline</h4>
                <div className="text-sm space-y-1">
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-muted-foreground">Last Assessment:</span>
                    <span className="font-medium">{selectedFrameworkDetail.lastAssessment}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-muted-foreground">Next Assessment:</span>
                    <span className="font-medium">{selectedFrameworkDetail.nextAssessment}</span>
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Recommendations</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Address {selectedFrameworkDetail.failedControls} failed controls immediately</p>
                  <p>• Review {selectedFrameworkDetail.warningControls} warning controls within 30 days</p>
                  <p>• Maintain current compliance posture for passed controls</p>
                  <p>• Schedule remediation planning session</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedFramework} onValueChange={setSelectedFramework}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by framework" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Frameworks</SelectItem>
            {mockFrameworks.map(framework => (
              <SelectItem key={framework.id} value={framework.id}>
                {framework.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pass">Pass</SelectItem>
            <SelectItem value="fail">Fail</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="not_tested">Not Tested</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Control Details */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Control Assessment Results</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredControls.map((control) => (
              <div
                key={control.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(control.status)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{control.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {control.framework} {control.controlId}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{control.description}</p>
                    {control.evidence && (
                      <p className="text-xs text-success">Evidence: {control.evidence}</p>
                    )}
                    {control.remediation && (
                      <p className="text-xs text-warning">Remediation: {control.remediation}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Last tested: {control.lastTested}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {control.severity.toUpperCase()}
                  </Badge>
                  {getStatusBadge(control.status)}
                  <Button variant="ghost" size="sm">
                    <FileText className="h-4 w-4" />
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