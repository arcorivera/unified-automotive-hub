import { useState } from 'react';
import { 
  DollarSign, 
  Percent, 
  TrendingUp, 
  Edit,
  Save,
  Tag,
  Building2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PricingItem {
  id: string;
  sku: string;
  name: string;
  cost: number;
  sellingPrice: number;
  msrp: number;
  margin: number;
  hasPromo: boolean;
  promoPrice?: number;
}

const pricingData: PricingItem[] = [
  { id: '1', sku: 'BRK-001-FR', name: 'Front Brake Pads - Premium Ceramic', cost: 52.00, sellingPrice: 89.99, msrp: 109.99, margin: 42.2, hasPromo: false },
  { id: '2', sku: 'OIL-5W30-SYN', name: 'Full Synthetic Engine Oil 5W-30', cost: 22.50, sellingPrice: 34.99, msrp: 44.99, margin: 35.7, hasPromo: true, promoPrice: 29.99 },
  { id: '3', sku: 'FLT-AIR-001', name: 'High-Flow Air Filter', cost: 35.00, sellingPrice: 54.99, msrp: 64.99, margin: 36.4, hasPromo: false },
  { id: '4', sku: 'SPK-NGK-001', name: 'Iridium Spark Plug Set (4pc)', cost: 28.00, sellingPrice: 42.99, msrp: 54.99, margin: 34.9, hasPromo: false },
  { id: '5', sku: 'SUS-SHK-FR', name: 'Front Shock Absorber', cost: 85.00, sellingPrice: 129.99, msrp: 159.99, margin: 34.6, hasPromo: true, promoPrice: 114.99 },
];

const dealerPricing = [
  { dealerId: 'd1', name: 'Main Dealer', discount: 0, markup: 0 },
  { dealerId: 'd2', name: 'North Branch', discount: 5, markup: 0 },
  { dealerId: 'd3', name: 'South Branch', discount: 3, markup: 0 },
  { dealerId: 'd4', name: 'Partner Dealer A', discount: 8, markup: 0 },
  { dealerId: 'd5', name: 'Partner Dealer B', discount: 10, markup: 0 },
];

export const PricingView = () => {
  const [activeTab, setActiveTab] = useState('catalog');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMargin, setBulkMargin] = useState([35]);

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const calculateNewPrice = (cost: number, margin: number) => {
    return cost / (1 - margin / 100);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Pricing & Margins</h2>
          <p className="text-muted-foreground text-sm">Manage pricing rules, margins, and promotions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Tag className="w-4 h-4" />
            Create Promo
          </Button>
          <Button size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Percent className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg. Margin</p>
              <p className="text-xl font-bold mono text-foreground">36.8%</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <TrendingUp className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">High Margin Items</p>
              <p className="text-xl font-bold mono text-foreground">234</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Sparkles className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active Promos</p>
              <p className="text-xl font-bold mono text-foreground">12</p>
            </div>
          </div>
        </div>
        <div className="stat-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/10">
              <Building2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Dealer Tiers</p>
              <p className="text-xl font-bold mono text-foreground">5</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary">
          <TabsTrigger value="catalog">Catalog Pricing</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Update</TabsTrigger>
          <TabsTrigger value="dealer">Dealer Pricing</TabsTrigger>
          <TabsTrigger value="promos">Promotions</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="mt-6">
          <div className="module-card overflow-hidden">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th className="w-8">
                    <input 
                      type="checkbox" 
                      className="rounded border-border"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(pricingData.map(p => p.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </th>
                  <th>SKU / Name</th>
                  <th className="text-right">Cost</th>
                  <th className="text-right">Selling Price</th>
                  <th className="text-right">MSRP</th>
                  <th className="text-right">Margin</th>
                  <th>Promo</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pricingData.map((item) => (
                  <tr key={item.id} className="group">
                    <td>
                      <input 
                        type="checkbox" 
                        className="rounded border-border"
                        checked={selectedItems.includes(item.id)}
                        onChange={() => toggleItemSelection(item.id)}
                      />
                    </td>
                    <td>
                      <div>
                        <p className="mono text-primary text-sm">{item.sku}</p>
                        <p className="text-sm text-foreground truncate max-w-[200px]">{item.name}</p>
                      </div>
                    </td>
                    <td className="text-right">
                      <span className="mono text-muted-foreground">${item.cost.toFixed(2)}</span>
                    </td>
                    <td className="text-right">
                      {editingItem === item.id ? (
                        <Input 
                          type="number" 
                          defaultValue={item.sellingPrice}
                          className="w-24 h-8 text-right mono bg-secondary"
                        />
                      ) : (
                        <span className="mono text-foreground font-medium">${item.sellingPrice.toFixed(2)}</span>
                      )}
                    </td>
                    <td className="text-right">
                      <span className="mono text-muted-foreground">${item.msrp.toFixed(2)}</span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <span className={cn(
                          "mono font-medium",
                          item.margin >= 40 ? "text-success" :
                          item.margin >= 30 ? "text-foreground" :
                          "text-warning"
                        )}>
                          {item.margin.toFixed(1)}%
                        </span>
                        {item.margin >= 40 ? (
                          <ArrowUpRight className="w-3 h-3 text-success" />
                        ) : item.margin < 30 ? (
                          <ArrowDownRight className="w-3 h-3 text-warning" />
                        ) : null}
                      </div>
                    </td>
                    <td>
                      {item.hasPromo ? (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-warning/20 text-warning border-0 gap-1">
                            <Sparkles className="w-3 h-3" />
                            ${item.promoPrice}
                          </Badge>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100"
                        onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="module-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Bulk Margin Update</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Target Category</label>
                  <Select>
                    <SelectTrigger className="bg-secondary">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="brakes">Brakes</SelectItem>
                      <SelectItem value="filters">Filters</SelectItem>
                      <SelectItem value="fluids">Fluids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm text-muted-foreground">Target Margin</label>
                    <span className="mono text-primary font-bold">{bulkMargin[0]}%</span>
                  </div>
                  <Slider
                    value={bulkMargin}
                    onValueChange={setBulkMargin}
                    max={60}
                    min={10}
                    step={1}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>10%</span>
                    <span>60%</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                  <p className="text-sm text-muted-foreground mb-2">Preview</p>
                  <p className="text-foreground">
                    This will update <span className="font-bold text-primary">156 items</span> in the selected category
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Average price change: <span className="text-success">+$4.52</span>
                  </p>
                </div>

                <Button className="w-full">Apply Bulk Update</Button>
              </div>
            </div>

            <div className="module-card p-5">
              <h3 className="font-semibold text-foreground mb-4">Affected Items Preview</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {pricingData.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="text-sm text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground line-through">${item.sellingPrice}</p>
                      <p className="text-sm text-success mono font-medium">
                        ${calculateNewPrice(item.cost, bulkMargin[0]).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="dealer" className="mt-6">
          <div className="module-card p-5">
            <h3 className="font-semibold text-foreground mb-4">Dealer-Specific Pricing</h3>
            <div className="space-y-4">
              {dealerPricing.map((dealer) => (
                <div key={dealer.dealerId} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{dealer.name}</p>
                      <p className="text-xs text-muted-foreground">Standard pricing tier</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Discount</p>
                      <p className="mono text-lg font-medium text-foreground">{dealer.discount}%</p>
                    </div>
                    <div className="w-32">
                      <Slider
                        defaultValue={[dealer.discount]}
                        max={20}
                        step={1}
                      />
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="promos" className="mt-6">
          <div className="module-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground">Active Promotions</h3>
              <Button size="sm" className="gap-2">
                <Sparkles className="w-4 h-4" />
                New Promotion
              </Button>
            </div>
            <div className="space-y-3">
              {pricingData.filter(p => p.hasPromo).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 rounded-lg bg-warning/5 border border-warning/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-warning/10">
                      <Sparkles className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground line-through">${item.sellingPrice}</p>
                      <p className="text-lg font-bold text-warning mono">${item.promoPrice}</p>
                    </div>
                    <Badge className="bg-success/20 text-success border-0">Active</Badge>
                    <Button variant="outline" size="sm">Edit</Button>
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
