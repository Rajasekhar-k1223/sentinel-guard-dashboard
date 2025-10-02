import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Network, Shield, MapPin } from "lucide-react";

export default function NetworkEventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const event = {
    id: id,
    timestamp: "2024-03-15 14:28:33",
    sourceIP: "192.168.1.100",
    destIP: "10.0.0.50",
    sourcePort: 54321,
    destPort: 443,
    protocol: "HTTPS",
    action: "blocked",
    severity: "high",
    rule: "Block Suspicious Traffic",
    bytes: 1024000,
    packets: 150,
    duration: "00:00:45",
    geolocation: {
      country: "United States",
      city: "New York",
      isp: "Unknown ISP",
    },
    threatIntel: {
      reputation: "Malicious",
      category: "Command & Control",
      lastSeen: "2024-03-10",
      reports: 15,
    },
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, "destructive" | "default" | "secondary"> = {
      blocked: "destructive",
      allowed: "default",
      dropped: "secondary",
    };
    return <Badge variant={variants[action]}>{action.toUpperCase()}</Badge>;
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
          onClick={() => navigate("/network-security")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Network Security
        </Button>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Network className="h-6 w-6" />
                    Network Event Details
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    {getActionBadge(event.action)}
                    {getSeverityBadge(event.severity)}
                    <span className="text-sm text-muted-foreground">
                      {event.timestamp}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Add to Whitelist</Button>
                  <Button variant="destructive">Block Permanently</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Connection Details
                  </h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Source IP:</dt>
                      <dd className="font-medium font-mono text-sm">{event.sourceIP}:{event.sourcePort}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Destination IP:</dt>
                      <dd className="font-medium font-mono text-sm">{event.destIP}:{event.destPort}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Protocol:</dt>
                      <dd className="font-medium">{event.protocol}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Rule:</dt>
                      <dd className="font-medium">{event.rule}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Traffic Statistics</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Data Transferred:</dt>
                      <dd className="font-medium">{(event.bytes / 1024).toFixed(2)} KB</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Packets:</dt>
                      <dd className="font-medium">{event.packets}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted-foreground">Duration:</dt>
                      <dd className="font-medium">{event.duration}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Geolocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Country:</dt>
                    <dd className="font-medium">{event.geolocation.country}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">City:</dt>
                    <dd className="font-medium">{event.geolocation.city}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">ISP:</dt>
                    <dd className="font-medium">{event.geolocation.isp}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Reputation:</dt>
                    <dd>
                      <Badge variant="destructive">{event.threatIntel.reputation}</Badge>
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category:</dt>
                    <dd className="font-medium">{event.threatIntel.category}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Seen:</dt>
                    <dd className="font-medium">{event.threatIntel.lastSeen}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Threat Reports:</dt>
                    <dd className="font-medium">{event.threatIntel.reports}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
