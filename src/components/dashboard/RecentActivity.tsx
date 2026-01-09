import { 
  Car, 
  Wrench, 
  Package, 
  DollarSign, 
  User, 
  FileCheck,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'sale' | 'service' | 'parts' | 'payment' | 'customer' | 'document';
  title: string;
  description: string;
  timestamp: string;
  user: string;
}

const activities: Activity[] = [
  { id: '1', type: 'sale', title: 'New Vehicle Sale', description: 'BMW 530i M Sport sold to John Smith', timestamp: '5 min ago', user: 'Sarah M.' },
  { id: '2', type: 'service', title: 'Service Completed', description: 'Annual inspection completed for Porsche 911', timestamp: '15 min ago', user: 'Mike T.' },
  { id: '3', type: 'parts', title: 'Parts Order Received', description: '50 units of brake pads arrived from supplier', timestamp: '32 min ago', user: 'System' },
  { id: '4', type: 'payment', title: 'Payment Received', description: '$12,500 received for invoice INV-2024-089', timestamp: '1 hour ago', user: 'Finance' },
  { id: '5', type: 'customer', title: 'New Customer Registered', description: 'Michael Brown registered via website', timestamp: '2 hours ago', user: 'System' },
  { id: '6', type: 'document', title: 'Warranty Claim Approved', description: 'Claim #WC-2024-056 approved for $2,340', timestamp: '3 hours ago', user: 'Admin' },
];

const typeConfig = {
  'sale': { icon: Car, color: 'bg-primary text-primary-foreground' },
  'service': { icon: Wrench, color: 'bg-warning text-warning-foreground' },
  'parts': { icon: Package, color: 'bg-success text-success-foreground' },
  'payment': { icon: DollarSign, color: 'bg-accent text-accent-foreground' },
  'customer': { icon: User, color: 'bg-secondary text-secondary-foreground' },
  'document': { icon: FileCheck, color: 'bg-muted text-muted-foreground' },
};

export const RecentActivity = () => {
  return (
    <div className="module-card h-full">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Clock className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Recent Activity</h3>
            <p className="text-xs text-muted-foreground">Latest updates across all modules</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-2 bottom-2 w-px bg-border" />
          
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const config = typeConfig[activity.type];
              const Icon = config.icon;
              
              return (
                <div 
                  key={activity.id} 
                  className="relative pl-10 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Timeline dot */}
                  <div className={cn(
                    "absolute left-2 top-1 w-5 h-5 rounded-full flex items-center justify-center",
                    config.color
                  )}>
                    <Icon className="w-3 h-3" />
                  </div>
                  
                  <div className="group">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{activity.timestamp}</span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{activity.user}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
