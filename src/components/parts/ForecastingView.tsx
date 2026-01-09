import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  RefreshCw,
  Package,
  ArrowUp,
  ArrowDown,
  Zap,
  Snail
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const demandForecastData = [
  { month: 'Jan', actual: 4200, forecast: 4100 },
  { month: 'Feb', actual: 3800, forecast: 3900 },
  { month: 'Mar', actual: 5100, forecast: 4800 },
  { month: 'Apr', actual: 4600, forecast: 4700 },
  { month: 'May', actual: 5400, forecast: 5200 },
  { month: 'Jun', actual: 0, forecast: 5600 },
  { month: 'Jul', actual: 0, forecast: 5900 },
  { month: 'Aug', actual: 0, forecast: 6100 },
];

const fastMovingParts = [
  { name: 'Engine Oil Filter', sku: 'FLT-OIL-001', soldMTD: 342, velocity: 11.4, trend: 'up' },
  { name: 'Brake Pads Set', sku: 'BRK-001-FR', soldMTD: 287, velocity: 9.6, trend: 'up' },
  { name: 'Wiper Blades', sku: 'WPR-BLD-001', soldMTD: 256, velocity: 8.5, trend: 'stable' },
  { name: 'Air Filter', sku: 'FLT-AIR-001', soldMTD: 234, velocity: 7.8, trend: 'up' },
  { name: 'Spark Plugs', sku: 'SPK-NGK-001', soldMTD: 198, velocity: 6.6, trend: 'down' },
];

const slowMovingParts = [
  { name: 'Transmission Mount', sku: 'TRS-MNT-001', stock: 45, daysInStock: 180, lastSold: '2023-10-15' },
  { name: 'Timing Chain Kit', sku: 'ENG-TCK-001', stock: 23, daysInStock: 165, lastSold: '2023-11-02' },
  { name: 'Water Pump Housing', sku: 'WPH-001', stock: 18, daysInStock: 142, lastSold: '2023-11-20' },
  { name: 'Valve Cover Gasket', sku: 'ENG-VCG-001', stock: 67, daysInStock: 125, lastSold: '2023-12-05' },
];

const stockAgingData = [
  { name: '0-30 days', value: 45, color: 'hsl(142, 76%, 45%)' },
  { name: '31-60 days', value: 25, color: 'hsl(190, 95%, 50%)' },
  { name: '61-90 days', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: '90+ days', value: 15, color: 'hsl(0, 72%, 51%)' },
];

const reorderSuggestions = [
  { sku: 'FLT-OIL-001', name: 'Engine Oil Filter', currentStock: 23, suggestedQty: 100, daysUntilStockout: 3, priority: 'critical' },
  { sku: 'BRK-001-FR', name: 'Front Brake Pads', currentStock: 45, suggestedQty: 80, daysUntilStockout: 7, priority: 'high' },
  { sku: 'SPK-NGK-001', name: 'Spark Plug Set', currentStock: 56, suggestedQty: 50, daysUntilStockout: 12, priority: 'medium' },
  { sku: 'WPR-BLD-001', name: 'Wiper Blade Set', currentStock: 78, suggestedQty: 40, daysUntilStockout: 18, priority: 'low' },
];

export const ForecastingView = () => {
  const [activeTab, setActiveTab] = useState('demand');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Forecasting & Insights</h2>
          <p className="text-muted-foreground text-sm">Demand predictions, stock aging, and reorder suggestions</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Forecast Accuracy</p>
              <p className="text-xl font-bold mono text-foreground">94.2%</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <Zap className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Fast Moving</p>
              <p className="text-xl font-bold mono text-foreground">156</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Snail className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Slow Moving</p>
              <p className="text-xl font-bold mono text-foreground">89</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reorder Alerts</p>
              <p className="text-xl font-bold mono text-foreground">12</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="demand">Demand Forecast</TabsTrigger>
          <TabsTrigger value="velocity">Parts Velocity</TabsTrigger>
          <TabsTrigger value="aging">Stock Aging</TabsTrigger>
          <TabsTrigger value="reorder">Reorder Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="demand" className="mt-6">
          <div className="module-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Demand Forecast (Units)</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Forecast</span>
                </div>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandForecastData}>
                  <defs>
                    <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190, 95%, 50%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(190, 95%, 50%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190, 80%, 45%)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(190, 80%, 45%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 18%)" />
                  <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" />
                  <YAxis stroke="hsl(215, 20%, 55%)" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(222, 47%, 10%)', 
                      border: '1px solid hsl(222, 30%, 18%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="actual" 
                    stroke="hsl(190, 95%, 50%)" 
                    fillOpacity={1} 
                    fill="url(#colorActual)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="forecast" 
                    stroke="hsl(190, 80%, 45%)" 
                    fillOpacity={1} 
                    fill="url(#colorForecast)" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="velocity" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Fast Moving */}
            <div className="module-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-success" />
                <h3 className="font-semibold text-foreground">Fast Moving Parts</h3>
              </div>
              <div className="space-y-3">
                {fastMovingParts.map((part, index) => (
                  <div key={part.sku} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                        <span className="text-success font-bold text-sm">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{part.name}</p>
                        <p className="text-xs text-muted-foreground mono">{part.sku}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="mono text-foreground font-medium">{part.soldMTD}</p>
                        <p className="text-xs text-muted-foreground">sold MTD</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="mono text-sm text-muted-foreground">{part.velocity}/day</span>
                        {part.trend === 'up' && <ArrowUp className="w-4 h-4 text-success" />}
                        {part.trend === 'down' && <ArrowDown className="w-4 h-4 text-destructive" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slow Moving */}
            <div className="module-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Snail className="w-5 h-5 text-warning" />
                <h3 className="font-semibold text-foreground">Slow Moving Parts</h3>
              </div>
              <div className="space-y-3">
                {slowMovingParts.map((part) => (
                  <div key={part.sku} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                    <div>
                      <p className="text-sm font-medium text-foreground">{part.name}</p>
                      <p className="text-xs text-muted-foreground mono">{part.sku}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="mono text-foreground">{part.stock} units</p>
                        <p className="text-xs text-warning">{part.daysInStock} days in stock</p>
                      </div>
                      <Badge className="bg-warning/20 text-warning border-0">
                        <Clock className="w-3 h-3 mr-1" />
                        Aging
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="aging" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="module-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Stock Age Distribution</h3>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockAgingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {stockAgingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(222, 47%, 10%)', 
                        border: '1px solid hsl(222, 30%, 18%)',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {stockAgingData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}</span>
                    <span className="mono text-sm text-foreground ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="module-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Aging Analysis</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">Fresh Stock (0-30 days)</span>
                    <span className="mono text-success font-bold">45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">20,150 items • $847,320 value</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">Normal (31-60 days)</span>
                    <span className="mono text-primary font-bold">25%</span>
                  </div>
                  <Progress value={25} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">11,194 items • $412,560 value</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">Aging (61-90 days)</span>
                    <span className="mono text-warning font-bold">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">6,716 items • $198,450 value</p>
                </div>
                <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-foreground font-medium">Critical (90+ days)</span>
                    <span className="mono text-destructive font-bold">15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-2">6,716 items • $156,780 value</p>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reorder" className="mt-6">
          <div className="module-card overflow-hidden">
            <div className="p-4 bg-secondary/30 border-b border-border">
              <h3 className="font-semibold text-foreground">AI-Powered Reorder Suggestions</h3>
              <p className="text-sm text-muted-foreground">Based on demand forecast and current stock levels</p>
            </div>
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th>Priority</th>
                  <th>SKU / Name</th>
                  <th className="text-right">Current Stock</th>
                  <th className="text-right">Days Until Stockout</th>
                  <th className="text-right">Suggested Qty</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reorderSuggestions.map((item) => (
                  <tr key={item.sku}>
                    <td>
                      <Badge className={cn(
                        "border-0",
                        item.priority === 'critical' && "bg-destructive/20 text-destructive",
                        item.priority === 'high' && "bg-warning/20 text-warning",
                        item.priority === 'medium' && "bg-primary/20 text-primary",
                        item.priority === 'low' && "bg-muted text-muted-foreground"
                      )}>
                        {item.priority === 'critical' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <div>
                        <p className="mono text-primary text-sm">{item.sku}</p>
                        <p className="text-sm text-foreground">{item.name}</p>
                      </div>
                    </td>
                    <td className="text-right">
                      <span className={cn(
                        "mono font-medium",
                        item.currentStock < 30 ? "text-destructive" : 
                        item.currentStock < 50 ? "text-warning" : 
                        "text-foreground"
                      )}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className={cn(
                        "mono",
                        item.daysUntilStockout <= 3 ? "text-destructive font-bold" :
                        item.daysUntilStockout <= 7 ? "text-warning" :
                        "text-muted-foreground"
                      )}>
                        {item.daysUntilStockout} days
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="mono text-success font-medium">+{item.suggestedQty}</span>
                    </td>
                    <td className="text-right">
                      <Button size="sm" variant="outline" className="mr-2">Skip</Button>
                      <Button size="sm">Create PO</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
