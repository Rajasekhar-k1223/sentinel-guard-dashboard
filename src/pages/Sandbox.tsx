import React, { useState } from 'react';
import { Package, Upload, Eye, Download, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface SandboxAnalysis {
  id: string;
  filename: string;
  fileHash: string;
  status: 'queued' | 'analyzing' | 'completed' | 'failed';
  verdict: 'malicious' | 'suspicious' | 'clean' | 'unknown';
  submittedAt: string;
  completedAt?: string;
  score: number;
  detections: number;
  size: string;
}

const mockAnalyses: SandboxAnalysis[] = [
  {
    id: 'SB-001',
    filename: 'suspicious_document.pdf',
    fileHash: 'a1b2c3d4e5f6...',
    status: 'completed',
    verdict: 'malicious',
    submittedAt: '2024-01-15 14:30:00',
    completedAt: '2024-01-15 14:35:22',
    score: 95,
    detections: 8,
    size: '2.4 MB'
  },
  {
    id: 'SB-002',
    filename: 'update_installer.exe',
    fileHash: 'f6e5d4c3b2a1...',
    status: 'completed',
    verdict: 'suspicious',
    submittedAt: '2024-01-15 14:25:00',
    completedAt: '2024-01-15 14:30:15',
    score: 65,
    detections: 3,
    size: '15.7 MB'
  },
  {
    id: 'SB-003',
    filename: 'presentation.pptx',
    fileHash: 'b2a1c3f6e5d4...',
    status: 'analyzing',
    verdict: 'unknown',
    submittedAt: '2024-01-15 14:32:00',
    score: 0,
    detections: 0,
    size: '8.9 MB'
  },
  {
    id: 'SB-004',
    filename: 'report.docx',
    fileHash: 'c3d4e5f6a1b2...',
    status: 'completed',
    verdict: 'clean',
    submittedAt: '2024-01-15 14:20:00',
    completedAt: '2024-01-15 14:25:10',
    score: 15,
    detections: 0,
    size: '1.2 MB'
  }
];

export default function Sandbox() {
  const [dragOver, setDragOver] = useState(false);

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'malicious': return 'text-critical';
      case 'suspicious': return 'text-warning';
      case 'clean': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };

  const getVerdictBadge = (verdict: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      malicious: 'destructive',
      suspicious: 'secondary',
      clean: 'default',
      unknown: 'outline'
    };
    return (
      <Badge variant={variants[verdict] || 'outline'}>
        {verdict.toUpperCase()}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'analyzing':
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-critical" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sandbox Analysis</h1>
          <p className="text-muted-foreground">Dynamic malware analysis and threat detection</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-critical" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAnalyses.filter(a => a.verdict === 'malicious').length}
                </p>
                <p className="text-sm text-muted-foreground">Malicious</p>
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
                  {mockAnalyses.filter(a => a.verdict === 'suspicious').length}
                </p>
                <p className="text-sm text-muted-foreground">Suspicious</p>
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
                  {mockAnalyses.filter(a => a.verdict === 'clean').length}
                </p>
                <p className="text-sm text-muted-foreground">Clean</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{mockAnalyses.length}</p>
                <p className="text-sm text-muted-foreground">Total Analyses</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* File Upload */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Submit File for Analysis</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Drop files here or click to upload
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PE, PDF, Office documents, archives, and more
            </p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Analysis Results */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Analyses</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-4">
            {mockAnalyses.map((analysis) => (
              <div
                key={analysis.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {getStatusIcon(analysis.status)}
                  <div>
                    <h3 className="font-medium text-foreground">{analysis.filename}</h3>
                    <p className="text-sm text-muted-foreground">
                      {analysis.fileHash} • {analysis.size}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Submitted: {analysis.submittedAt}
                      {analysis.completedAt && ` • Completed: ${analysis.completedAt}`}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {analysis.status === 'analyzing' ? (
                    <div className="w-32">
                      <Progress value={65} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">Analyzing...</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-lg font-bold text-foreground">{analysis.score}/100</p>
                      <p className="text-xs text-muted-foreground">Risk Score</p>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{analysis.detections}</p>
                    <p className="text-xs text-muted-foreground">Detections</p>
                  </div>
                  
                  {getVerdictBadge(analysis.verdict)}
                  
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
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