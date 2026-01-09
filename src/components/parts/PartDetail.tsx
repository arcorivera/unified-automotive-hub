import { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  Edit, 
  Printer, 
  MoreHorizontal,
  Warehouse,
  Car,
  DollarSign,
  Clock,
  TrendingUp,
  AlertTriangle,
  Check,
  Copy,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

interface PartDetailProps {
  onBack: () => void;
}

const partData = {
  id: '1',
  sku: 'BRK-001-FR',
  name: 'Front Brake Pads - Premium Ceramic',
  description: 'High-performance ceramic brake pads designed for maximum stopping power and minimal dust. Features advanced noise dampening technology and extended wear life.',
  category: 'Brakes',
  brand: 'Brembo',
  oem: 'P83024N',
  barcode: '8020584010242',
  price: 89.99,
  cost: 52.00,
  msrp: 109.99,
  totalStock: 145,
  minStock: 60,
  status: 'in-stock' as const,
  weight: '2.4 kg',
  dimensions: '15 x 12 x 4 cm',
  warranty: '24 months',
  createdAt: '2023-06-15',
  updatedAt: '2024-01-08',
};

const variants = [
  { id: 'v1', name: 'Standard', sku: 'BRK-001-FR-STD', price: 89.99, stock: 45 },
  { id: 'v2', name: 'Performance', sku: 'BRK-001-FR-PRF', price: 129.99, stock: 32 },
  { id: 'v3', name: 'Racing', sku: 'BRK-001-FR-RCE', price: 189.99, stock: 18 },
  { id: 'v4', name: 'Economy', sku: 'BRK-001-FR-ECO', price: 59.99, stock: 50 },
];

const warehouseStock = [
  { id: 'w1', name: 'Main Warehouse', location: 'Downtown', stock: 45, bin: 'A-12-3', capacity: 100 },
  { id: 'w2', name: 'North Branch', location: 'Industrial Park', stock: 32, bin: 'B-08-1', capacity: 50 },
  { id: 'w3', name: 'South Distribution', location: 'Harbor District', stock: 50, bin: 'C-15-2', capacity: 80 },
  { id: 'w4', name: 'East Storage', location: 'Commerce Center', stock: 18, bin: 'D-03-4', capacity: 40 },
];

const compatibleVehicles = [
  { make: 'Toyota', model: 'Camry', years: '2018-2024', trim: 'All Trims' },
  { make: 'Toyota', model: 'Avalon', years: '2019-2024', trim: 'All Trims' },
  { make: 'Honda', model: 'Accord', years: '2018-2023', trim: 'EX, Sport, Touring' },
  { make: 'Nissan', model: 'Altima', years: '2019-2024', trim: 'S, SV, SR, SL' },
  { make: 'Hyundai', model: 'Sonata', years: '2020-2024', trim: 'All Trims' },
];

const activityTimeline = [
  { id: 1, action: 'Stock Received', details: '50 units from PO-2024-001', user: 'John Smith', date: '2024-01-08 14:30' },
  { id: 2, action: 'Price Updated', details: '$85.99 → $89.99', user: 'Admin', date: '2024-01-05 10:15' },
  { id: 3, action: 'Stock Transfer', details: '20 units to North Branch', user: 'Maria Garcia', date: '2024-01-03 16:45' },
  { id: 4, action: 'Sale', details: '4 units - Invoice #INV-2024-0892', user: 'POS System', date: '2024-01-02 11:20' },
  { id: 5, action: 'Low Stock Alert', details: 'Stock fell below minimum', user: 'System', date: '2023-12-28 09:00' },
];

export const PartDetail = ({ onBack }: PartDetailProps) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStockHeatColor = (stock: number, capacity: number) => {
    const percentage = (stock / capacity) * 100;
    if (percentage < 30) return 'bg-destructive';
    if (percentage < 60) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-foreground">{partData.name}</h2>
              <span className="badge-status badge-success">In Stock</span>
            </div>
            <div className="flex items-center gap-4 mt-1">
              <button 
                className="flex items-center gap-1 text-primary text-sm hover:underline"
                onClick={() => copyToClipboard(partData.sku, 'sku')}
              >
                <span className="mono">{partData.sku}</span>
                {copiedField === 'sku' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
              <span className="text-muted-foreground">|</span>
              <button 
                className="flex items-center gap-1 text-muted-foreground text-sm hover:text-foreground"
                onClick={() => copyToClipboard(partData.oem, 'oem')}
              >
                OEM: <span className="mono">{partData.oem}</span>
                {copiedField === 'oem' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="w-4 h-4" />
            Print Label
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Stock</p>
              <p className="text-xl font-bold mono text-foreground">{partData.totalStock}</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <DollarSign className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Selling Price</p>
              <p className="text-xl font-bold mono text-foreground">${partData.price}</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Profit Margin</p>
              <p className="text-xl font-bold mono text-foreground">42.2%</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Warehouse className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Locations</p>
              <p className="text-xl font-bold mono text-foreground">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="stock">Stock by Warehouse</TabsTrigger>
          <TabsTrigger value="vehicles">Compatible Vehicles</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Image Gallery */}
            <div className="module-card p-4">
              <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Package className="w-24 h-24 text-muted-foreground/30" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-secondary flex items-center justify-center cursor-pointer hover:ring-2 ring-primary transition-all">
                    <Package className="w-6 h-6 text-muted-foreground/30" />
                  </div>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="module-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{partData.description}</p>
              </div>

              <div className="module-card p-5">
                <h3 className="font-semibold text-foreground mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category</span>
                      <span className="text-foreground">{partData.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Brand</span>
                      <span className="text-foreground">{partData.brand}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="text-foreground mono">{partData.weight}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Dimensions</span>
                      <span className="text-foreground mono">{partData.dimensions}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Warranty</span>
                      <span className="text-foreground">{partData.warranty}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Barcode</span>
                      <span className="text-foreground mono">{partData.barcode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Created</span>
                      <span className="text-foreground">{partData.createdAt}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Last Updated</span>
                      <span className="text-foreground">{partData.updatedAt}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="variants" className="mt-6">
          <div className="module-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th>Variant</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant) => (
                  <tr key={variant.id}>
                    <td className="font-medium text-foreground">{variant.name}</td>
                    <td className="mono text-primary">{variant.sku}</td>
                    <td className="mono text-foreground">${variant.price.toFixed(2)}</td>
                    <td className="mono">{variant.stock}</td>
                    <td>
                      <span className={cn(
                        "badge-status",
                        variant.stock > 20 ? "badge-success" : variant.stock > 0 ? "badge-warning" : "badge-destructive"
                      )}>
                        {variant.stock > 20 ? 'In Stock' : variant.stock > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="stock" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {warehouseStock.map((warehouse) => (
              <div key={warehouse.id} className="module-card p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">{warehouse.name}</h4>
                    <p className="text-xs text-muted-foreground">{warehouse.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="mono text-lg font-bold text-foreground">{warehouse.stock}</p>
                    <p className="text-xs text-muted-foreground">of {warehouse.capacity} capacity</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Bin Location</span>
                    <span className="mono text-primary">{warehouse.bin}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full", getStockHeatColor(warehouse.stock, warehouse.capacity))}
                      style={{ width: `${(warehouse.stock / warehouse.capacity) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1 text-xs">Transfer Out</Button>
                  <Button variant="outline" size="sm" className="flex-1 text-xs">Adjust</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="vehicles" className="mt-6">
          <div className="module-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th>Make</th>
                  <th>Model</th>
                  <th>Years</th>
                  <th>Trim Levels</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {compatibleVehicles.map((vehicle, index) => (
                  <tr key={index}>
                    <td className="font-medium text-foreground">{vehicle.make}</td>
                    <td className="text-foreground">{vehicle.model}</td>
                    <td className="mono text-muted-foreground">{vehicle.years}</td>
                    <td className="text-muted-foreground">{vehicle.trim}</td>
                    <td className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="module-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Price Breakdown</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Cost Price</span>
                  <span className="mono text-lg font-medium text-foreground">${partData.cost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">Selling Price</span>
                  <span className="mono text-lg font-medium text-success">${partData.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <span className="text-muted-foreground">MSRP</span>
                  <span className="mono text-lg font-medium text-foreground">${partData.msrp.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <span className="text-foreground font-medium">Profit Margin</span>
                  <span className="mono text-lg font-bold text-primary">42.2%</span>
                </div>
              </div>
            </div>
            <div className="module-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Dealer-Specific Pricing</h3>
              <div className="space-y-3">
                {['Main Dealer', 'North Branch', 'South Branch'].map((dealer) => (
                  <div key={dealer} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <span className="text-foreground">{dealer}</span>
                    <span className="mono text-foreground">${partData.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm">
                Configure Dealer Pricing
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="module-card p-5">
            <div className="space-y-0">
              {activityTimeline.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 pb-6 last:pb-0">
                  <div className="relative flex flex-col items-center">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center z-10",
                      activity.action === 'Stock Received' && "bg-success/10 text-success",
                      activity.action === 'Price Updated' && "bg-primary/10 text-primary",
                      activity.action === 'Stock Transfer' && "bg-accent/10 text-accent",
                      activity.action === 'Sale' && "bg-warning/10 text-warning",
                      activity.action === 'Low Stock Alert' && "bg-destructive/10 text-destructive"
                    )}>
                      {activity.action === 'Stock Received' && <Package className="w-4 h-4" />}
                      {activity.action === 'Price Updated' && <DollarSign className="w-4 h-4" />}
                      {activity.action === 'Stock Transfer' && <Warehouse className="w-4 h-4" />}
                      {activity.action === 'Sale' && <TrendingUp className="w-4 h-4" />}
                      {activity.action === 'Low Stock Alert' && <AlertTriangle className="w-4 h-4" />}
                    </div>
                    {index !== activityTimeline.length - 1 && (
                      <div className="absolute top-8 w-px h-full bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground text-sm">{activity.action}</h4>
                      <span className="text-xs text-muted-foreground">{activity.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{activity.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">by {activity.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
