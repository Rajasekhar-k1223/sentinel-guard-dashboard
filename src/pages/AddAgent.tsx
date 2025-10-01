import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, CheckCircle } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AddAgent() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedOS, setSelectedOS] = useState('');
  const [copiedKey, setCopiedKey] = useState(false);

  const deploymentKey = 'SENTINEL-DEPLOY-KEY-' + Math.random().toString(36).substring(2, 15);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(deploymentKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
    toast({
      title: 'Copied to clipboard',
      description: 'Deployment key copied successfully',
    });
  };

  const handleDeploy = () => {
    toast({
      title: 'Agent deployed successfully',
      description: 'The agent has been registered and will appear shortly',
    });
    setTimeout(() => navigate('/agents'), 1500);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/agents')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Deploy New Agent</h1>
          <p className="text-muted-foreground">Install and configure a security agent on your endpoint</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Configuration */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Agent Configuration</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hostname">Hostname</Label>
                <Input id="hostname" placeholder="server-name" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip">IP Address</Label>
                <Input id="ip" placeholder="192.168.1.100" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="os">Operating System</Label>
                <Select value={selectedOS} onValueChange={setSelectedOS}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select OS" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="windows">Windows</SelectItem>
                    <SelectItem value="linux">Linux</SelectItem>
                    <SelectItem value="macos">macOS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Agent Group</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="production">Production</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="web-servers">Web Servers</SelectItem>
                    <SelectItem value="database">Database Servers</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key">Deployment Key</Label>
                <div className="flex gap-2">
                  <Input id="key" value={deploymentKey} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="icon" onClick={handleCopyKey}>
                    {copiedKey ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Installation Instructions */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Installation Instructions</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              {selectedOS === 'windows' && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Windows Installation</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm">
                      # Download installer<br />
                      Invoke-WebRequest -Uri "https://sentinel.ai/agent/windows" -OutFile "sentinel-agent.msi"<br />
                      <br />
                      # Install agent<br />
                      msiexec /i sentinel-agent.msi DEPLOYKEY="{deploymentKey}" /quiet
                    </code>
                  </div>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Windows Installer
                  </Button>
                </div>
              )}

              {selectedOS === 'linux' && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">Linux Installation</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm">
                      # Download and install<br />
                      curl -O https://sentinel.ai/agent/linux/install.sh<br />
                      sudo bash install.sh {deploymentKey}<br />
                      <br />
                      # Start service<br />
                      sudo systemctl start sentinel-agent<br />
                      sudo systemctl enable sentinel-agent
                    </code>
                  </div>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download Linux Installer
                  </Button>
                </div>
              )}

              {selectedOS === 'macos' && (
                <div className="space-y-3">
                  <h3 className="font-medium text-foreground">macOS Installation</h3>
                  <div className="bg-muted p-4 rounded-md">
                    <code className="text-sm">
                      # Download installer<br />
                      curl -O https://sentinel.ai/agent/macos/sentinel-agent.pkg<br />
                      <br />
                      # Install agent<br />
                      sudo installer -pkg sentinel-agent.pkg -target / -env DEPLOYKEY={deploymentKey}
                    </code>
                  </div>
                  <Button className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    Download macOS Installer
                  </Button>
                </div>
              )}

              {!selectedOS && (
                <div className="text-center py-8 text-muted-foreground">
                  Select an operating system to view installation instructions
                </div>
              )}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate('/agents')}>
          Cancel
        </Button>
        <Button onClick={handleDeploy}>
          Deploy Agent
        </Button>
      </div>
    </div>
  );
}
