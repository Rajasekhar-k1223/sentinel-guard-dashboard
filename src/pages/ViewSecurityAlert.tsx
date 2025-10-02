import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, Clock, MapPin, Shield } from "lucide-react";

export default function ViewSecurityAlert() {
  const { id } = useParams();
  const navigate = useNavigate();

  const alert = {
    id: id,
    title: "Multiple Failed Login Attempts Detected",
    severity: "critical",
    status: "investigating",
    timestamp: "2024-03-15 14:32:00",
    source: "Authentication System",
    category: "Authentication",
    description: "Multiple failed login attempts detected from IP address 192.168.1.100. Possible brute force attack in progress.",
    details: {
      ipAddress: "192.168.1.100",
      username: "admin",
      attempts: 15,
      location: "Unknown",
      protocol: "SSH",
      port: 22,
    },
    timeline: [
      { time: "14:32:00", event: "Alert triggered", user: "System" },
      { time: "14:33:15", event: "Assigned to security team", user: "Admin" },
      { time: "14:35:00", event: "Investigation started", user: "Security Team" },
    ],
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary" | "outline"> = {
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
          onClick={() => navigate("/alerts-siem")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Alerts
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{alert.title}</CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {getSeverityBadge(alert.severity)}
                    <Badge variant="outline">{alert.status}</Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Acknowledge</Button>
                  <Button>Resolve</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground">{alert.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Alert Details
                    </h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Source:</dt>
                        <dd className="font-medium">{alert.source}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Category:</dt>
                        <dd className="font-medium">{alert.category}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Alert ID:</dt>
                        <dd className="font-medium font-mono text-sm">#{alert.id}</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Threat Details
                    </h3>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">IP Address:</dt>
                        <dd className="font-medium font-mono text-sm">{alert.details.ipAddress}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Username:</dt>
                        <dd className="font-medium">{alert.details.username}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Failed Attempts:</dt>
                        <dd className="font-medium">{alert.details.attempts}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Protocol:</dt>
                        <dd className="font-medium">{alert.details.protocol}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Port:</dt>
                        <dd className="font-medium">{alert.details.port}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alert.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {index < alert.timeline.length - 1 && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.event}</p>
                          <p className="text-sm text-muted-foreground">by {item.user}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
