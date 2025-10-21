import React, { useState } from 'react';
import { Search, FileText, AlertTriangle, Plus, Upload, Settings } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface YaraRule {
  id: string;
  name: string;
  category: string;
  tags: string[];
  enabled: boolean;
  matches: number;
  lastMatch: string;
}

interface YaraMatch {
  id: string;
  rule: string;
  file: string;
  agent: string;
  timestamp: string;
  confidence: number;
  threat: string;
}

const mockYaraRules: YaraRule[] = [
  {
    id: 'rule-001',
    name: 'Detect_Malicious_PowerShell',
    category: 'PowerShell',
    tags: ['malware', 'powershell', 'suspicious'],
    enabled: true,
    matches: 23,
    lastMatch: '2024-01-15 14:30:22'
  },
  {
    id: 'rule-002',
    name: 'Ransomware_Indicators',
    category: 'Ransomware',
    tags: ['ransomware', 'encryption', 'malware'],
    enabled: true,
    matches: 5,
    lastMatch: '2024-01-15 12:15:33'
  },
  {
    id: 'rule-003',
    name: 'Suspicious_Network_Activity',
    category: 'Network',
    tags: ['network', 'c2', 'communication'],
    enabled: false,
    matches: 0,
    lastMatch: 'Never'
  }
];

const mockYaraMatches: YaraMatch[] = [
  {
    id: 'match-001',
    rule: 'Detect_Malicious_PowerShell',
    file: 'C:\\temp\\script.ps1',
    agent: 'WEB-SERVER-01',
    timestamp: '2024-01-15 14:30:22',
    confidence: 95,
    threat: 'Potentially malicious PowerShell script'
  },
  {
    id: 'match-002',
    rule: 'Ransomware_Indicators',
    file: '/tmp/suspicious_binary',
    agent: 'DB-SERVER-01',
    timestamp: '2024-01-15 12:15:33',
    confidence: 88,
    threat: 'Ransomware-like behavior detected'
  }
];

export default function YaraAnalysis() {
  const [activeTab, setActiveTab] = useState<'rules' | 'matches'>('rules');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRule, setSelectedRule] = useState<YaraRule | null>(null);
  const [configOpen, setConfigOpen] = useState(false);

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-critical';
    if (confidence >= 70) return 'text-warning';
    return 'text-primary';
  };

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) return <Badge variant="destructive">{confidence}%</Badge>;
    if (confidence >= 70) return <Badge variant="default">{confidence}%</Badge>;
    return <Badge variant="secondary">{confidence}%</Badge>;
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">YARA Analysis</h1>
          <p className="text-muted-foreground">Malware detection and pattern matching</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={configOpen} onOpenChange={setConfigOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Configure
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>YARA Configuration</DialogTitle>
                <DialogDescription>
                  Configure YARA scanning settings and rule management
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Scan Settings</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Auto-scan new files', desc: 'Automatically scan files as they are created or modified' },
                      { name: 'Real-time scanning', desc: 'Enable continuous real-time YARA scanning' },
                      { name: 'Alert on matches', desc: 'Send notifications when YARA rules match' },
                      { name: 'Quarantine threats', desc: 'Automatically quarantine matched files' }
                    ].map((option, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 border border-border rounded-lg">
                        <Checkbox defaultChecked id={`scan-${idx}`} />
                        <div className="flex-1">
                          <Label htmlFor={`scan-${idx}`} className="font-medium cursor-pointer">
                            {option.name}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-foreground">Rule Categories</h3>
                  <div className="space-y-3">
                    {[
                      { name: 'Malware Detection', count: 45 },
                      { name: 'Ransomware', count: 23 },
                      { name: 'PowerShell Scripts', count: 18 },
                      { name: 'Network Threats', count: 12 }
                    ].map((category, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox defaultChecked id={`cat-${idx}`} />
                          <Label htmlFor={`cat-${idx}`} className="font-medium cursor-pointer">
                            {category.name}
                          </Label>
                        </div>
                        <Badge variant="outline">{category.count} rules</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Custom YARA Rule</Label>
                  <Textarea 
                    placeholder="rule example { meta: ... strings: ... condition: ... }"
                    className="font-mono text-sm min-h-[120px]"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="gap-2" onClick={() => window.location.href = '/yara/upload'}>
            <Upload className="h-4 w-4" />
            Upload File
          </Button>
          <Button className="gap-2" onClick={() => window.location.href = '/yara/create-rule'}>
            <Plus className="h-4 w-4" />
            Create Rule
          </Button>
        </div>
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
                <p className="text-2xl font-bold text-foreground">{mockYaraRules.length}</p>
                <p className="text-sm text-muted-foreground">Active Rules</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard variant="critical">
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockYaraMatches.length}</p>
                <p className="text-sm text-muted-foreground">Recent Matches</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">1,247</p>
                <p className="text-sm text-muted-foreground">Files Scanned</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">28</p>
                <p className="text-sm text-muted-foreground">Total Matches</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'rules'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          YARA Rules
        </button>
        <button
          onClick={() => setActiveTab('matches')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'matches'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Matches & Results
        </button>
      </div>

      {/* Search */}
      <Input
        placeholder={`Search ${activeTab}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {/* Content */}
      {activeTab === 'rules' && (
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>YARA Rules Library</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              {mockYaraRules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-success' : 'bg-muted-foreground'}`} />
                    <div>
                      <h3 className="font-medium text-foreground">{rule.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Category: {rule.category} • Last match: {rule.lastMatch}
                      </p>
                      <div className="flex gap-1 mt-1">
                        {rule.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{rule.matches}</p>
                      <p className="text-xs text-muted-foreground">Matches</p>
                    </div>
                    
                    <Badge variant={rule.enabled ? "default" : "secondary"}>
                      {rule.enabled ? "Enabled" : "Disabled"}
                    </Badge>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRule(rule)}>
                          Configure
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Configure YARA Rule</DialogTitle>
                          <DialogDescription>
                            Modify rule settings and behavior
                          </DialogDescription>
                        </DialogHeader>
                        {selectedRule && (
                          <div className="space-y-6 py-4">
                            <div className="space-y-2">
                              <Label>Rule Name</Label>
                              <Input defaultValue={selectedRule.name} />
                            </div>

                            <div className="space-y-2">
                              <Label>Category</Label>
                              <Input defaultValue={selectedRule.category} />
                            </div>

                            <div className="space-y-3">
                              <Label>Rule Options</Label>
                              {[
                                { name: 'Enable this rule', checked: selectedRule.enabled },
                                { name: 'Send alerts on match', checked: true },
                                { name: 'Log all matches', checked: true },
                                { name: 'Auto-quarantine', checked: false }
                              ].map((option, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                  <Checkbox defaultChecked={option.checked} id={`rule-opt-${idx}`} />
                                  <Label htmlFor={`rule-opt-${idx}`} className="cursor-pointer">
                                    {option.name}
                                  </Label>
                                </div>
                              ))}
                            </div>

                            <div className="space-y-2">
                              <Label>Rule Definition</Label>
                              <Textarea 
                                className="font-mono text-sm min-h-[150px]"
                                defaultValue={`rule ${selectedRule.name} {\n  meta:\n    description = "Rule description"\n    category = "${selectedRule.category}"\n  strings:\n    $string1 = "pattern"\n  condition:\n    $string1\n}`}
                              />
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      )}

      {activeTab === 'matches' && (
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Detection Results</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              {mockYaraMatches.map((match) => (
                <div
                  key={match.id}
                  className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="h-5 w-5 text-critical" />
                    <div>
                      <h3 className="font-medium text-foreground">{match.rule}</h3>
                      <p className="text-sm text-muted-foreground">
                        {match.file} on {match.agent}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {match.threat}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">{match.timestamp}</p>
                      <p className="text-xs text-muted-foreground">Detected</p>
                    </div>
                    
                    {getConfidenceBadge(match.confidence)}
                    
                    <Button variant="ghost" size="sm">
                      Investigate
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      )}
    </div>
  );
}