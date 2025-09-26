import React from 'react';
import { MapPin, Globe, Target } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';

interface ThreatLocation {
  id: string;
  country: string;
  city: string;
  threatType: string;
  severity: 'critical' | 'high' | 'medium';
  count: number;
}

const threatLocations: ThreatLocation[] = [
  {
    id: '1',
    country: 'Russia',
    city: 'Moscow',
    threatType: 'Brute Force',
    severity: 'critical',
    count: 247
  },
  {
    id: '2',
    country: 'China',
    city: 'Beijing',
    threatType: 'Port Scan',
    severity: 'high',
    count: 156
  },
  {
    id: '3',
    country: 'North Korea',
    city: 'Pyongyang',
    threatType: 'Malware',
    severity: 'critical',
    count: 89
  },
  {
    id: '4',
    country: 'Iran',
    city: 'Tehran',
    threatType: 'Phishing',
    severity: 'medium',
    count: 67
  }
];

export function ThreatMapPanel() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-critical';
      case 'high':
        return 'text-warning';
      case 'medium':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <SecurityCard>
      <SecurityCardHeader>
        <SecurityCardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Global Threat Map
        </SecurityCardTitle>
      </SecurityCardHeader>
      <SecurityCardContent>
        {/* Simulated world map visualization */}
        <div className="relative bg-gradient-to-br from-accent/30 to-muted/20 rounded-lg p-6 mb-4 h-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,theme(colors.critical.DEFAULT)_0%,transparent_50%),radial-gradient(circle_at_80%_20%,theme(colors.warning.DEFAULT)_0%,transparent_50%),radial-gradient(circle_at_40%_80%,theme(colors.primary.DEFAULT)_0%,transparent_50%)] opacity-30"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <Target className="h-8 w-8 text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          {threatLocations.map((threat) => (
            <div
              key={threat.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className={`h-4 w-4 ${getSeverityColor(threat.severity)}`} />
                <div>
                  <p className="font-medium text-foreground">{threat.country}</p>
                  <p className="text-sm text-muted-foreground">{threat.threatType}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-foreground">{threat.count}</p>
                <p className="text-xs text-muted-foreground">attempts</p>
              </div>
            </div>
          ))}
        </div>
      </SecurityCardContent>
    </SecurityCard>
  );
}