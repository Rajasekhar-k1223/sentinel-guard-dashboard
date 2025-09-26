import React from 'react';
import { Server, Activity, Wifi, Database, Cloud } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';

interface SystemStatus {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  uptime: string;
  icon: typeof Server;
}

const systemStatuses: SystemStatus[] = [
  {
    id: '1',
    name: 'Primary Domain Controller',
    status: 'online',
    uptime: '99.9%',
    icon: Server
  },
  {
    id: '2',
    name: 'SIEM Collector',
    status: 'online',
    uptime: '99.8%',
    icon: Database
  },
  {
    id: '3',
    name: 'Network Firewall',
    status: 'warning',
    uptime: '98.2%',
    icon: Wifi
  },
  {
    id: '4',
    name: 'Cloud Gateway',
    status: 'online',
    uptime: '99.9%',
    icon: Cloud
  }
];

export function SystemStatusPanel() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'offline':
        return 'text-critical';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIndicator = (status: string) => {
    return (
      <div
        className={`w-3 h-3 rounded-full ${
          status === 'online' ? 'bg-success glow-success' :
          status === 'warning' ? 'bg-warning glow-warning' :
          'bg-critical glow-critical'
        }`}
      />
    );
  };

  return (
    <SecurityCard>
      <SecurityCardHeader>
        <SecurityCardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          System Status
        </SecurityCardTitle>
      </SecurityCardHeader>
      <SecurityCardContent>
        <div className="space-y-4">
          {systemStatuses.map((system) => {
            const IconComponent = system.icon;
            return (
              <div
                key={system.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getStatusIndicator(system.status)}
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-foreground">{system.name}</p>
                    <p className="text-sm text-muted-foreground">Uptime: {system.uptime}</p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${getStatusColor(system.status)}`}>
                  {system.status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </SecurityCardContent>
    </SecurityCard>
  );
}