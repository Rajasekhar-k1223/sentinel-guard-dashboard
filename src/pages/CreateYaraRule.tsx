import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CreateYaraRule() {
  const navigate = useNavigate();
  const [ruleName, setRuleName] = useState("");
  const [description, setDescription] = useState("");
  const [strings, setStrings] = useState("");
  const [condition, setCondition] = useState("");
  const [metadata, setMetadata] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "YARA Rule Created",
      description: `Rule "${ruleName}" has been created successfully.`,
    });
    navigate("/yara-analysis");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/yara-analysis")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to YARA Analysis
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create YARA Rule</CardTitle>
            <CardDescription>
              Define custom malware detection signatures
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
                  placeholder="e.g., Ransomware_Detection"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this rule detects..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="metadata">Metadata (Optional)</Label>
                <Textarea
                  id="metadata"
                  value={metadata}
                  onChange={(e) => setMetadata(e.target.value)}
                  placeholder={`author = "Security Team"\ndate = "2024-03-15"\nseverity = "high"`}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="strings">String Patterns</Label>
                <Textarea
                  id="strings"
                  value={strings}
                  onChange={(e) => setStrings(e.target.value)}
                  placeholder={`$str1 = "malicious_string"\n$hex1 = { 6A 40 68 00 30 00 00 }\n$re1 = /md5: [0-9a-zA-Z]{32}/`}
                  rows={6}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Define strings, hex patterns, or regex patterns
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <Textarea
                  id="condition"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  placeholder="any of them"
                  rows={3}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  e.g., "all of them" or "$str1 and $hex1"
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Rule Preview</h4>
                <pre className="text-sm">
{`rule ${ruleName || "RuleName"} {
  meta:
    ${metadata || "description = \"Rule description\""}
  
  strings:
    ${strings || "$str1 = \"pattern\""}
  
  condition:
    ${condition || "any of them"}
}`}
                </pre>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Rule
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/yara-analysis")}
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
