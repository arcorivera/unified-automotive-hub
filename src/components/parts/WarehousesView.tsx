import { useState } from 'react';
import { 
  Warehouse as WarehouseIcon, 
  Plus, 
  Search, 
  MapPin, 
  Package, 
  TrendingUp,
  MoreHorizontal,
  Edit,
  Eye,
  ArrowRightLeft,
  Grid3X3,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Warehouse {
  id: string;
  name: string;
  location: string;
  address: string;
  totalCapacity: number;
  usedCapacity: number;
  totalParts: number;
  uniqueSKUs: number;
  zones: Zone[];
  manager: string;
  status: 'active' | 'maintenance' | 'inactive';
}

interface Zone {
  id: string;
  name: string;
  bins: Bin[];
}

interface Bin {
  id: string;
  label: string;
  capacity: number;
  used: number;
  items: number;
}

const warehouses: Warehouse[] = [
  {
    id: 'w1',
    name: 'Main Warehouse',
    location: 'Downtown',
    address: '1234 Industrial Blvd, City Center',
    totalCapacity: 50000,
    usedCapacity: 42500,
    totalParts: 15892,
    uniqueSKUs: 2450,
    manager: 'John Smith',
    status: 'active',
    zones: [
      { id: 'z1', name: 'Zone A - Brakes', bins: [
        { id: 'b1', label: 'A-01-1', capacity: 100, used: 85, items: 45 },
        { id: 'b2', label: 'A-01-2', capacity: 100, used: 72, items: 38 },
        { id: 'b3', label: 'A-02-1', capacity: 100, used: 90, items: 52 },
      ]},
      { id: 'z2', name: 'Zone B - Filters', bins: [
        { id: 'b4', label: 'B-01-1', capacity: 150, used: 120, items: 89 },
        { id: 'b5', label: 'B-01-2', capacity: 150, used: 95, items: 67 },
      ]},
    ]
  },
  {
    id: 'w2',
    name: 'North Branch',
    location: 'Industrial Park',
    address: '5678 Commerce Way, North District',
    totalCapacity: 30000,
    usedCapacity: 18600,
    totalParts: 8320,
    uniqueSKUs: 1580,
    manager: 'Maria Garcia',
    status: 'active',
    zones: [
      { id: 'z3', name: 'Zone A - General', bins: [
        { id: 'b6', label: 'A-01-1', capacity: 200, used: 145, items: 78 },
        { id: 'b7', label: 'A-02-1', capacity: 200, used: 180, items: 95 },
      ]},
    ]
  },
  {
    id: 'w3',
    name: 'South Distribution',
    location: 'Harbor District',
    address: '9012 Port Road, South Harbor',
    totalCapacity: 40000,
    usedCapacity: 31200,
    totalParts: 12450,
    uniqueSKUs: 2100,
    manager: 'David Lee',
    status: 'active',
    zones: []
  },
  {
    id: 'w4',
    name: 'East Storage',
    location: 'Commerce Center',
    address: '3456 Trade Plaza, East Side',
    totalCapacity: 25000,
    usedCapacity: 11250,
    totalParts: 6120,
    uniqueSKUs: 980,
    manager: 'Sarah Johnson',
    status: 'maintenance',
    zones: []
  },
];

export const WarehousesView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const getCapacityColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage > 90) return 'text-destructive';
    if (percentage > 75) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage > 90) return 'bg-destructive';
    if (percentage > 75) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Warehouses & Locations</h2>
          <p className="text-muted-foreground text-sm">{warehouses.length} warehouses, {warehouses.reduce((acc, w) => acc + w.totalParts, 0).toLocaleString()} total parts</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowTransferModal(true)}>
            <ArrowRightLeft className="w-4 h-4" />
            Quick Transfer
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Warehouse
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search warehouses..."
          className="pl-10 bg-secondary border-border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Warehouse Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {warehouses.map((warehouse) => (
          <div 
            key={warehouse.id} 
            className={cn(
              "module-card p-5 cursor-pointer transition-all",
              selectedWarehouse?.id === warehouse.id && "ring-2 ring-primary"
            )}
            onClick={() => setSelectedWarehouse(warehouse)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-3 rounded-xl",
                  warehouse.status === 'active' ? "bg-success/10" : 
                  warehouse.status === 'maintenance' ? "bg-warning/10" : "bg-muted"
                )}>
                  <WarehouseIcon className={cn(
                    "w-6 h-6",
                    warehouse.status === 'active' ? "text-success" : 
                    warehouse.status === 'maintenance' ? "text-warning" : "text-muted-foreground"
                  )} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{warehouse.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{warehouse.location}</span>
                  </div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Eye className="w-4 h-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Warehouse
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2">
                    <ArrowRightLeft className="w-4 h-4" />
                    Transfer Stock
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 rounded-lg bg-secondary/50">
                <Package className="w-4 h-4 text-primary mb-1" />
                <p className="mono text-lg font-bold text-foreground">{warehouse.totalParts.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Parts</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <Grid3X3 className="w-4 h-4 text-accent mb-1" />
                <p className="mono text-lg font-bold text-foreground">{warehouse.uniqueSKUs.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Unique SKUs</p>
              </div>
              <div className="p-3 rounded-lg bg-secondary/50">
                <Layers className="w-4 h-4 text-warning mb-1" />
                <p className="mono text-lg font-bold text-foreground">{warehouse.zones.length}</p>
                <p className="text-xs text-muted-foreground">Zones</p>
              </div>
            </div>

            {/* Capacity Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span className={cn("mono font-medium", getCapacityColor(warehouse.usedCapacity, warehouse.totalCapacity))}>
                  {((warehouse.usedCapacity / warehouse.totalCapacity) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all", getProgressColor(warehouse.usedCapacity, warehouse.totalCapacity))}
                  style={{ width: `${(warehouse.usedCapacity / warehouse.totalCapacity) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{warehouse.usedCapacity.toLocaleString()} used</span>
                <span>{warehouse.totalCapacity.toLocaleString()} total</span>
              </div>
            </div>

            {/* Manager */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground">Manager: {warehouse.manager}</span>
              <span className={cn(
                "badge-status text-xs",
                warehouse.status === 'active' ? "badge-success" :
                warehouse.status === 'maintenance' ? "badge-warning" :
                "bg-muted text-muted-foreground"
              )}>
                {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bin Visualization for Selected Warehouse */}
      {selectedWarehouse && selectedWarehouse.zones.length > 0 && (
        <div className="module-card p-5">
          <h3 className="font-semibold text-foreground mb-4">
            Bin Layout - {selectedWarehouse.name}
          </h3>
          <div className="space-y-6">
            {selectedWarehouse.zones.map((zone) => (
              <div key={zone.id}>
                <h4 className="text-sm font-medium text-muted-foreground mb-3">{zone.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {zone.bins.map((bin) => (
                    <div 
                      key={bin.id}
                      className={cn(
                        "p-3 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50",
                        bin.used / bin.capacity > 0.9 ? "border-destructive/30 bg-destructive/5" :
                        bin.used / bin.capacity > 0.7 ? "border-warning/30 bg-warning/5" :
                        "border-border bg-secondary/30"
                      )}
                    >
                      <p className="mono text-sm font-medium text-primary">{bin.label}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">{bin.items} items</span>
                        <span className={cn(
                          "text-xs mono font-medium",
                          bin.used / bin.capacity > 0.9 ? "text-destructive" :
                          bin.used / bin.capacity > 0.7 ? "text-warning" :
                          "text-success"
                        )}>
                          {Math.round((bin.used / bin.capacity) * 100)}%
                        </span>
                      </div>
                      <div className="h-1 bg-secondary rounded-full overflow-hidden mt-2">
                        <div 
                          className={cn(
                            "h-full rounded-full",
                            bin.used / bin.capacity > 0.9 ? "bg-destructive" :
                            bin.used / bin.capacity > 0.7 ? "bg-warning" :
                            "bg-success"
                          )}
                          style={{ width: `${(bin.used / bin.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Transfer Modal */}
      <Dialog open={showTransferModal} onOpenChange={setShowTransferModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Quick Stock Transfer</DialogTitle>
            <DialogDescription>
              Transfer parts between warehouses
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">From Warehouse</label>
                <select className="w-full p-2 rounded-lg bg-secondary border border-border text-foreground">
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1 block">To Warehouse</label>
                <select className="w-full p-2 rounded-lg bg-secondary border border-border text-foreground">
                  {warehouses.map(w => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Part SKU</label>
              <Input placeholder="Enter SKU..." className="bg-secondary" />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Quantity</label>
              <Input type="number" placeholder="0" className="bg-secondary" />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Button variant="outline" className="flex-1" onClick={() => setShowTransferModal(false)}>
                Cancel
              </Button>
              <Button className="flex-1">
                Create Transfer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
