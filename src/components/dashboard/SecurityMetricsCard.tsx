import React from 'react';
import { LucideIcon } from 'lucide-react';
import { SecurityCard, SecurityCardHeader, SecurityCardTitle, SecurityCardContent } from '@/components/ui/security-card';

interface SecurityMetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  variant?: 'default' | 'critical' | 'warning' | 'success' | 'primary';
  description?: string;
}

export function SecurityMetricsCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  variant = 'default',
  description
}: SecurityMetricsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-success';
      case 'negative':
        return 'text-critical';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <SecurityCard variant={variant} className="hover:scale-105 transition-transform duration-200">
      <SecurityCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <SecurityCardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </SecurityCardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </SecurityCardHeader>
      <SecurityCardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <p className={`text-xs ${getChangeColor()}`}>
            {change}
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </SecurityCardContent>
    </SecurityCard>
  );
}