import { Wrench, Clock, User, Car, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface ServiceOrder {
  id: string;
  jobNumber: string;
  vehicle: string;
  customer: string;
  type: string;
  technician: string;
  status: 'pending' | 'in-progress' | 'completed' | 'waiting-parts';
  progress: number;
  estimatedCompletion: string;
}

const serviceOrders: ServiceOrder[] = [
  { id: '1', jobNumber: 'SVC-2024-001', vehicle: 'BMW 320i (ABC 1234)', customer: 'John Smith', type: 'Major Service', technician: 'Mike T.', status: 'in-progress', progress: 65, estimatedCompletion: '2:30 PM' },
  { id: '2', jobNumber: 'SVC-2024-002', vehicle: 'Mercedes C200 (XYZ 5678)', customer: 'Sarah Johnson', type: 'Brake Replacement', technician: 'Alex R.', status: 'waiting-parts', progress: 30, estimatedCompletion: '4:00 PM' },
  { id: '3', jobNumber: 'SVC-2024-003', vehicle: 'Audi A4 (DEF 9012)', customer: 'Michael Brown', type: 'Oil Change', technician: 'Chris L.', status: 'pending', progress: 0, estimatedCompletion: '11:00 AM' },
  { id: '4', jobNumber: 'SVC-2024-004', vehicle: 'Porsche 911 (LUX 0001)', customer: 'Emily Davis', type: 'Annual Inspection', technician: 'Mike T.', status: 'completed', progress: 100, estimatedCompletion: 'Done' },
];

const statusConfig = {
  'pending': { label: 'Pending', class: 'badge-warning' },
  'in-progress': { label: 'In Progress', class: 'badge-primary' },
  'completed': { label: 'Completed', class: 'badge-success' },
  'waiting-parts': { label: 'Waiting Parts', class: 'badge-destructive' },
};

export const ServiceOrders = () => {
  return (
    <div className="module-card">
      <div className="p-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10">
            <Wrench className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Active Service Orders</h3>
            <p className="text-xs text-muted-foreground">12 jobs today</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
          View All
        </Button>
      </div>
      
      <div className="p-4 space-y-4">
        {serviceOrders.map((order, index) => (
          <div 
            key={order.id} 
            className="p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/20 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="mono text-sm font-medium text-primary">{order.jobNumber}</span>
                  <span className={`badge-status ${statusConfig[order.status].class}`}>
                    {statusConfig[order.status].label}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{order.type}</p>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{order.vehicle}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.technician}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{order.estimatedCompletion}</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{order.progress}%</span>
              </div>
              <Progress value={order.progress} className="h-1.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
