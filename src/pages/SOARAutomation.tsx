import React, { useState } from 'react';
import { Zap, Play, Pause, Square, Settings, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Playbook {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'running';
  trigger: string;
  actions: number;
  executions: number;
  successRate: number;
  lastRun?: string;
  category: string;
}

const mockPlaybooks: Playbook[] = [
  {
    id: 'PB-001',
    name: 'Malware Detection Response',
    description: 'Automatically isolate endpoints and quarantine files when malware is detected',
    status: 'active',
    trigger: 'Malware Alert',
    actions: 5,
    executions: 127,
    successRate: 94,
    lastRun: '2024-01-15 14:30:22',
    category: 'Incident Response'
  },
  {
    id: 'PB-002',
    name: 'Phishing Email Handling',
    description: 'Block sender, remove emails from all mailboxes, and notify users',
    status: 'active',
    trigger: 'Phishing Detection',
    actions: 4,
    executions: 89,
    successRate: 98,
    lastRun: '2024-01-15 13:45:15',
    category: 'Email Security'
  },
  {
    id: 'PB-003',
    name: 'Failed Login Response',
    description: 'Lock account and notify security team after multiple failed attempts',
    status: 'running',
    trigger: 'Authentication Failure',
    actions: 3,
    executions: 203,
    successRate: 96,
    lastRun: '2024-01-15 14:35:00',
    category: 'Access Control'
  },
  {
    id: 'PB-004',
    name: 'Vulnerability Scanner',
    description: 'Scheduled vulnerability assessment and automatic patching',
    status: 'inactive',
    trigger: 'Weekly Schedule',
    actions: 7,
    executions: 24,
    successRate: 87,
    lastRun: '2024-01-14 02:00:00',
    category: 'Vulnerability Management'
  }
];

interface ExecutionLog {
  id: string;
  playbookName: string;
  status: 'success' | 'failed' | 'running';
  startTime: string;
  endTime?: string;
  trigger: string;
  actionsCompleted: number;
  totalActions: number;
}

const mockExecutions: ExecutionLog[] = [
  {
    id: 'EX-001',
    playbookName: 'Failed Login Response',
    status: 'running',
    startTime: '2024-01-15 14:35:00',
    trigger: 'Multiple failed logins detected',
    actionsCompleted: 2,
    totalActions: 3
  },
  {
    id: 'EX-002',
    playbookName: 'Malware Detection Response',
    status: 'success',
    startTime: '2024-01-15 14:30:22',
    endTime: '2024-01-15 14:31:45',
    trigger: 'Trojan detected on WEB-SERVER-01',
    actionsCompleted: 5,
    totalActions: 5
  },
  {
    id: 'EX-003',
    playbookName: 'Phishing Email Handling',
    status: 'success',
    startTime: '2024-01-15 13:45:15',
    endTime: '2024-01-15 13:46:02',
    trigger: 'Phishing email reported by user',
    actionsCompleted: 4,
    totalActions: 4
  }
];

export default function SOARAutomation() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-success';
      case 'running': return 'text-warning';
      case 'inactive': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      active: 'default',
      running: 'secondary',
      inactive: 'outline'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getExecutionStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'running':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-critical" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getExecutionStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      success: 'default',
      running: 'secondary',
      failed: 'destructive'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredPlaybooks = mockPlaybooks.filter(playbook => {
    const matchesCategory = selectedCategory === 'all' || playbook.category === selectedCategory;
    return matchesCategory;
  });

  const categories = Array.from(new Set(mockPlaybooks.map(p => p.category)));

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">SOAR Automation</h1>
          <p className="text-muted-foreground">Security Orchestration, Automation & Response</p>
        </div>
        <Button className="gap-2">
          <Zap className="h-4 w-4" />
          Create Playbook
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockPlaybooks.length}</p>
                <p className="text-sm text-muted-foreground">Active Playbooks</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockPlaybooks.reduce((sum, p) => sum + p.executions, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Executions</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockExecutions.filter(e => e.status === 'running').length}
                </p>
                <p className="text-sm text-muted-foreground">Running Now</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(mockPlaybooks.reduce((sum, p) => sum + p.successRate, 0) / mockPlaybooks.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Playbooks */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Security Playbooks</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {filteredPlaybooks.map((playbook) => (
              <div
                key={playbook.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Zap className={`h-5 w-5 ${getStatusColor(playbook.status)}`} />
                  <div>
                    <h3 className="font-medium text-foreground">{playbook.name}</h3>
                    <p className="text-sm text-muted-foreground mb-1">{playbook.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Trigger: {playbook.trigger}</span>
                      <span>Actions: {playbook.actions}</span>
                      <span>Category: {playbook.category}</span>
                      {playbook.lastRun && <span>Last Run: {playbook.lastRun}</span>}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{playbook.executions}</p>
                    <p className="text-xs text-muted-foreground">Runs</p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{playbook.successRate}%</p>
                    <p className="text-xs text-muted-foreground">Success</p>
                  </div>
                  
                  {getStatusBadge(playbook.status)}
                  
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm">
                      <Play className="h-4 w-4" />
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

      {/* Recent Executions */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Executions</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {mockExecutions.map((execution) => (
              <div
                key={execution.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getExecutionStatusIcon(execution.status)}
                  <div>
                    <h3 className="font-medium text-foreground">{execution.playbookName}</h3>
                    <p className="text-sm text-muted-foreground">{execution.trigger}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Started: {execution.startTime}
                      {execution.endTime && ` • Completed: ${execution.endTime}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {execution.status === 'running' ? (
                    <div className="w-32">
                      <Progress 
                        value={(execution.actionsCompleted / execution.totalActions) * 100} 
                        className="h-2" 
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {execution.actionsCompleted}/{execution.totalActions} actions
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">
                        {execution.actionsCompleted}/{execution.totalActions}
                      </p>
                      <p className="text-xs text-muted-foreground">Actions</p>
                    </div>
                  )}
                  
                  {getExecutionStatusBadge(execution.status)}
                  
                  {execution.status === 'running' && (
                    <Button variant="ghost" size="sm">
                      <Square className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}