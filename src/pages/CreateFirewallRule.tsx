import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CreateFirewallRule() {
  const navigate = useNavigate();
  const [ruleName, setRuleName] = useState("");
  const [sourceIP, setSourceIP] = useState("");
  const [destIP, setDestIP] = useState("");
  const [sourcePort, setSourcePort] = useState("");
  const [destPort, setDestPort] = useState("");
  const [protocol, setProtocol] = useState("");
  const [action, setAction] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Firewall Rule Created",
      description: `Rule "${ruleName}" has been created successfully.`,
    });
    navigate("/network-security");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/network-security")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Network Security
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create Firewall Rule</CardTitle>
            <CardDescription>
              Define network access control rules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="ruleName">Rule Name</Label>
                <Input
                  id="ruleName"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  placeholder="e.g., Block Suspicious IP"
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourceIP">Source IP Address</Label>
                  <Input
                    id="sourceIP"
                    value={sourceIP}
                    onChange={(e) => setSourceIP(e.target.value)}
                    placeholder="e.g., 192.168.1.0/24 or any"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destIP">Destination IP Address</Label>
                  <Input
                    id="destIP"
                    value={destIP}
                    onChange={(e) => setDestIP(e.target.value)}
                    placeholder="e.g., 10.0.0.5 or any"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sourcePort">Source Port</Label>
                  <Input
                    id="sourcePort"
                    value={sourcePort}
                    onChange={(e) => setSourcePort(e.target.value)}
                    placeholder="e.g., 80, 443, or any"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destPort">Destination Port</Label>
                  <Input
                    id="destPort"
                    value={destPort}
                    onChange={(e) => setDestPort(e.target.value)}
                    placeholder="e.g., 22, 3306, or any"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="protocol">Protocol</Label>
                <Select value={protocol} onValueChange={setProtocol} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select protocol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="tcp">TCP</SelectItem>
                    <SelectItem value="udp">UDP</SelectItem>
                    <SelectItem value="icmp">ICMP</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action</Label>
                <Select value={action} onValueChange={setAction} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="allow">Allow</SelectItem>
                    <SelectItem value="block">Block</SelectItem>
                    <SelectItem value="drop">Drop (Silent)</SelectItem>
                    <SelectItem value="log">Log Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Rule Summary</h4>
                <p className="text-sm">
                  <strong>{action || "ACTION"}</strong> traffic from{" "}
                  <strong>{sourceIP || "SOURCE_IP"}</strong>:{sourcePort || "PORT"} to{" "}
                  <strong>{destIP || "DEST_IP"}</strong>:{destPort || "PORT"} via{" "}
                  <strong>{protocol || "PROTOCOL"}</strong>
                </p>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Rule
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/network-security")}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
