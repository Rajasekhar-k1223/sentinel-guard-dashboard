import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function AddAgentless() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [connectionType, setConnectionType] = useState('');
  const [authMethod, setAuthMethod] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: 'Target added successfully',
      description: 'Agentless target has been configured and will be scanned shortly',
    });
    setTimeout(() => navigate('/agentless'), 1500);
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/agentless')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Agentless Target</h1>
          <p className="text-muted-foreground">Configure remote target for agentless scanning</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle>Target Information</SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hostname">Hostname</Label>
                  <Input id="hostname" placeholder="prod-server-01" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" placeholder="192.168.1.100" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="os">Operating System</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select OS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="windows">Windows</SelectItem>
                      <SelectItem value="linux">Linux</SelectItem>
                      <SelectItem value="macos">macOS</SelectItem>
                      <SelectItem value="cloud">Cloud Platform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platform">Platform/Distribution</Label>
                  <Input id="platform" placeholder="Ubuntu 22.04, Windows Server 2022, etc." />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="region">Region (Optional)</Label>
                  <Input id="region" placeholder="us-east-1" />
                </div>
              </div>
            </SecurityCardContent>
          </SecurityCard>

          {/* Connection Configuration */}
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle>Connection Configuration</SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="connection-type">Connection Type</Label>
                  <Select value={connectionType} onValueChange={setConnectionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select connection type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ssh">SSH</SelectItem>
                      <SelectItem value="winrm">WinRM</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                      <SelectItem value="cloud_api">Cloud API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {connectionType === 'ssh' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="port">SSH Port</Label>
                      <Input id="port" type="number" placeholder="22" defaultValue="22" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="root or admin" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="auth-method">Authentication Method</Label>
                      <Select value={authMethod} onValueChange={setAuthMethod}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select authentication" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="password">Password</SelectItem>
                          <SelectItem value="key">SSH Key</SelectItem>
                          <SelectItem value="pem">PEM File</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {authMethod === 'password' && (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" placeholder="Enter password" required />
                      </div>
                    )}

                    {authMethod === 'key' && (
                      <div className="space-y-2">
                        <Label htmlFor="ssh-key">SSH Private Key</Label>
                        <Textarea 
                          id="ssh-key" 
                          placeholder="-----BEGIN OPENSSH PRIVATE KEY-----&#10;...&#10;-----END OPENSSH PRIVATE KEY-----"
                          className="font-mono text-sm"
                          rows={8}
                          required
                        />
                      </div>
                    )}

                    {authMethod === 'pem' && (
                      <div className="space-y-2">
                        <Label htmlFor="pem-file">PEM File</Label>
                        <div className="flex items-center gap-2">
                          <Input 
                            id="pem-file" 
                            type="file" 
                            accept=".pem"
                            className="cursor-pointer"
                            required
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Upload your PEM key file for authentication
                        </p>
                      </div>
                    )}
                  </>
                )}

                {connectionType === 'winrm' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="port">WinRM Port</Label>
                      <Input id="port" type="number" placeholder="5985" defaultValue="5985" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" placeholder="Administrator" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="Enter password" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain (Optional)</Label>
                      <Input id="domain" placeholder="DOMAIN" />
                    </div>
                  </>
                )}

                {connectionType === 'api' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="api-endpoint">API Endpoint</Label>
                      <Input id="api-endpoint" placeholder="https://api.example.com" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" type="password" placeholder="Enter API key" required />
                    </div>
                  </>
                )}

                {connectionType === 'cloud_api' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cloud-provider">Cloud Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aws">AWS</SelectItem>
                          <SelectItem value="azure">Azure</SelectItem>
                          <SelectItem value="gcp">Google Cloud</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="access-key">Access Key ID</Label>
                      <Input id="access-key" placeholder="Enter access key" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secret-key">Secret Access Key</Label>
                      <Input id="secret-key" type="password" placeholder="Enter secret key" required />
                    </div>
                  </>
                )}

                {!connectionType && (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a connection type to configure credentials
                  </div>
                )}
              </div>
            </SecurityCardContent>
          </SecurityCard>
        </div>

        {/* Scan Configuration */}
        <SecurityCard className="mt-6">
          <SecurityCardHeader>
            <SecurityCardTitle>Scan Configuration</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="scan-frequency">Scan Frequency</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scan-type">Default Scan Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scan type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vulnerability">Vulnerability</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="configuration">Configuration</SelectItem>
                    <SelectItem value="full">Full Scan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="credential-name">Credential Name</Label>
                <Input id="credential-name" placeholder="prod-ssh-key" />
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="button" variant="outline" onClick={() => navigate('/agentless')}>
            Cancel
          </Button>
          <Button type="submit">
            Add Target
          </Button>
        </div>
      </form>
    </div>
  );
}
