import { Bell, Search, User, ChevronDown, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const Header = () => {
  return (
    <header className="h-16 bg-card/50 backdrop-blur-xl border-b border-border flex items-center justify-between px-6">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search vehicles, parts, customers, orders..." 
            className="pl-10 bg-secondary/50 border-border/50 focus:border-primary/50"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Branch Selector */}
        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground">
          <Building className="w-4 h-4" />
          <span className="text-sm">Main Branch</span>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
        </Button>

        {/* User Menu */}
        <Button variant="ghost" className="gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">Admin User</p>
            <p className="text-xs text-muted-foreground">Super Admin</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
};
