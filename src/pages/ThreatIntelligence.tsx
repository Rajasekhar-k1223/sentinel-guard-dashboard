import React, { useState } from 'react';
import { Shield, AlertTriangle, Globe, Database, Search, Download, Eye, Clock, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url';
  value: string;
  threat_type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  source: string;
  first_seen: string;
  last_seen: string;
  description: string;
}

const mockIndicators: ThreatIndicator[] = [
  {
    id: 'IOC-001',
    type: 'ip',
    value: '203.0.113.45',
    threat_type: 'Malware C&C',
    severity: 'critical',
    confidence: 95,
    source: 'AlienVault OTX',
    first_seen: '2024-01-10',
    last_seen: '2024-01-15',
    description: 'Known command and control server for ransomware campaigns'
  },
  {
    id: 'IOC-002',
    type: 'domain',
    value: 'malicious-site.example.com',
    threat_type: 'Phishing',
    severity: 'high',
    confidence: 88,
    source: 'PhishTank',
    first_seen: '2024-01-12',
    last_seen: '2024-01-15',
    description: 'Phishing site impersonating financial institution'
  },
  {
    id: 'IOC-003',
    type: 'hash',
    value: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    threat_type: 'Trojan',
    severity: 'high',
    confidence: 92,
    source: 'VirusTotal',
    first_seen: '2024-01-11',
    last_seen: '2024-01-14',
    description: 'SHA-256 hash of known trojan malware'
  },
  {
    id: 'IOC-004',
    type: 'url',
    value: 'https://bad-site.example.com/malware.exe',
    threat_type: 'Malware Distribution',
    severity: 'medium',
    confidence: 75,
    source: 'URLhaus',
    first_seen: '2024-01-13',
    last_seen: '2024-01-15',
    description: 'URL hosting malicious executable files'
  }
];

export default function ThreatIntelligence() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedThreat, setSelectedThreat] = useState<ThreatIndicator | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const getTypeBadge = (type: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      ip: 'default',
      domain: 'secondary',
      hash: 'outline',
      url: 'destructive'
    };
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

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

  const handleViewThreat = (threat: ThreatIndicator) => {
    setSelectedThreat(threat);
    setDetailsDialogOpen(true);
  };

  const filteredIndicators = mockIndicators.filter(indicator => {
    const matchesSearch = indicator.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         indicator.threat_type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || indicator.type === selectedType;
    const matchesSeverity = selectedSeverity === 'all' || indicator.severity === selectedSeverity;
    return matchesSearch && matchesType && matchesSeverity;
  });

  const stats = {
    total: mockIndicators.length,
    critical: mockIndicators.filter(i => i.severity === 'critical').length,
    high: mockIndicators.filter(i => i.severity === 'high').length,
    avgConfidence: Math.round(
      mockIndicators.reduce((sum, i) => sum + i.confidence, 0) / mockIndicators.length
    ),
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Threat Intelligence</h1>
          <p className="text-muted-foreground">Indicators of Compromise (IOCs) and threat feeds</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export IOCs
          </Button>
          <Button className="gap-2">
            <Database className="h-4 w-4" />
            Sync Feeds
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total IOCs</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                <p className="text-sm text-muted-foreground">Critical</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.high}</p>
                <p className="text-sm text-muted-foreground">High</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Globe className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.avgConfidence}%</p>
                <p className="text-sm text-muted-foreground">Avg Confidence</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search IOCs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="ip">IP Address</SelectItem>
            <SelectItem value="domain">Domain</SelectItem>
            <SelectItem value="hash">Hash</SelectItem>
            <SelectItem value="url">URL</SelectItem>
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

      {/* IOCs List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>
            Threat Indicators ({filteredIndicators.length} results)
          </SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredIndicators.map((indicator) => (
              <div
                key={indicator.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 bg-critical/10 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-critical" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground font-mono text-sm">{indicator.value}</h3>
                      <Badge variant="outline" className="text-xs">{indicator.id}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{indicator.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Type: {indicator.threat_type}</span>
                      <span>Source: {indicator.source}</span>
                      <span>Confidence: {indicator.confidence}%</span>
                      <span>First Seen: {indicator.first_seen}</span>
                      <span>Last Seen: {indicator.last_seen}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getTypeBadge(indicator.type)}
                  {getSeverityBadge(indicator.severity)}
                  <Button variant="ghost" size="sm" onClick={() => handleViewThreat(indicator)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    Block
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Threat Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Threat Indicator Details</DialogTitle>
            <DialogDescription>
              Comprehensive threat intelligence information
            </DialogDescription>
          </DialogHeader>
          {selectedThreat && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">IOC ID</p>
                  <p className="font-medium">{selectedThreat.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <div className="mt-1">
                    {getTypeBadge(selectedThreat.type)}
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Value</p>
                  <p className="font-medium font-mono break-all">{selectedThreat.value}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Threat Type</p>
                  <p className="font-medium">{selectedThreat.threat_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <div className="mt-1">
                    {getSeverityBadge(selectedThreat.severity)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Confidence Score</p>
                  <p className="font-medium text-lg">{selectedThreat.confidence}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Source</p>
                  <p className="font-medium flex items-center gap-1">
                    <Database className="h-3 w-3" />
                    {selectedThreat.source}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">First Seen</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedThreat.first_seen}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Seen</p>
                  <p className="font-medium flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedThreat.last_seen}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className="text-sm">{selectedThreat.description}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Recommended Actions</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Block this indicator in firewall rules</p>
                  <p>• Add to threat intelligence feeds</p>
                  <p>• Monitor for related indicators</p>
                  <p>• Check logs for historical matches</p>
                  <p>• Update security policies accordingly</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Related Information</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    View in threat intelligence platform
                  </p>
                  <p className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Check MITRE ATT&CK framework
                  </p>
                  <p className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Search in threat feeds
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
