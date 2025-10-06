import React, { useState } from 'react';
import { FileText, Search, Filter, Download, User, Activity, Shield, Database } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  category: 'authentication' | 'configuration' | 'data_access' | 'user_management' | 'system';
  resource: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
}

const mockLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-15 14:30:22',
    user: 'admin@sentinel.ai',
    action: 'User Login',
    category: 'authentication',
    resource: 'Authentication System',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Successful login from trusted IP'
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-15 14:25:15',
    user: 'analyst@sentinel.ai',
    action: 'View Alert Details',
    category: 'data_access',
    resource: 'Alert ALR-001',
    ip: '192.168.1.105',
    status: 'success',
    details: 'Accessed critical alert details'
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-15 14:20:00',
    user: 'admin@sentinel.ai',
    action: 'Update Firewall Rule',
    category: 'configuration',
    resource: 'Firewall Configuration',
    ip: '192.168.1.100',
    status: 'success',
    details: 'Modified rule FW-RULE-001'
  },
  {
    id: 'LOG-004',
    timestamp: '2024-01-15 14:15:30',
    user: 'unknown',
    action: 'Failed Login Attempt',
    category: 'authentication',
    resource: 'Authentication System',
    ip: '203.0.113.45',
    status: 'failed',
    details: 'Invalid credentials provided'
  },
  {
    id: 'LOG-005',
    timestamp: '2024-01-15 14:10:00',
    user: 'admin@sentinel.ai',
    action: 'Create User',
    category: 'user_management',
    resource: 'User USR-005',
    ip: '192.168.1.100',
    status: 'success',
    details: 'New user analyst2@sentinel.ai created'
  }
];

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Shield className="h-4 w-4" />;
      case 'configuration': return <Activity className="h-4 w-4" />;
      case 'data_access': return <Database className="h-4 w-4" />;
      case 'user_management': return <User className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      success: 'default',
      failed: 'destructive',
      warning: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.resource.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const stats = {
    total: mockLogs.length,
    success: mockLogs.filter(l => l.status === 'success').length,
    failed: mockLogs.filter(l => l.status === 'failed').length,
    today: mockLogs.filter(l => l.timestamp.startsWith('2024-01-15')).length,
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">Security and compliance audit trail</p>
        </div>
        <Button className="gap-2">
          <Download className="h-4 w-4" />
          Export Logs
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
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Logs</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.success}</p>
                <p className="text-sm text-muted-foreground">Successful</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.failed}</p>
                <p className="text-sm text-muted-foreground">Failed</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.today}</p>
                <p className="text-sm text-muted-foreground">Today</p>
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
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="authentication">Authentication</SelectItem>
            <SelectItem value="configuration">Configuration</SelectItem>
            <SelectItem value="data_access">Data Access</SelectItem>
            <SelectItem value="user_management">User Management</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Logs List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Audit Trail ({filteredLogs.length} entries)</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getCategoryIcon(log.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-foreground">{log.action}</h3>
                      <Badge variant="outline" className="text-xs">{log.category.replace('_', ' ')}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>User: {log.user}</span>
                      <span>Resource: {log.resource}</span>
                      <span>IP: {log.ip}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(log.status)}
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
