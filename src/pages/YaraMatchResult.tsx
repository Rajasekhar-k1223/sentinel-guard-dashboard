import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function YaraMatchResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const result = {
    id: id,
    filename: "suspicious_file.exe",
    scanDate: "2024-03-15 14:30:00",
    fileSize: "2.4 MB",
    fileHash: "d41d8cd98f00b204e9800998ecf8427e",
    verdict: "malicious",
    matchedRules: [
      {
        name: "Ransomware_Detection",
        severity: "critical",
        description: "Detected ransomware patterns in file",
        matches: [
          { string: "$encrypt_func", offset: "0x1234", data: "CryptEncrypt" },
          { string: "$ransom_note", offset: "0x5678", data: "Your files have been encrypted" },
        ],
      },
      {
        name: "Network_Communication",
        severity: "high",
        description: "Suspicious network communication patterns",
        matches: [
          { string: "$c2_server", offset: "0x9abc", data: "malicious-c2.com" },
        ],
      },
    ],
    metadata: {
      author: "Security Team",
      date: "2024-03-15",
      version: "1.0",
    },
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
    return <Badge variant={variants[severity]}>{severity.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/yara-analysis")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to YARA Analysis
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{result.filename}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {getVerdictBadge(result.verdict)}
                    <span className="text-sm text-muted-foreground">
                      Scanned: {result.scanDate}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Quarantine</Button>
                  <Button variant="destructive">Delete</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">File Size</p>
                  <p className="font-medium">{result.fileSize}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">MD5 Hash</p>
                  <p className="font-medium font-mono text-xs">{result.fileHash}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Rules Matched</p>
                  <p className="font-medium">{result.matchedRules.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {result.matchedRules.map((rule, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  {getSeverityBadge(rule.severity)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">Matched Strings</h4>
                  {rule.matches.map((match, matchIndex) => (
                    <div
                      key={matchIndex}
                      className="bg-muted p-4 rounded-lg space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <code className="text-sm font-mono">{match.string}</code>
                        <span className="text-xs text-muted-foreground">
                          Offset: {match.offset}
                        </span>
                      </div>
                      <div className="bg-background p-2 rounded border">
                        <code className="text-xs text-destructive">{match.data}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardHeader>
              <CardTitle>Rule Metadata</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Author:</dt>
                  <dd className="font-medium">{result.metadata.author}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Date:</dt>
                  <dd className="font-medium">{result.metadata.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Version:</dt>
                  <dd className="font-medium">{result.metadata.version}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
