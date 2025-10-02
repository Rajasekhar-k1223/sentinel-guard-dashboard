import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function CreateBaseline() {
  const navigate = useNavigate();
  const [baselineName, setBaselineName] = useState("");
  const [description, setDescription] = useState("");
  const [paths, setPaths] = useState("");
  const [options, setOptions] = useState({
    checksum: true,
    permissions: true,
    ownership: true,
    size: true,
    timestamp: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Baseline Created",
      description: `Baseline "${baselineName}" has been created successfully.`,
    });
    navigate("/file-integrity");
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
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
            <CardTitle>Create File Integrity Baseline</CardTitle>
            <CardDescription>
              Define a baseline for monitoring file changes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="baselineName">Baseline Name</Label>
                <Input
                  id="baselineName"
                  value={baselineName}
                  onChange={(e) => setBaselineName(e.target.value)}
                  placeholder="e.g., System Files Baseline"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what this baseline monitors..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paths">Monitored Paths</Label>
                <Textarea
                  id="paths"
                  value={paths}
                  onChange={(e) => setPaths(e.target.value)}
                  placeholder="/etc/passwd&#10;/etc/shadow&#10;/var/www/html&#10;/usr/bin"
                  rows={6}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Enter one path per line
                </p>
              </div>

              <div className="space-y-4">
                <Label>Monitor Options</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="checksum"
                      checked={options.checksum}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, checksum: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="checksum"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      File Checksum (MD5/SHA256)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="permissions"
                      checked={options.permissions}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, permissions: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="permissions"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      File Permissions
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="ownership"
                      checked={options.ownership}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, ownership: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="ownership"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      File Ownership
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="size"
                      checked={options.size}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, size: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="size"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      File Size
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="timestamp"
                      checked={options.timestamp}
                      onCheckedChange={(checked) =>
                        setOptions({ ...options, timestamp: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="timestamp"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Modification Timestamp
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="flex-1">
                  Create Baseline
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/file-integrity")}
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
