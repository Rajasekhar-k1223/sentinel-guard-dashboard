import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle2, FileText, Network, HardDrive } from "lucide-react";

export default function SandboxDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const analysis = {
    id: id,
    filename: "ransomware.exe",
    submittedAt: "2024-03-15 14:25:30",
    completedAt: "2024-03-15 14:30:45",
    fileSize: "2.4 MB",
    fileType: "PE32 executable",
    md5: "d41d8cd98f00b204e9800998ecf8427e",
    sha256: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    verdict: "malicious",
    score: 95,
    behaviors: [
      { type: "File System", action: "Created", details: "C:\\Users\\Public\\ransom_note.txt", severity: "high" },
      { type: "File System", action: "Encrypted", details: "20 files in Documents folder", severity: "critical" },
      { type: "Registry", action: "Modified", details: "HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Run", severity: "high" },
      { type: "Network", action: "Connected", details: "185.220.101.45:443 (TOR exit node)", severity: "critical" },
      { type: "Process", action: "Created", details: "cmd.exe /c vssadmin delete shadows /all", severity: "critical" },
    ],
    networkActivity: {
      connections: 5,
      domains: ["malicious-c2.onion", "185.220.101.45"],
      protocols: ["HTTPS", "TOR"],
    },
    detections: [
      { engine: "VirusTotal", result: "42/70 detections" },
      { engine: "YARA", result: "Ransomware_Pattern" },
      { engine: "Behavioral", result: "Encryption Activity" },
    ],
  };

  const getVerdictBadge = (verdict: string) => {
    const variants: Record<string, { variant: "destructive" | "default" | "secondary"; icon: any }> = {
      malicious: { variant: "destructive", icon: AlertTriangle },
      suspicious: { variant: "default", icon: AlertTriangle },
      clean: { variant: "secondary", icon: CheckCircle2 },
    };
    const config = variants[verdict];
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="text-sm">
        <Icon className="mr-1 h-3 w-3" />
        {verdict.toUpperCase()}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      critical: "destructive",
      high: "destructive",
      medium: "default",
      low: "secondary",
    };
    return <Badge variant={variants[severity]}>{severity}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/sandbox")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Sandbox
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    {analysis.filename}
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {getVerdictBadge(analysis.verdict)}
                    <span className="text-sm text-muted-foreground">
                      Risk Score: {analysis.score}/100
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Analysis Time: 5m 15s
                    </span>
                  </div>
                </div>
                <Button variant="destructive">Quarantine</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">File Type</p>
                  <p className="font-medium">{analysis.fileType}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p className="font-medium">{analysis.fileSize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="font-medium text-sm">{analysis.submittedAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="font-medium text-sm">{analysis.completedAt}</p>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">MD5</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{analysis.md5}</code>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">SHA256</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{analysis.sha256}</code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Behavioral Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.behaviors.map((behavior, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{behavior.type}</Badge>
                        <span className="font-medium">{behavior.action}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {behavior.details}
                      </p>
                    </div>
                    {getSeverityBadge(behavior.severity)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Network Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-muted-foreground">Connections</dt>
                    <dd className="font-medium">{analysis.networkActivity.connections}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Contacted Domains</dt>
                    <dd className="space-y-1">
                      {analysis.networkActivity.domains.map((domain, i) => (
                        <div key={i} className="font-medium text-sm font-mono bg-muted px-2 py-1 rounded">
                          {domain}
                        </div>
                      ))}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Protocols</dt>
                    <dd className="flex gap-2">
                      {analysis.networkActivity.protocols.map((protocol, i) => (
                        <Badge key={i} variant="outline">{protocol}</Badge>
                      ))}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Detection Engines
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analysis.detections.map((detection, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-medium">{detection.engine}</span>
                      <Badge variant="destructive">{detection.result}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
