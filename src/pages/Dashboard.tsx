import React from 'react';
import { Shield, Activity, AlertTriangle, Target, Server, Users, Eye, Zap } from 'lucide-react';
import { SecurityMetricsCard } from '@/components/dashboard/SecurityMetricsCard';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { SystemStatusPanel } from '@/components/dashboard/SystemStatusPanel';
import { ThreatMapPanel } from '@/components/dashboard/ThreatMapPanel';

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Security Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and threat detection</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          All systems operational
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SecurityMetricsCard
          title="Active Threats"
          value="3"
          change="+2 from last hour"
          changeType="negative"
          icon={AlertTriangle}
          variant="critical"
        />
        <SecurityMetricsCard
          title="Protected Endpoints"
          value="1,247"
          change="+5 today"
          changeType="positive"
          icon={Shield}
          variant="success"
        />
        <SecurityMetricsCard
          title="System Uptime"
          value="99.9%"
          change="Last 30 days"
          changeType="positive"
          icon={Activity}
          variant="primary"
        />
        <SecurityMetricsCard
          title="Events/Hour"
          value="15,429"
          change="+12% from avg"
          changeType="neutral"
          icon={Zap}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <SecurityMetricsCard
          title="Failed Logins"
          value="127"
          change="+45% increase"
          changeType="negative"
          icon={Users}
          variant="warning"
        />
        <SecurityMetricsCard
          title="Network Flows"
          value="2.3M"
          change="Last 24h"
          changeType="neutral"
          icon={Server}
        />
        <SecurityMetricsCard
          title="Active Sessions"
          value="892"
          change="Currently online"
          changeType="neutral"
          icon={Eye}
        />
        <SecurityMetricsCard
          title="Threat Score"
          value="Medium"
          description="Based on 24h activity"
          changeType="neutral"
          icon={Target}
          variant="warning"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <AlertsPanel />
        <div className="space-y-6">
          <SystemStatusPanel />
          <ThreatMapPanel />
        </div>
      </div>
    </div>
  );
}