import React, { useState } from 'react';
import { FileText, Search, Filter, Download, Calendar, AlertTriangle } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
  details?: string;
  user?: string;
  ip?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: 'LOG-001',
    timestamp: '2024-01-15 14:35:22',
    level: 'error',
    source: 'AUTH-SERVICE',
    message: 'Failed login attempt detected',
    details: 'Invalid credentials for user admin from IP 192.168.1.100',
    user: 'admin',
    ip: '192.168.1.100'
  },
  {
    id: 'LOG-002',
    timestamp: '2024-01-15 14:34:15',
    level: 'warning',
    source: 'WEB-SERVER',
    message: 'High memory usage detected',
    details: 'Memory utilization at 89% on web-server-01'
  },
  {
    id: 'LOG-003',
    timestamp: '2024-01-15 14:33:45',
    level: 'info',
    source: 'DATABASE',
    message: 'Backup completed successfully',
    details: 'Daily backup completed in 2m 34s'
  },
  {
    id: 'LOG-004',
    timestamp: '2024-01-15 14:32:10',
    level: 'error',
    source: 'FIREWALL',
    message: 'Suspicious traffic blocked',
    details: 'Blocked 127 requests from malicious IP range',
    ip: '203.0.113.25'
  }
];

interface LogStats {
  totalLogs: number;
  errorLogs: number;
  warningLogs: number;
  infoLogs: number;
}

const logStats: LogStats = {
  totalLogs: 45672,
  errorLogs: 234,
  warningLogs: 1156,
  infoLogs: 44282
};

export default function LogAnalysis() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-critical';
      case 'warning': return 'text-warning';
      case 'info': return 'text-success';
      case 'debug': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getLevelBadge = (level: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      error: 'destructive',
      warning: 'secondary',
      info: 'default',
      debug: 'outline'
    };
    return (
      <Badge variant={variants[level] || 'outline'}>
        {level.toUpperCase()}
      </Badge>
    );
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-critical" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.details?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesSource = selectedSource === 'all' || log.source === selectedSource;
    return matchesSearch && matchesLevel && matchesSource;
  });

  const uniqueSources = Array.from(new Set(mockLogs.map(log => log.source)));

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Log Analysis</h1>
          <p className="text-muted-foreground">Centralized log collection and analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Logs
          </Button>
          <Button className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Report
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
                <p className="text-2xl font-bold text-foreground">
                  {logStats.totalLogs.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Logs</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {logStats.errorLogs.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Errors</p>
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
                <p className="text-2xl font-bold text-foreground">
                  {logStats.warningLogs.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {logStats.infoLogs.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Info</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last Hour</SelectItem>
            <SelectItem value="24h">Last 24 Hours</SelectItem>
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="error">Error</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="debug">Debug</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {uniqueSources.map(source => (
              <SelectItem key={source} value={source}>{source}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Log Entries */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Log Entries ({filteredLogs.length} results)</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-1">
                  {getLevelIcon(log.level)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {log.timestamp}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {log.source}
                    </Badge>
                    {getLevelBadge(log.level)}
                  </div>
                  <h3 className="font-medium text-foreground mb-1">{log.message}</h3>
                  {log.details && (
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                  )}
                  {(log.user || log.ip) && (
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      {log.user && <span>User: {log.user}</span>}
                      {log.ip && <span>IP: {log.ip}</span>}
                    </div>
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