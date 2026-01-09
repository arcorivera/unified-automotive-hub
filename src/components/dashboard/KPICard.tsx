import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  prefix?: string;
  suffix?: string;
}

export const KPICard = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon,
  trend = 'neutral',
  prefix,
  suffix 
}: KPICardProps) => {
  const TrendIcon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;
  
  return (
    <div className="stat-card p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          {icon}
        </div>
        {change !== undefined && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium",
            trend === 'up' && "text-success",
            trend === 'down' && "text-destructive",
            trend === 'neutral' && "text-muted-foreground"
          )}>
            <TrendIcon className="w-3 h-3" />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="text-muted-foreground text-sm">{title}</p>
        <p className="kpi-value text-foreground">
          {prefix}{value}{suffix}
        </p>
        {changeLabel && (
          <p className="text-xs text-muted-foreground">{changeLabel}</p>
        )}
      </div>
    </div>
  );
};
