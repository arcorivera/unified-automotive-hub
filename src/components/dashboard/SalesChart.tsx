import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const data = [
  { name: 'Jan', vehicles: 24, parts: 18, service: 12 },
  { name: 'Feb', vehicles: 28, parts: 22, service: 15 },
  { name: 'Mar', vehicles: 35, parts: 28, service: 18 },
  { name: 'Apr', vehicles: 32, parts: 25, service: 22 },
  { name: 'May', vehicles: 42, parts: 35, service: 28 },
  { name: 'Jun', vehicles: 38, parts: 32, service: 25 },
  { name: 'Jul', vehicles: 45, parts: 38, service: 30 },
  { name: 'Aug', vehicles: 52, parts: 42, service: 35 },
  { name: 'Sep', vehicles: 48, parts: 45, service: 38 },
  { name: 'Oct', vehicles: 55, parts: 48, service: 42 },
  { name: 'Nov', vehicles: 62, parts: 52, service: 45 },
  { name: 'Dec', vehicles: 58, parts: 55, service: 48 },
];

export const SalesChart = () => {
  return (
    <div className="module-card">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Revenue Overview</h3>
            <p className="text-xs text-muted-foreground">Monthly performance by category</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
            Week
          </Button>
          <Button variant="secondary" size="sm" className="text-xs">
            Month
          </Button>
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
            Year
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {/* Legend */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-xs text-muted-foreground">Vehicles</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Parts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning" />
            <span className="text-xs text-muted-foreground">Service</span>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVehicles" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(190, 95%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(190, 95%, 50%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorParts" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(142, 76%, 45%)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorService" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(38, 92%, 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(215, 20%, 55%)" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(222, 47%, 10%)', 
                  border: '1px solid hsl(222, 30%, 18%)',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(210, 40%, 98%)' }}
              />
              <Area
                type="monotone"
                dataKey="vehicles"
                stroke="hsl(190, 95%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVehicles)"
              />
              <Area
                type="monotone"
                dataKey="parts"
                stroke="hsl(142, 76%, 45%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorParts)"
              />
              <Area
                type="monotone"
                dataKey="service"
                stroke="hsl(38, 92%, 50%)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorService)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
