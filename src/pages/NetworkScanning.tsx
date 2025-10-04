import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Scan, Server, Laptop, Smartphone, Router, Shield, AlertTriangle, CheckCircle, Clock, Play, StopCircle } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface NetworkDevice {
  id: string;
  ip: string;
  hostname: string;
  mac: string;
  deviceType: 'server' | 'laptop' | 'smartphone' | 'router' | 'iot' | 'unknown';
  os: string;
  status: 'online' | 'offline' | 'vulnerable';
  openPorts: number[];
  vulnerabilities: number;
  lastSeen: string;
}

const mockDevices: NetworkDevice[] = [
  {
    id: 'DEV-001',
    ip: '192.168.1.1',
    hostname: 'gateway.local',
    mac: '00:11:22:33:44:55',
    deviceType: 'router',
    os: 'Router OS',
    status: 'online',
    openPorts: [80, 443, 22],
    vulnerabilities: 0,
    lastSeen: '2024-01-15 15:30:00'
  },
  {
    id: 'DEV-002',
    ip: '192.168.1.10',
    hostname: 'web-server-01',
    mac: '00:11:22:33:44:56',
    deviceType: 'server',
    os: 'Ubuntu 22.04',
    status: 'online',
    openPorts: [80, 443, 22, 3306],
    vulnerabilities: 2,
    lastSeen: '2024-01-15 15:29:45'
  },
  {
    id: 'DEV-003',
    ip: '192.168.1.25',
    hostname: 'laptop-admin',
    mac: '00:11:22:33:44:57',
    deviceType: 'laptop',
    os: 'Windows 11',
    status: 'online',
    openPorts: [445, 3389],
    vulnerabilities: 1,
    lastSeen: '2024-01-15 15:28:30'
  },
  {
    id: 'DEV-004',
    ip: '192.168.1.50',
    hostname: 'iphone-user1',
    mac: '00:11:22:33:44:58',
    deviceType: 'smartphone',
    os: 'iOS 17',
    status: 'online',
    openPorts: [],
    vulnerabilities: 0,
    lastSeen: '2024-01-15 15:27:15'
  },
  {
    id: 'DEV-005',
    ip: '192.168.1.100',
    hostname: 'iot-camera-01',
    mac: '00:11:22:33:44:59',
    deviceType: 'iot',
    os: 'Embedded Linux',
    status: 'vulnerable',
    openPorts: [80, 554, 8000],
    vulnerabilities: 5,
    lastSeen: '2024-01-15 15:25:00'
  },
  {
    id: 'DEV-006',
    ip: '192.168.1.75',
    hostname: 'db-server',
    mac: '00:11:22:33:44:60',
    deviceType: 'server',
    os: 'CentOS 8',
    status: 'online',
    openPorts: [22, 5432],
    vulnerabilities: 0,
    lastSeen: '2024-01-15 15:24:30'
  }
];

export default function NetworkScanning() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [ipRange, setIpRange] = useState('192.168.1.0/24');
  const [scanSource, setScanSource] = useState('public-ip');
  const [devices, setDevices] = useState<NetworkDevice[]>([]);
  const [selectedAgent, setSelectedAgent] = useState('');

  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    setDevices([]);

    // Simulate scanning progress
    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setDevices(mockDevices);
          toast({
            title: "Scan Complete",
            description: `Discovered ${mockDevices.length} devices on the network`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleStopScan = () => {
    setIsScanning(false);
    setScanProgress(0);
    toast({
      title: "Scan Stopped",
      description: "Network scanning has been stopped",
      variant: "destructive",
    });
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'server': return Server;
      case 'laptop': return Laptop;
      case 'smartphone': return Smartphone;
      case 'router': return Router;
      case 'iot': return Network;
      default: return Network;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-success';
      case 'vulnerable': return 'text-critical';
      case 'offline': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "destructive" | "secondary" | "outline" } = {
      online: 'default',
      vulnerable: 'destructive',
      offline: 'secondary'
    };
    return (
      <Badge variant={variants[status] || 'outline'}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Network Scanning</h1>
          <p className="text-muted-foreground">Discover and analyze devices on your network</p>
        </div>
        <div className="flex gap-2">
          {isScanning ? (
            <Button variant="destructive" onClick={handleStopScan} className="gap-2">
              <StopCircle className="h-4 w-4" />
              Stop Scan
            </Button>
          ) : (
            <Button onClick={handleScan} className="gap-2">
              <Play className="h-4 w-4" />
              Start Scan
            </Button>
          )}
        </div>
      </div>

      {/* Scan Configuration */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Scan Configuration</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Scan Source</Label>
              <Select value={scanSource} onValueChange={setScanSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public-ip">Public IP Address</SelectItem>
                  <SelectItem value="agent">Agent Server</SelectItem>
                  <SelectItem value="local">Local Network</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {scanSource === 'agent' && (
              <div className="space-y-2">
                <Label>Select Agent</Label>
                <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose an agent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent-1">Web Server 01</SelectItem>
                    <SelectItem value="agent-2">Database Server</SelectItem>
                    <SelectItem value="agent-3">App Server</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label>IP Range / CIDR</Label>
              <Input
                value={ipRange}
                onChange={(e) => setIpRange(e.target.value)}
                placeholder="192.168.1.0/24"
              />
            </div>
          </div>

          {isScanning && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Scanning network...</span>
                <span className="font-medium">{scanProgress}%</span>
              </div>
              <Progress value={scanProgress} className="h-2" />
            </div>
          )}
        </SecurityCardContent>
      </SecurityCard>

      {/* Statistics */}
      {devices.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <SecurityCard>
            <SecurityCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Network className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{devices.length}</p>
                  <p className="text-sm text-muted-foreground">Total Devices</p>
                </div>
              </div>
            </SecurityCardContent>
          </SecurityCard>

          <SecurityCard>
            <SecurityCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {devices.filter(d => d.status === 'online').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </SecurityCardContent>
          </SecurityCard>

          <SecurityCard>
            <SecurityCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-critical/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-critical" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {devices.filter(d => d.status === 'vulnerable').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Vulnerable</p>
                </div>
              </div>
            </SecurityCardContent>
          </SecurityCard>

          <SecurityCard>
            <SecurityCardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">
                    {devices.reduce((sum, d) => sum + d.vulnerabilities, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Vulnerabilities</p>
                </div>
              </div>
            </SecurityCardContent>
          </SecurityCard>
        </div>
      )}

      {/* Network Topology Grid */}
      {devices.length > 0 && (
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Discovered Devices</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent className="p-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {devices.map((device) => {
                const DeviceIcon = getDeviceIcon(device.deviceType);
                return (
                  <div
                    key={device.id}
                    className="border border-border/50 rounded-lg p-4 hover:bg-accent/50 transition-all cursor-pointer"
                    onClick={() => navigate(`/network-scanning/${device.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          device.status === 'vulnerable' ? 'bg-critical/10' :
                          device.status === 'online' ? 'bg-success/10' : 'bg-muted'
                        }`}>
                          <DeviceIcon className={`h-6 w-6 ${getStatusColor(device.status)}`} />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">{device.hostname}</h3>
                          <p className="text-sm text-muted-foreground">{device.ip}</p>
                        </div>
                      </div>
                      {getStatusBadge(device.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">OS:</span>
                        <span className="text-foreground font-medium">{device.os}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">MAC:</span>
                        <span className="text-foreground font-mono text-xs">{device.mac}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Open Ports:</span>
                        <span className="text-foreground font-medium">{device.openPorts.length}</span>
                      </div>
                      {device.vulnerabilities > 0 && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Vulnerabilities:</span>
                          <Badge variant="destructive">{device.vulnerabilities}</Badge>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Last seen: {device.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      )}

      {/* Empty State */}
      {devices.length === 0 && !isScanning && (
        <SecurityCard>
          <SecurityCardContent className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Scan className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Devices Scanned</h3>
                <p className="text-muted-foreground mb-4">
                  Configure your scan parameters and click "Start Scan" to discover devices on your network
                </p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      )}
    </div>
  );
}
