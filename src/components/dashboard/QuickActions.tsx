import { 
  Plus, 
  Car, 
  Wrench, 
  Package, 
  Users, 
  FileText,
  Calendar,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const quickActions: QuickAction[] = [
  { id: 'new-sale', label: 'New Sale', description: 'Create vehicle sale', icon: Car, color: 'text-primary' },
  { id: 'new-service', label: 'New Service', description: 'Open job order', icon: Wrench, color: 'text-warning' },
  { id: 'parts-order', label: 'Parts Order', description: 'Purchase parts', icon: Package, color: 'text-success' },
  { id: 'new-customer', label: 'Add Customer', description: 'Register customer', icon: Users, color: 'text-accent' },
  { id: 'new-quote', label: 'New Quote', description: 'Create quotation', icon: FileText, color: 'text-primary' },
  { id: 'schedule', label: 'Schedule', description: 'Book appointment', icon: Calendar, color: 'text-warning' },
  { id: 'parts-locator', label: 'Parts Locator', description: 'Find parts', icon: Search, color: 'text-success' },
];

export const QuickActions = () => {
  return (
    <div className="module-card p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Plus className="w-4 h-4 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground text-sm">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {quickActions.map((action, index) => (
          <Button
            key={action.id}
            variant="ghost"
            className="h-auto py-3 px-2 flex flex-col items-center gap-2 hover:bg-secondary/50 animate-fade-in"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <div className={`p-2 rounded-lg bg-secondary ${action.color}`}>
              <action.icon className="w-4 h-4" />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-foreground">{action.label}</p>
              <p className="text-[10px] text-muted-foreground">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};
