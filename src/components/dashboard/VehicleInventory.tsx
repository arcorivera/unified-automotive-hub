import { Car, MoreVertical, Eye, Edit, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Vehicle {
  id: string;
  model: string;
  variant: string;
  vin: string;
  status: 'available' | 'reserved' | 'sold' | 'in-transit';
  price: number;
  location: string;
  image?: string;
}

const vehicles: Vehicle[] = [
  { id: '1', model: 'BMW 5 Series', variant: '530i M Sport', vin: 'WBA53BH09NCK12345', status: 'available', price: 62500, location: 'Main Showroom' },
  { id: '2', model: 'Mercedes-Benz E-Class', variant: 'E350 AMG Line', vin: 'W1KZF8DB4NA123456', status: 'reserved', price: 58900, location: 'Main Showroom' },
  { id: '3', model: 'Audi A6', variant: '45 TFSI quattro', vin: 'WAUZZZ4G7LN012345', status: 'in-transit', price: 55200, location: 'In Transit' },
  { id: '4', model: 'Porsche Taycan', variant: '4S Performance', vin: 'WP0ZZZ98ZMS123456', status: 'available', price: 112500, location: 'Premium Hall' },
  { id: '5', model: 'BMW X5', variant: 'xDrive40i', vin: 'WBAJS4C05NCH12345', status: 'sold', price: 72800, location: 'Delivered' },
];

const statusConfig = {
  'available': { label: 'Available', class: 'badge-success' },
  'reserved': { label: 'Reserved', class: 'badge-warning' },
  'sold': { label: 'Sold', class: 'badge-primary' },
  'in-transit': { label: 'In Transit', class: 'badge-destructive' },
};

export const VehicleInventory = () => {
  return (
    <div className="module-card">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Car className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Vehicle Inventory</h3>
            <p className="text-xs text-muted-foreground">248 vehicles in stock</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View All
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>VIN</th>
              <th>Status</th>
              <th>Price</th>
              <th>Location</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle, index) => (
              <tr key={vehicle.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <td>
                  <div>
                    <p className="font-medium text-foreground">{vehicle.model}</p>
                    <p className="text-xs text-muted-foreground">{vehicle.variant}</p>
                  </div>
                </td>
                <td>
                  <span className="mono text-xs text-muted-foreground">{vehicle.vin}</span>
                </td>
                <td>
                  <span className={`badge-status ${statusConfig[vehicle.status].class}`}>
                    {statusConfig[vehicle.status].label}
                  </span>
                </td>
                <td>
                  <span className="mono font-medium">${vehicle.price.toLocaleString()}</span>
                </td>
                <td>
                  <span className="text-muted-foreground text-sm">{vehicle.location}</span>
                </td>
                <td>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
