import { Package, AlertTriangle, TrendingUp, Truck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PartAlert {
  id: string;
  partNumber: string;
  name: string;
  type: 'low-stock' | 'high-demand' | 'incoming';
  quantity: number;
  threshold?: number;
  eta?: string;
}

const partAlerts: PartAlert[] = [
  { id: '1', partNumber: 'BMW-11427953129', name: 'Oil Filter', type: 'low-stock', quantity: 5, threshold: 20 },
  { id: '2', partNumber: 'MB-A0004212081', name: 'Brake Pad Set', type: 'high-demand', quantity: 156 },
  { id: '3', partNumber: 'AUDI-4G0998281', name: 'LED Headlight Module', type: 'incoming', quantity: 25, eta: 'Tomorrow' },
  { id: '4', partNumber: 'POR-99735101100', name: 'Air Filter', type: 'low-stock', quantity: 3, threshold: 15 },
];

const typeConfig = {
  'low-stock': { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Low Stock' },
  'high-demand': { icon: TrendingUp, color: 'text-success', bg: 'bg-success/10', label: 'High Demand' },
  'incoming': { icon: Truck, color: 'text-primary', bg: 'bg-primary/10', label: 'Incoming' },
};

export const PartsOverview = () => {
  return (
    <div className="module-card h-full">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10">
            <Package className="w-5 h-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Parts Alerts</h3>
            <p className="text-xs text-muted-foreground">4 items need attention</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View Catalog
        </Button>
      </div>
      
      <div className="p-4 space-y-3">
        {partAlerts.map((alert, index) => {
          const config = typeConfig[alert.type];
          const Icon = config.icon;
          
          return (
            <div 
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors group animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`p-2 rounded-lg ${config.bg}`}>
                <Icon className={`w-4 h-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{alert.name}</p>
                <p className="mono text-xs text-muted-foreground">{alert.partNumber}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-medium ${config.color}`}>
                  {alert.type === 'low-stock' && `${alert.quantity} left`}
                  {alert.type === 'high-demand' && `+${alert.quantity} sold`}
                  {alert.type === 'incoming' && `${alert.quantity} units`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {alert.type === 'low-stock' && `Min: ${alert.threshold}`}
                  {alert.type === 'high-demand' && 'This week'}
                  {alert.type === 'incoming' && alert.eta}
                </p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>
      
      {/* Quick Stats */}
      <div className="p-4 border-t border-border/50 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-foreground mono">12,458</p>
          <p className="text-xs text-muted-foreground">Total SKUs</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-warning mono">23</p>
          <p className="text-xs text-muted-foreground">Low Stock</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-success mono">$2.4M</p>
          <p className="text-xs text-muted-foreground">Inventory Value</p>
        </div>
      </div>
    </div>
  );
};
