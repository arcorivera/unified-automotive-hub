import { useState } from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Package, 
  Wrench, 
  Building2, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Gauge,
  ShoppingCart,
  Warehouse,
  FileText,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: number;
  children?: { id: string; label: string }[];
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'dealer', label: 'Dealer Management', icon: Building2, badge: 3 },
  { id: 'sales', label: 'Sales & Showroom', icon: ShoppingCart, badge: 12 },
  { id: 'parts', label: 'Parts Distribution', icon: Package, badge: 23 },
  { id: 'service', label: 'Aftersales & Service', icon: Wrench, badge: 8 },
  { id: 'erp', label: 'Enterprise (ERP)', icon: Warehouse },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'finance', label: 'Finance & Admin', icon: DollarSign },
  { id: 'analytics', label: 'Analytics & BI', icon: BarChart3 },
  { id: 'professional', label: 'Professional Services', icon: FileText },
];

const bottomItems: NavItem[] = [
  { id: 'security', label: 'Security & Audit', icon: Shield },
  { id: 'settings', label: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
}

export const Sidebar = ({ activeModule, onModuleChange }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-50",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Gauge className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-foreground text-sm">AutoDealer</h1>
              <p className="text-[10px] text-muted-foreground">Enterprise Platform</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto">
            <Gauge className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <div className="space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={cn(
                "w-full nav-item group",
                activeModule === item.id && "active"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={cn(
                "w-5 h-5 flex-shrink-0",
                activeModule === item.id ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
              )} />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.badge && (
                    <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Bottom Navigation */}
      <div className="border-t border-sidebar-border py-4 px-2">
        <div className="space-y-1">
          {bottomItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onModuleChange(item.id)}
              className={cn(
                "w-full nav-item group",
                activeModule === item.id && "active"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 text-muted-foreground group-hover:text-foreground" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-muted transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
    </aside>
  );
};
