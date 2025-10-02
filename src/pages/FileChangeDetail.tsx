import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Hash, User, Calendar } from "lucide-react";

export default function FileChangeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const change = {
    id: id,
    timestamp: "2024-03-15 14:23:11",
    file: "/etc/passwd",
    action: "modified",
    agent: "server-01",
    severity: "critical",
    user: "root",
    oldHash: "5d41402abc4b2a76b9719d911017c592",
    newHash: "7d793037a0760186574b0282f2f435e7",
    oldSize: "2048 bytes",
    newSize: "2156 bytes",
    oldPermissions: "644",
    newPermissions: "666",
    changes: [
      { line: 42, type: "added", content: "newuser:x:1001:1001:New User:/home/newuser:/bin/bash" },
      { line: 43, type: "modified", content: "admin:x:1000:1000:Administrator:/home/admin:/bin/bash" },
    ],
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

  const getActionColor = (action: string) => {
    const colors: Record<string, string> = {
      created: "text-green-500",
      modified: "text-yellow-500",
      deleted: "text-red-500",
    };
    return colors[action] || "text-gray-500";
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/file-integrity")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to File Integrity
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  {change.file}
                </CardTitle>
                <div className="flex items-center gap-4 mt-2">
                  {getSeverityBadge(change.severity)}
                  <Badge variant="outline" className={getActionColor(change.action)}>
                    {change.action.toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {change.timestamp}
                  </span>
                </div>
              </div>
              <Button>Create Exception</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    System Information
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Agent:</dt>
                      <dd className="font-medium">{change.agent}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">User:</dt>
                      <dd className="font-medium">{change.user}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Action:</dt>
                      <dd className="font-medium">{change.action}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    File Metadata
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Size Change:</dt>
                      <dd className="font-medium">{change.oldSize} → {change.newSize}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Permissions:</dt>
                      <dd className="font-medium">{change.oldPermissions} → {change.newPermissions}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Hash Values</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">Old:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{change.oldHash}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-sm">New:</span>
                    <code className="text-xs bg-muted px-2 py-1 rounded">{change.newHash}</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">File Changes</h3>
                <div className="bg-muted p-4 rounded-lg space-y-2 font-mono text-sm">
                  {change.changes.map((line, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded ${
                        line.type === "added"
                          ? "bg-green-500/10 text-green-500"
                          : line.type === "modified"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      <span className="text-muted-foreground">Line {line.line}: </span>
                      {line.content}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
