import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  Package,
  Edit,
  ArrowRightLeft,
  History,
  MoreHorizontal,
  Eye,
  Plus,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Part {
  id: string;
  sku: string;
  name: string;
  category: string;
  brand: string;
  oem: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  compatibility: string[];
  warehouse: string;
  image?: string;
}

const mockParts: Part[] = [
  { id: '1', sku: 'BRK-001-FR', name: 'Front Brake Pads - Premium Ceramic', category: 'Brakes', brand: 'Brembo', oem: 'P83024N', price: 89.99, cost: 52.00, stock: 45, minStock: 20, status: 'in-stock', compatibility: ['Toyota Camry', 'Honda Accord', 'Nissan Altima'], warehouse: 'Main Warehouse' },
  { id: '2', sku: 'OIL-5W30-SYN', name: 'Full Synthetic Engine Oil 5W-30', category: 'Fluids', brand: 'Mobil 1', oem: 'MOB-5W30-5QT', price: 34.99, cost: 22.50, stock: 120, minStock: 50, status: 'in-stock', compatibility: ['Universal'], warehouse: 'Main Warehouse' },
  { id: '3', sku: 'FLT-AIR-001', name: 'High-Flow Air Filter', category: 'Filters', brand: 'K&N', oem: '33-2304', price: 54.99, cost: 35.00, stock: 8, minStock: 15, status: 'low-stock', compatibility: ['Toyota Corolla', 'Toyota Matrix'], warehouse: 'North Branch' },
  { id: '4', sku: 'SPK-NGK-001', name: 'Iridium Spark Plug Set (4pc)', category: 'Ignition', brand: 'NGK', oem: 'ILTR5A-13G', price: 42.99, cost: 28.00, stock: 0, minStock: 25, status: 'out-of-stock', compatibility: ['Honda Civic', 'Honda CR-V'], warehouse: 'East Storage' },
  { id: '5', sku: 'SUS-SHK-FR', name: 'Front Shock Absorber', category: 'Suspension', brand: 'Monroe', oem: '72218', price: 129.99, cost: 85.00, stock: 32, minStock: 10, status: 'in-stock', compatibility: ['Ford F-150', 'Ford Expedition'], warehouse: 'South Distribution' },
  { id: '6', sku: 'BAT-AGM-001', name: 'AGM Battery 12V 70Ah', category: 'Electrical', brand: 'Optima', oem: 'OPT-34R', price: 199.99, cost: 145.00, stock: 18, minStock: 8, status: 'in-stock', compatibility: ['Universal'], warehouse: 'Main Warehouse' },
  { id: '7', sku: 'BLT-SRP-001', name: 'Serpentine Belt', category: 'Belts', brand: 'Gates', oem: 'K060923', price: 28.99, cost: 16.50, stock: 5, minStock: 20, status: 'low-stock', compatibility: ['Chevrolet Silverado', 'GMC Sierra'], warehouse: 'North Branch' },
  { id: '8', sku: 'WPR-BLD-001', name: 'Premium Wiper Blade Set', category: 'Accessories', brand: 'Bosch', oem: '26A', price: 24.99, cost: 14.00, stock: 67, minStock: 30, status: 'in-stock', compatibility: ['Universal'], warehouse: 'Main Warehouse' },
];

const categories = ['All Categories', 'Brakes', 'Fluids', 'Filters', 'Ignition', 'Suspension', 'Electrical', 'Belts', 'Accessories'];
const brands = ['All Brands', 'Brembo', 'Mobil 1', 'K&N', 'NGK', 'Monroe', 'Optima', 'Gates', 'Bosch'];
const stockStatuses = ['All Status', 'In Stock', 'Low Stock', 'Out of Stock'];

export const PartsCatalog = () => {
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [showFilters, setShowFilters] = useState(false);

  const filteredParts = mockParts.filter(part => {
    const matchesSearch = 
      part.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.oem.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || part.category === selectedCategory;
    const matchesBrand = selectedBrand === 'All Brands' || part.brand === selectedBrand;
    const matchesStatus = selectedStatus === 'All Status' || 
      (selectedStatus === 'In Stock' && part.status === 'in-stock') ||
      (selectedStatus === 'Low Stock' && part.status === 'low-stock') ||
      (selectedStatus === 'Out of Stock' && part.status === 'out-of-stock');
    
    return matchesSearch && matchesCategory && matchesBrand && matchesStatus;
  });

  const getStatusBadge = (status: Part['status']) => {
    switch (status) {
      case 'in-stock':
        return <span className="badge-status badge-success">In Stock</span>;
      case 'low-stock':
        return <span className="badge-status badge-warning">Low Stock</span>;
      case 'out-of-stock':
        return <span className="badge-status badge-destructive">Out of Stock</span>;
    }
  };

  const getMargin = (price: number, cost: number) => {
    return ((price - cost) / price * 100).toFixed(1);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parts Catalog</h2>
          <p className="text-muted-foreground text-sm">{mockParts.length} parts in inventory</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Part
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="module-card p-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by part name, SKU, OEM number, or barcode..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
            <ChevronDown className={cn("w-4 h-4 transition-transform", showFilters && "rotate-180")} />
          </Button>
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            <button 
              className={cn(
                "p-2 transition-colors",
                viewMode === 'table' ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
              )}
              onClick={() => setViewMode('table')}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              className={cn(
                "p-2 transition-colors",
                viewMode === 'grid' ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border animate-fade-in">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Brand</label>
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Stock Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {stockStatuses.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Vehicle Compatibility</label>
              <Select>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="All Vehicles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Vehicles</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="ford">Ford</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing <span className="text-foreground font-medium">{filteredParts.length}</span> of {mockParts.length} parts
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort by:</span>
          <Select defaultValue="name">
            <SelectTrigger className="w-32 h-8 text-xs bg-secondary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="sku">SKU</SelectItem>
              <SelectItem value="stock">Stock Level</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="module-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr className="bg-secondary/50">
                  <th>SKU / OEM</th>
                  <th>Part Name</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Cost</th>
                  <th>Margin</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Warehouse</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredParts.map((part) => (
                  <tr key={part.id} className="cursor-pointer group">
                    <td>
                      <div>
                        <p className="mono text-primary text-sm">{part.sku}</p>
                        <p className="text-xs text-muted-foreground">{part.oem}</p>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                          <Package className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="max-w-[200px]">
                          <p className="text-sm text-foreground truncate">{part.name}</p>
                          <p className="text-xs text-muted-foreground">{part.compatibility.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge variant="secondary" className="text-xs">{part.category}</Badge>
                    </td>
                    <td className="text-foreground">{part.brand}</td>
                    <td className="mono text-foreground">${part.price.toFixed(2)}</td>
                    <td className="mono text-muted-foreground">${part.cost.toFixed(2)}</td>
                    <td>
                      <span className={cn(
                        "mono text-sm",
                        Number(getMargin(part.price, part.cost)) > 40 ? "text-success" :
                        Number(getMargin(part.price, part.cost)) > 25 ? "text-foreground" :
                        "text-warning"
                      )}>
                        {getMargin(part.price, part.cost)}%
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "mono font-medium",
                          part.stock === 0 ? "text-destructive" :
                          part.stock < part.minStock ? "text-warning" :
                          "text-foreground"
                        )}>
                          {part.stock}
                        </span>
                        <span className="text-xs text-muted-foreground">/ {part.minStock}</span>
                      </div>
                    </td>
                    <td>{getStatusBadge(part.status)}</td>
                    <td className="text-muted-foreground text-sm">{part.warehouse}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
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
                              Adjust Stock
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <ArrowRightLeft className="w-4 h-4" />
                              Transfer Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2">
                              <History className="w-4 h-4" />
                              View History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredParts.map((part) => (
            <div key={part.id} className="module-card p-4 hover:border-primary/30 transition-all cursor-pointer group">
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                  <Package className="w-6 h-6 text-muted-foreground" />
                </div>
                {getStatusBadge(part.status)}
              </div>
              <p className="mono text-primary text-xs mb-1">{part.sku}</p>
              <h3 className="font-medium text-foreground text-sm mb-2 line-clamp-2">{part.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">{part.category}</Badge>
                <span className="text-xs text-muted-foreground">{part.brand}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="mono text-foreground font-medium">${part.price.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">Cost: ${part.cost.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className={cn(
                    "mono font-medium",
                    part.stock === 0 ? "text-destructive" :
                    part.stock < part.minStock ? "text-warning" :
                    "text-success"
                  )}>
                    {part.stock} units
                  </p>
                  <p className="text-xs text-muted-foreground">{part.warehouse}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="outline" size="sm" className="flex-1 text-xs">View</Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">Transfer</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredParts.length === 0 && (
        <div className="module-card p-12 text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No parts found</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Try adjusting your search or filter criteria
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery('');
            setSelectedCategory('All Categories');
            setSelectedBrand('All Brands');
            setSelectedStatus('All Status');
          }}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};
