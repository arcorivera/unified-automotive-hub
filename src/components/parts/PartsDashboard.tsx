import { useState } from 'react';
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  TrendingUp, 
  Warehouse, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface KPIData {
  title: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  format?: 'currency' | 'number';
}

const kpiData: KPIData[] = [
  { 
    title: 'Total Parts in Stock', 
    value: '45,892', 
    change: 3.2, 
    trend: 'up', 
    icon: <Package className="w-5 h-5" />,
    format: 'number'
  },
  { 
    title: 'Low Stock Alerts', 
    value: '23', 
    change: -15.4, 
    trend: 'down', 
    icon: <AlertTriangle className="w-5 h-5" />,
    format: 'number'
  },
  { 
    title: 'Pending Orders', 
    value: '156', 
    change: 8.7, 
    trend: 'up', 
    icon: <ShoppingCart className="w-5 h-5" />,
    format: 'number'
  },
  { 
    title: 'Parts Sold (MTD)', 
    value: '2,847', 
    change: 12.3, 
    trend: 'up', 
    icon: <TrendingUp className="w-5 h-5" />,
    format: 'number'
  },
  { 
    title: 'Active Warehouses', 
    value: '8', 
    change: 0, 
    trend: 'neutral', 
    icon: <Warehouse className="w-5 h-5" />,
    format: 'number'
  },
  { 
    title: 'Parts Revenue', 
    value: '$847,320', 
    change: 18.9, 
    trend: 'up', 
    icon: <DollarSign className="w-5 h-5" />,
    format: 'currency'
  },
];

const recentOrders = [
  { id: 'PO-2024-001', supplier: 'Toyota Parts Co.', items: 45, status: 'in-transit', eta: '2 days' },
  { id: 'PO-2024-002', supplier: 'Bosch Automotive', items: 120, status: 'pending', eta: '5 days' },
  { id: 'PO-2024-003', supplier: 'Denso Corporation', items: 78, status: 'completed', eta: '-' },
  { id: 'PO-2024-004', supplier: 'NGK Spark Plugs', items: 200, status: 'approved', eta: '7 days' },
];

const lowStockItems = [
  { sku: 'BRK-001-FR', name: 'Front Brake Pads - Premium', stock: 3, reorder: 25 },
  { sku: 'OIL-5W30-SYN', name: 'Synthetic Oil 5W-30', stock: 12, reorder: 50 },
  { sku: 'FLT-AIR-001', name: 'Air Filter - Universal', stock: 5, reorder: 30 },
  { sku: 'SPK-NGK-001', name: 'NGK Spark Plug Set', stock: 8, reorder: 40 },
];

const topSellingParts = [
  { name: 'Engine Oil Filter', sold: 342, revenue: '$8,550' },
  { name: 'Brake Pads Set', sold: 287, revenue: '$28,700' },
  { name: 'Wiper Blades', sold: 256, revenue: '$3,840' },
  { name: 'Air Filter', sold: 234, revenue: '$4,680' },
  { name: 'Spark Plugs', sold: 198, revenue: '$2,970' },
];

export const PartsDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('week');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
    if (trend === 'up') return <ArrowUp className="w-3 h-3" />;
    if (trend === 'down') return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parts Distribution</h2>
          <p className="text-muted-foreground text-sm">Manage inventory, orders, and distribution</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={timeFilter} onValueChange={setTimeFilter}>
            <TabsList className="bg-secondary">
              <TabsTrigger value="today" className="text-xs">Today</TabsTrigger>
              <TabsTrigger value="week" className="text-xs">This Week</TabsTrigger>
              <TabsTrigger value="month" className="text-xs">This Month</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, index) => (
          <div 
            key={kpi.title} 
            className="stat-card p-5 animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {isLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between mb-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    kpi.title === 'Low Stock Alerts' ? "bg-destructive/10 text-destructive" :
                    kpi.title === 'Pending Orders' ? "bg-warning/10 text-warning" :
                    "bg-primary/10 text-primary"
                  )}>
                    {kpi.icon}
                  </div>
                  <div className={cn(
                    "flex items-center gap-1 text-xs font-medium",
                    kpi.trend === 'up' && "text-success",
                    kpi.trend === 'down' && kpi.title === 'Low Stock Alerts' ? "text-success" : 
                    kpi.trend === 'down' && "text-destructive",
                    kpi.trend === 'neutral' && "text-muted-foreground"
                  )}>
                    <TrendIcon trend={kpi.trend} />
                    <span>{Math.abs(kpi.change)}%</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-xs mb-1">{kpi.title}</p>
                <p className="kpi-value text-foreground text-2xl">{kpi.value}</p>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 module-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Recent Parts Orders</h3>
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              View All Orders
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Supplier</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="cursor-pointer">
                    <td className="mono text-primary">{order.id}</td>
                    <td className="text-foreground">{order.supplier}</td>
                    <td className="mono">{order.items}</td>
                    <td>
                      <span className={cn(
                        "badge-status",
                        order.status === 'completed' && "badge-success",
                        order.status === 'in-transit' && "badge-primary",
                        order.status === 'pending' && "badge-warning",
                        order.status === 'approved' && "bg-accent/20 text-accent"
                      )}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1).replace('-', ' ')}
                      </span>
                    </td>
                    <td className="text-muted-foreground">{order.eta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="module-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              <h3 className="font-semibold text-foreground">Low Stock Alerts</h3>
            </div>
            <span className="badge-warning text-xs px-2 py-1 rounded-full">23 items</span>
          </div>
          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div 
                key={item.sku} 
                className="p-3 rounded-lg bg-secondary/50 border border-border/30 hover:border-warning/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="mono text-xs text-muted-foreground">{item.sku}</span>
                  <span className="text-destructive text-xs font-medium">{item.stock} left</span>
                </div>
                <p className="text-sm text-foreground truncate">{item.name}</p>
                <div className="mt-2 h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-destructive to-warning rounded-full"
                    style={{ width: `${(item.stock / item.reorder) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full mt-4 text-xs">
            View All Low Stock Items
          </Button>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Parts */}
        <div className="module-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Top Selling Parts</h3>
            <span className="text-xs text-muted-foreground">This Month</span>
          </div>
          <div className="space-y-3">
            {topSellingParts.map((part, index) => (
              <div 
                key={part.name}
                className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold text-sm">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{part.name}</p>
                  <p className="text-xs text-muted-foreground">{part.sold} units sold</p>
                </div>
                <div className="text-right">
                  <p className="mono text-sm text-success">{part.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warehouse Distribution */}
        <div className="module-card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Warehouse Distribution</h3>
            <Button variant="ghost" size="sm" className="text-primary text-xs">
              Manage
            </Button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Main Warehouse', location: 'Downtown', capacity: 85, parts: 12450 },
              { name: 'North Branch', location: 'Industrial Park', capacity: 62, parts: 8320 },
              { name: 'South Distribution', location: 'Harbor District', capacity: 78, parts: 10890 },
              { name: 'East Storage', location: 'Commerce Center', capacity: 45, parts: 6120 },
            ].map((warehouse) => (
              <div key={warehouse.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{warehouse.name}</p>
                    <p className="text-xs text-muted-foreground">{warehouse.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="mono text-sm text-foreground">{warehouse.parts.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{warehouse.capacity}% capacity</p>
                  </div>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all",
                      warehouse.capacity > 80 ? "bg-gradient-to-r from-warning to-destructive" :
                      warehouse.capacity > 60 ? "bg-gradient-to-r from-primary to-accent" :
                      "bg-gradient-to-r from-success to-primary"
                    )}
                    style={{ width: `${warehouse.capacity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
