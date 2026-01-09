import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { KPICard } from '@/components/dashboard/KPICard';
import { VehicleInventory } from '@/components/dashboard/VehicleInventory';
import { ServiceOrders } from '@/components/dashboard/ServiceOrders';
import { PartsOverview } from '@/components/dashboard/PartsOverview';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { SalesChart } from '@/components/dashboard/SalesChart';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { 
  Car, 
  DollarSign, 
  Wrench, 
  Package,
  Users,
  TrendingUp
} from 'lucide-react';

const Index = () => {
  const [activeModule, setActiveModule] = useState('dashboard');

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="pl-64">
        <Header />
        
        <main className="p-6">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Welcome back! Here's what's happening today.</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <QuickActions />
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            <KPICard
              title="Today's Sales"
              value="$125,480"
              change={12.5}
              changeLabel="vs yesterday"
              trend="up"
              icon={<DollarSign className="w-5 h-5 text-primary" />}
            />
            <KPICard
              title="Vehicles Sold"
              value="8"
              change={33.3}
              changeLabel="this week"
              trend="up"
              icon={<Car className="w-5 h-5 text-primary" />}
            />
            <KPICard
              title="Active Services"
              value="12"
              change={-8.3}
              changeLabel="vs last week"
              trend="down"
              icon={<Wrench className="w-5 h-5 text-warning" />}
            />
            <KPICard
              title="Parts Orders"
              value="156"
              change={5.2}
              changeLabel="this month"
              trend="up"
              icon={<Package className="w-5 h-5 text-success" />}
            />
            <KPICard
              title="New Customers"
              value="24"
              change={18.7}
              changeLabel="this week"
              trend="up"
              icon={<Users className="w-5 h-5 text-accent" />}
            />
            <KPICard
              title="Revenue MTD"
              value="$1.2M"
              change={22.4}
              changeLabel="vs last month"
              trend="up"
              icon={<TrendingUp className="w-5 h-5 text-primary" />}
            />
          </div>

          {/* Sales Chart */}
          <div className="mb-6">
            <SalesChart />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Vehicle Inventory - Takes 2 columns */}
            <div className="lg:col-span-2">
              <VehicleInventory />
            </div>
            
            {/* Parts Overview */}
            <div className="lg:col-span-1">
              <PartsOverview />
            </div>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Service Orders - Takes 2 columns */}
            <div className="lg:col-span-2">
              <ServiceOrders />
            </div>
            
            {/* Recent Activity */}
            <div className="lg:col-span-1">
              <RecentActivity />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
