import React, { useState } from 'react';
import { FileText, Download, Calendar, TrendingUp, PieChart, BarChart3 } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'security' | 'compliance' | 'performance' | 'audit';
  lastGenerated: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'on-demand';
  format: 'PDF' | 'CSV' | 'JSON';
  size: string;
}

const mockReports: Report[] = [
  {
    id: 'RPT-001',
    name: 'Security Incident Summary',
    description: 'Comprehensive overview of all security incidents and their resolution status',
    type: 'security',
    lastGenerated: '2024-01-15 02:00:00',
    frequency: 'daily',
    format: 'PDF',
    size: '2.4 MB'
  },
  {
    id: 'RPT-002',
    name: 'Compliance Audit Report',
    description: 'SOC 2, ISO 27001, and PCI DSS compliance status report',
    type: 'compliance',
    lastGenerated: '2024-01-14 02:00:00',
    frequency: 'weekly',
    format: 'PDF',
    size: '5.1 MB'
  },
  {
    id: 'RPT-003',
    name: 'System Performance Metrics',
    description: 'Agent performance, uptime, and resource utilization statistics',
    type: 'performance',
    lastGenerated: '2024-01-15 02:00:00',
    frequency: 'daily',
    format: 'CSV',
    size: '1.2 MB'
  },
  {
    id: 'RPT-004',
    name: 'User Activity Log',
    description: 'Detailed audit trail of all user activities and system access',
    type: 'audit',
    lastGenerated: '2024-01-01 02:00:00',
    frequency: 'monthly',
    format: 'PDF',
    size: '8.7 MB'
  }
];

export default function Reports() {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<string>('all');

  const getTypeBadge = (type: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      security: 'destructive',
      compliance: 'default',
      performance: 'secondary',
      audit: 'outline'
    };
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const getFrequencyBadge = (frequency: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {frequency.toUpperCase()}
      </Badge>
    );
  };

  const handleGenerateReport = (reportId: string) => {
    toast({
      title: "Generating Report",
      description: `Report ${reportId} is being generated...`,
    });
  };

  const handleDownloadReport = (reportId: string) => {
    toast({
      title: "Downloading Report",
      description: `Report ${reportId} download started.`,
    });
  };

  const filteredReports = mockReports.filter(report => {
    const matchesType = selectedType === 'all' || report.type === selectedType;
    return matchesType;
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and download security reports</p>
        </div>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Create Custom Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockReports.length}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockReports.filter(r => r.type === 'security').length}
                </p>
                <p className="text-sm text-muted-foreground">Security</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <PieChart className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockReports.filter(r => r.type === 'compliance').length}
                </p>
                <p className="text-sm text-muted-foreground">Compliance</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockReports.filter(r => r.frequency === 'daily').length}
                </p>
                <p className="text-sm text-muted-foreground">Daily Reports</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            <SelectItem value="compliance">Compliance</SelectItem>
            <SelectItem value="performance">Performance</SelectItem>
            <SelectItem value="audit">Audit</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reports List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Available Reports ({filteredReports.length})</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{report.name}</h3>
                      <Badge variant="outline" className="text-xs">{report.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{report.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Last: {report.lastGenerated}
                      </span>
                      <span>Format: {report.format}</span>
                      <span>Size: {report.size}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getTypeBadge(report.type)}
                  {getFrequencyBadge(report.frequency)}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGenerateReport(report.id)}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleDownloadReport(report.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
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
