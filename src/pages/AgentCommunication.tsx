import React, { useState } from 'react';
import { MessageCircle, Send, Radio, AlertTriangle, CheckCircle, XCircle, Monitor } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Agent {
  id: string;
  name: string;
  hostname: string;
  status: 'online' | 'offline' | 'warning';
  platform: string;
  ipAddress: string;
  lastSeen: string;
}

interface Message {
  id: string;
  agentId: string;
  agentName: string;
  type: 'command' | 'response' | 'warning' | 'alert';
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
}

const mockAgents: Agent[] = [
  {
    id: 'AGT-001',
    name: 'Web Server 01',
    hostname: 'web-srv-01',
    status: 'online',
    platform: 'Ubuntu 22.04',
    ipAddress: '192.168.1.10',
    lastSeen: '2024-01-15 14:45:00'
  },
  {
    id: 'AGT-002',
    name: 'Database Server',
    hostname: 'db-srv-01',
    status: 'online',
    platform: 'CentOS 8',
    ipAddress: '192.168.1.20',
    lastSeen: '2024-01-15 14:44:55'
  },
  {
    id: 'AGT-003',
    name: 'File Server',
    hostname: 'file-srv-01',
    status: 'warning',
    platform: 'Windows Server 2022',
    ipAddress: '192.168.1.30',
    lastSeen: '2024-01-15 14:30:22'
  },
  {
    id: 'AGT-004',
    name: 'Backup Server',
    hostname: 'backup-srv-01',
    status: 'offline',
    platform: 'Ubuntu 20.04',
    ipAddress: '192.168.1.40',
    lastSeen: '2024-01-15 13:15:00'
  }
];

const mockMessages: Message[] = [
  {
    id: 'MSG-001',
    agentId: 'AGT-001',
    agentName: 'Web Server 01',
    type: 'response',
    content: 'System scan completed. No threats detected.',
    timestamp: '2024-01-15 14:40:00',
    status: 'read'
  },
  {
    id: 'MSG-002',
    agentId: 'AGT-002',
    agentName: 'Database Server',
    type: 'alert',
    content: 'High CPU usage detected: 89%',
    timestamp: '2024-01-15 14:35:00',
    status: 'delivered'
  },
  {
    id: 'MSG-003',
    agentId: 'AGT-003',
    agentName: 'File Server',
    type: 'warning',
    content: 'Warning: Disk space below 20%',
    timestamp: '2024-01-15 14:30:00',
    status: 'read'
  }
];

export default function AgentCommunication() {
  const { toast } = useToast();
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [messageType, setMessageType] = useState<'command' | 'warning' | 'alert'>('command');
  const [messageContent, setMessageContent] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  const getStatusBadge = (status: string) => {
    const config = {
      online: { variant: 'default' as const, color: 'text-success', icon: CheckCircle },
      offline: { variant: 'secondary' as const, color: 'text-muted-foreground', icon: XCircle },
      warning: { variant: 'destructive' as const, color: 'text-warning', icon: AlertTriangle }
    };
    const { variant, color, icon: Icon } = config[status as keyof typeof config];
    
    return (
      <Badge variant={variant} className="gap-1">
        <Icon className={`h-3 w-3 ${color}`} />
        {status.toUpperCase()}
      </Badge>
    );
  };

  const getMessageTypeBadge = (type: string) => {
    const variants: { [key: string]: "destructive" | "default" | "secondary" | "outline" } = {
      command: 'default',
      response: 'outline',
      warning: 'secondary',
      alert: 'destructive'
    };
    return (
      <Badge variant={variants[type] || 'outline'}>
        {type.toUpperCase()}
      </Badge>
    );
  };

  const handleSendMessage = () => {
    if (!messageContent.trim() || selectedAgent === 'all') {
      toast({
        title: "Error",
        description: "Please select an agent and enter a message",
        variant: "destructive"
      });
      return;
    }

    const agent = mockAgents.find(a => a.id === selectedAgent);
    if (!agent) return;

    const newMessage: Message = {
      id: `MSG-${Date.now()}`,
      agentId: selectedAgent,
      agentName: agent.name,
      type: messageType,
      content: messageContent,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'sent'
    };

    setMessages(prev => [newMessage, ...prev]);
    setMessageContent('');

    toast({
      title: "Message Sent",
      description: `${messageType} sent to ${agent.name}`,
    });
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a broadcast message",
        variant: "destructive"
      });
      return;
    }

    const onlineAgents = mockAgents.filter(a => a.status === 'online');
    const newMessages = onlineAgents.map(agent => ({
      id: `MSG-${Date.now()}-${agent.id}`,
      agentId: agent.id,
      agentName: agent.name,
      type: 'warning' as const,
      content: broadcastMessage,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'sent' as const
    }));

    setMessages(prev => [...newMessages, ...prev]);
    setBroadcastMessage('');

    toast({
      title: "Broadcast Sent",
      description: `Warning sent to ${onlineAgents.length} online agents`,
    });
  };

  const filteredMessages = selectedAgent === 'all' 
    ? messages 
    : messages.filter(m => m.agentId === selectedAgent);

  const stats = {
    totalAgents: mockAgents.length,
    onlineAgents: mockAgents.filter(a => a.status === 'online').length,
    warningAgents: mockAgents.filter(a => a.status === 'warning').length,
    totalMessages: messages.length
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Agent Communication</h1>
          <p className="text-muted-foreground">Send commands and warnings to security agents</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Radio className="h-4 w-4 text-success animate-pulse" />
          {stats.onlineAgents} / {stats.totalAgents} Agents Online
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalAgents}</p>
                <p className="text-sm text-muted-foreground">Total Agents</p>
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
                <p className="text-2xl font-bold text-foreground">{stats.onlineAgents}</p>
                <p className="text-sm text-muted-foreground">Online</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.warningAgents}</p>
                <p className="text-sm text-muted-foreground">Warning</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>

        <SecurityCard>
          <SecurityCardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalMessages}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
              </div>
            </div>
          </SecurityCardContent>
        </SecurityCard>
      </div>

      <Tabs defaultValue="individual" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="individual">Individual Agent</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-6">
          {/* Send Message to Individual Agent */}
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle>Send Message to Agent</SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Agent</label>
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose agent" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockAgents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>
                          {agent.name} ({agent.hostname})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Message Type</label>
                  <Select value={messageType} onValueChange={(v) => setMessageType(v as typeof messageType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="command">Command</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Enter your message..."
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleSendMessage} className="w-full gap-2">
                <Send className="h-4 w-4" />
                Send Message
              </Button>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>

        <TabsContent value="broadcast" className="space-y-6">
          {/* Broadcast Warning */}
          <SecurityCard>
            <SecurityCardHeader>
              <SecurityCardTitle className="flex items-center gap-2">
                <Radio className="h-5 w-5 text-warning" />
                Broadcast Warning to All Agents
              </SecurityCardTitle>
            </SecurityCardHeader>
            <SecurityCardContent className="space-y-4">
              <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-sm text-warning font-medium">
                  ⚠️ This will send a warning message to all online agents ({stats.onlineAgents} agents)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Broadcast Message</label>
                <Textarea
                  placeholder="Enter warning message to broadcast to all agents..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  rows={4}
                />
              </div>

              <Button onClick={handleBroadcast} variant="destructive" className="w-full gap-2">
                <Radio className="h-4 w-4" />
                Broadcast to {stats.onlineAgents} Agents
              </Button>
            </SecurityCardContent>
          </SecurityCard>
        </TabsContent>
      </Tabs>

      {/* Agents List */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>Connected Agents</SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {mockAgents.map(agent => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{agent.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{agent.hostname}</span>
                      <span>•</span>
                      <span>{agent.platform}</span>
                      <span>•</span>
                      <span>{agent.ipAddress}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Last seen: {agent.lastSeen}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {getStatusBadge(agent.status)}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedAgent(agent.id)}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>

      {/* Message History */}
      <SecurityCard>
        <SecurityCardHeader>
          <SecurityCardTitle>
            Message History ({filteredMessages.length} messages)
          </SecurityCardTitle>
        </SecurityCardHeader>
        <SecurityCardContent>
          <div className="space-y-3">
            {filteredMessages.map(message => (
              <div
                key={message.id}
                className="flex items-start gap-4 p-4 border border-border/50 rounded-lg"
              >
                <MessageCircle className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-foreground">{message.agentName}</h3>
                    {getMessageTypeBadge(message.type)}
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </SecurityCardContent>
      </SecurityCard>
    </div>
  );
}
