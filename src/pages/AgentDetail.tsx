import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { ArrowLeft, Monitor, Activity, AlertTriangle, CheckCircle, XCircle, Download, Trash2, HardDrive, Network } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AgentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [agent, setAgent] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [cpu, setCpu] = useState<any[]>([]);
  const [memory, setMemory] = useState<any[]>([]);
  const [uptime, setUptime] = useState<any[]>([]);
  const [cpuData, setCpuData] = useState<any[]>([]);
  const [memoryData, setMemoryData] = useState<any[]>([]);
  const [diskData, setDiskData] = useState<any[]>([]);
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);

  const API_BASE = 'http://localhost:8000/api'; // Replace with your backend
  const WS_BASE = 'ws://localhost:8000/ws/stream'; // WebSocket endpoint for metrics

  useEffect(() => {
    // Fetch agent details and events once
    const fetchAgent = async () => {
      try {
        setLoading(true);
        const agentRes = await axios.get(`${API_BASE}/agents/${id}`);
        
        setAgent(agentRes.data);

        const eventsRes = await axios.get(`${API_BASE}/agents/${id}/events`);
        setEvents(eventsRes.data);

      } catch (err) {
        console.error('Error fetching agent data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgent();
  }, [id]);

  useEffect(() => {
    // Open WebSocket for real-time metrics
    wsRef.current = new WebSocket(`${WS_BASE}/${id}`);

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket data:', data);
        // Expecting format: { cpu: [...], memory: [...], disk: [...], network: [...] }
        if (data.type === "history" && Array.isArray(data.data)) {
          // ✅ Sort by timestamp safely
          const historyData = data.data.sort((a: any, b: any) => {
            const at = new Date(a.timestamp).getTime();
            const bt = new Date(b.timestamp).getTime();
            return at - bt;
          });

          // ✅ Initialize arrays for graph data
          const cpuPoints: { time: string; value: number }[] = [];
          const memPoints: { time: string; value: number }[] = [];
          const diskPoints: { time: string; value: number }[] = [];
          const networkPoints: { time: string; value: number }[] = [];

          historyData.forEach((entry: any) => {
            const time = new Date(entry.timestamp).toLocaleTimeString();

            // Safely ensure numbers using Number()
            const cpu = Number(entry.cpu_percent) || 0;
            const mem = Number(entry.mem_percent) || 0;
            const disk = Number(entry.disk_percent) || 0;
            const network = Number(entry.network_percent) || 0;

            cpuPoints.push({ time, value: cpu });
            memPoints.push({ time, value: mem });
            diskPoints.push({ time, value: disk });
            networkPoints.push({ time, value: network });

            // if (entry.network) {
            //   const networkValue =
            //     Number(entry.network.throughput) ||
            //     Number(entry.network.rx_bytes) ||
            //     0;
            //   networkPoints.push({ time, value: networkValue });
            // }
          });

          setCpuData(cpuPoints.slice(-20));
          setMemoryData(memPoints.slice(-20));
          setDiskData(diskPoints.slice(-20));
          console.log(networkPoints.slice(-20))
          setNetworkData(networkPoints.slice(-20));
        }else if(data.type === "update" && data.agent) {
        const now = new Date().toLocaleTimeString();
        setCpu(data.agent.cpu_percent);
        setMemory(data.agent.mem_percent);
        setUptime(data.agent.uptime);
         if (data.agent.cpu_percent !== undefined) {
          setCpuData((prev) => [
            ...prev.slice(-19),
            { time: now, value: data.agent.cpu_percent },
          ]);
        }

        // ✅ Memory Graph
        if (data.agent.mem_percent !== undefined) {
          setMemoryData((prev) => [
            ...prev.slice(-19),
            { time: now, value: data.agent.mem_percent },
          ]);
        }

        // ✅ Disk Graph
        if (data.agent.disk_percent !== undefined) {
          setDiskData((prev) => [
            ...prev.slice(-19),
            { time: now, value: data.agent.disk_percent },
          ]);
        }
        console.log('Network data update:', data.agent.network_percent);
        // ✅ Network Graph (could be in Mbps or KB/s)
        if (data.agent.network_percent !== undefined) {
          console.log('Updating network data with:', data.agent.network_percent);
          setNetworkData((prev) => [
            ...prev.slice(-19),
            // {
            //   time: now,
            //   value: data.agent.network.throughput || data.agent.network.rx_bytes,
            // },
             { time: now, value: data.agent.network_percent },
          ]);
        }
      }
      } catch (err) {
        console.error('Error parsing WebSocket data:', err);
      }
    };

    wsRef.current.onclose = () => console.log('WebSocket closed');

    return () => {
      wsRef.current?.close();
    };
  }, [id]);

  const getStatusBadge = () => {
    if (!agent) return null;
    const variants: { [key: string]: "destructive" | "default" | "secondary" } = {
      online: 'default',
      warning: 'secondary',
      offline: 'destructive'
    };
    return <Badge variant={variants[agent.status] || 'secondary'}>{agent.status.toUpperCase()}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" } = {
      high: 'destructive',
      medium: 'secondary',
      low: 'default'
    };
    return <Badge variant={variants[severity] || 'default'}>{severity.toUpperCase()}</Badge>;
  };

  if (loading || !agent) {
    return <div className="p-6 text-center">Loading agent data...</div>;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/agents')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{agent.hostname}</h1>
            <p className="text-muted-foreground">{agent.os} • {agent.ip_address}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
          <Button variant="destructive" size="sm">
            <Trash2 className="h-4 w-4 mr-2" />
            Remove Agent
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{agent.events_count}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
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
                <p className="text-2xl font-bold text-foreground">{uptime}</p>
                <p className="text-sm text-muted-foreground">Uptime</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{cpu}%</p>
                <p className="text-sm text-muted-foreground">CPU Usage</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{memory}%</p>
                <p className="text-sm text-muted-foreground">Memory Usage</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Agent Info & Policies */}
      <div className="grid gap-6 md:grid-cols-2">
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Agent Information</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Agent ID:</span>
                <span className="font-medium text-foreground">{agent.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Version:</span>
                <span className="font-medium text-foreground">v{agent.os_version}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Last Seen:</span>
                <span className="font-medium text-foreground">{agent.last_seen}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Disk Usage:</span>
                <span className="font-medium text-foreground">{agent.disk_percent}%</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/50">
                <span className="text-muted-foreground">Installed:</span>
                                <span className="font-medium text-foreground">{agent.installed_at}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Groups:</span>
                <div className="flex gap-2">
                  {/* {agent.agents.map((group: string) => (
                    <Badge key={group} variant="outline">{group}</Badge>
                  ))} */}
                </div>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        {/* Policies */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle>Applied Policies</SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <div className="space-y-3">
              {/* {agent.policies.map((policy: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-border/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="font-medium text-foreground">{policy}</span>
                  </div>
                  <Badge variant="default">Active</Badge>
                </div>
              ))} */}
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      {/* Performance Metrics Graphs */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* CPU */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              CPU Usage (60 mins)
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={cpuData}>
                <defs>
                  <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => [`${value}%`, 'CPU']}
                />
                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#cpuGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </SecurityCardContent>
        </SecurityCard>

        {/* Memory */}
       <SecurityCard>
  <SecurityCardHeader>
    <SecurityCardTitle className="flex items-center gap-2">
      <Monitor className="h-5 w-5 text-cyan-400 dark:text-cyan-300" />
      Memory Usage (60 mins)
    </SecurityCardTitle>
  </SecurityCardHeader>
  <SecurityCardContent>
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={memoryData}>
        <defs>
          <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
            {/* Brighter gradient for dark mode visibility */}
            <stop offset="5%" stopColor="rgba(6, 182, 212, 0.7)" />   {/* cyan-500 */}
            <stop offset="95%" stopColor="rgba(6, 182, 212, 0)" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value: number) => [`${value}%`, 'Memory']}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="rgba(6, 182, 212, 0.9)" // brighter cyan line
          strokeWidth={2}
          fill="url(#memoryGradient)"
          dot={{ r: 2, fill: 'rgba(6, 182, 212, 1)' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </SecurityCardContent>
</SecurityCard>

        {/* Disk */}
        <SecurityCard>
          <SecurityCardHeader>
            <SecurityCardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-warning" />
              Disk Usage (60 mins)
            </SecurityCardTitle>
          </SecurityCardHeader>
          <SecurityCardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={diskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `${v}%`} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Disk']}
                />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ fill: 'hsl(var(--warning))' }} />
              </LineChart>
            </ResponsiveContainer>
          </SecurityCardContent>
        </SecurityCard>

        {/* Network */}
         <SecurityCard>
      <SecurityCardHeader>
        <SecurityCardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5 text-success" />
          Network Usage (60 mins)
        </SecurityCardTitle>
      </SecurityCardHeader>
      <SecurityCardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={networkData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))",
              }}
              formatter={(value: number) => [`${value.toFixed(2)}%`, "Network"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              dot={{ fill: "hsl(var(--success))" }}
              name="Network %"
            />
          </LineChart>
        </ResponsiveContainer>
      </SecurityCardContent>
    </SecurityCard>
      </div>

      {/* Recent Events */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Recent Events</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {event.severity === 'high' && <XCircle className="h-5 w-5 text-critical" />}
                  {event.severity === 'medium' && <AlertTriangle className="h-5 w-5 text-warning" />}
                  {event.severity === 'low' && <CheckCircle className="h-5 w-5 text-success" />}
                  <div>
                    <p className="font-medium text-foreground">{event.message}</p>
                    <p className="text-sm text-muted-foreground">{event.time} • {event.type}</p>
                  </div>
                </div>
                {getSeverityBadge(event.severity)}
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}

