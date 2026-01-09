import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Package, 
  Truck, 
  Star, 
  Clock,
  ChevronRight,
  Building2,
  Navigation
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface PartAvailability {
  warehouseId: string;
  warehouseName: string;
  location: string;
  distance: string;
  stock: number;
  price: number;
  priority: 'high' | 'medium' | 'low';
  estimatedDelivery: string;
  isBestSource: boolean;
}

interface SearchResult {
  partId: string;
  sku: string;
  name: string;
  totalAvailable: number;
  availability: PartAvailability[];
}

const mockSearchResults: SearchResult[] = [
  {
    partId: '1',
    sku: 'BRK-001-FR',
    name: 'Front Brake Pads - Premium Ceramic',
    totalAvailable: 145,
    availability: [
      { warehouseId: 'w1', warehouseName: 'Main Warehouse', location: 'Downtown', distance: '2.5 km', stock: 45, price: 89.99, priority: 'high', estimatedDelivery: 'Same Day', isBestSource: true },
      { warehouseId: 'w2', warehouseName: 'North Branch', location: 'Industrial Park', distance: '8.2 km', stock: 32, price: 89.99, priority: 'medium', estimatedDelivery: '1 Day', isBestSource: false },
      { warehouseId: 'w3', warehouseName: 'South Distribution', location: 'Harbor District', distance: '15.4 km', stock: 50, price: 89.99, priority: 'low', estimatedDelivery: '2 Days', isBestSource: false },
      { warehouseId: 'w4', warehouseName: 'East Storage', location: 'Commerce Center', distance: '12.1 km', stock: 18, price: 89.99, priority: 'medium', estimatedDelivery: '1-2 Days', isBestSource: false },
    ]
  },
];

const recentSearches = [
  'BRK-001-FR',
  'OIL-5W30-SYN',
  'FLT-AIR-001',
  'SPK-NGK-001',
];

export const PartsLocator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedPart, setSelectedPart] = useState<SearchResult | null>(null);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchResults(mockSearchResults);
      setSelectedPart(mockSearchResults[0]);
      setIsSearching(false);
    }, 500);
  };

  const getPriorityBadge = (priority: PartAvailability['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-success/20 text-success border-0">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-warning/20 text-warning border-0">Medium</Badge>;
      case 'low':
        return <Badge className="bg-muted text-muted-foreground border-0">Low</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Parts Locator</h2>
        <p className="text-muted-foreground text-sm">Find parts across all warehouses and locations</p>
      </div>

      {/* Search Section */}
      <div className="module-card p-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by part name, SKU, OEM number..."
              className="pl-12 py-6 text-lg bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            size="lg" 
            className="px-8"
            onClick={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? 'Searching...' : 'Locate Part'}
          </Button>
        </div>

        {/* Recent Searches */}
        {!searchResults.length && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-2">Recent searches:</p>
            <div className="flex items-center gap-2 flex-wrap">
              {recentSearches.map((search) => (
                <button
                  key={search}
                  className="px-3 py-1 rounded-full bg-secondary text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  onClick={() => {
                    setSearchQuery(search);
                    handleSearch();
                  }}
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Search Results List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Search Results</h3>
            {searchResults.map((result) => (
              <div 
                key={result.partId}
                className={cn(
                  "module-card p-4 cursor-pointer transition-all",
                  selectedPart?.partId === result.partId && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedPart(result)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="mono text-primary text-sm">{result.sku}</p>
                    <p className="font-medium text-foreground text-sm mt-1">{result.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {result.totalAvailable} available across {result.availability.length} locations
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>

          {/* Availability Details */}
          {selectedPart && (
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{selectedPart.name}</h3>
                  <p className="text-sm text-muted-foreground">SKU: {selectedPart.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground mono">{selectedPart.totalAvailable}</p>
                  <p className="text-xs text-muted-foreground">Total Available</p>
                </div>
              </div>

              {/* Warehouse Availability */}
              <div className="space-y-3">
                {selectedPart.availability.map((availability) => (
                  <div 
                    key={availability.warehouseId}
                    className={cn(
                      "module-card p-4",
                      availability.isBestSource && "ring-2 ring-success"
                    )}
                  >
                    {availability.isBestSource && (
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 text-success fill-success" />
                        <span className="text-xs font-medium text-success">Best Source - Recommended</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-secondary">
                          <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{availability.warehouseName}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3" />
                            <span>{availability.location}</span>
                            <span className="mx-1">•</span>
                            <Navigation className="w-3 h-3" />
                            <span>{availability.distance}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="mono text-lg font-bold text-foreground">{availability.stock}</p>
                        <p className="text-xs text-muted-foreground">in stock</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="mono text-foreground font-medium">${availability.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Priority</p>
                        {getPriorityBadge(availability.priority)}
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Delivery</p>
                        <div className="flex items-center gap-1 text-sm">
                          <Truck className="w-3 h-3 text-muted-foreground" />
                          <span className="text-foreground">{availability.estimatedDelivery}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4">
                      <Button variant="outline" size="sm" className="flex-1">Request Transfer</Button>
                      <Button size="sm" className="flex-1">Reserve Stock</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div className="lg:col-span-3">
            <div className="module-card p-6 h-64 flex items-center justify-center bg-secondary/30">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground">Interactive Map View</p>
                <p className="text-xs text-muted-foreground mt-1">Warehouse locations and routes visualization</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!searchResults.length && !isSearching && (
        <div className="module-card p-12 text-center">
          <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Start Your Search</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Enter a part name, SKU, or OEM number to find availability across all warehouses and locations
          </p>
        </div>
      )}
    </div>
  );
};
