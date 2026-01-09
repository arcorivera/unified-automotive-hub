import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PartsDashboard } from '@/components/parts/PartsDashboard';
import { PartsCatalog } from '@/components/parts/PartsCatalog';
import { PartDetail } from '@/components/parts/PartDetail';
import { WarehousesView } from '@/components/parts/WarehousesView';
import { PartsOrders } from '@/components/parts/PartsOrders';
import { PartsLocator } from '@/components/parts/PartsLocator';
import { PricingView } from '@/components/parts/PricingView';
import { ForecastingView } from '@/components/parts/ForecastingView';
import { 
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Search,
  DollarSign,
  TrendingUp
} from 'lucide-react';

const PartsDistribution = () => {
  const [activeModule, setActiveModule] = useState('parts');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showPartDetail, setShowPartDetail] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'catalog', label: 'Parts Catalog', icon: Package },
    { id: 'warehouses', label: 'Warehouses', icon: Warehouse },
    { id: 'orders', label: 'Orders', icon: ShoppingCart },
    { id: 'locator', label: 'Parts Locator', icon: Search },
    { id: 'pricing', label: 'Pricing', icon: DollarSign },
    { id: 'forecasting', label: 'Forecasting', icon: TrendingUp },
  ];

  const renderContent = () => {
    if (showPartDetail) {
      return <PartDetail onBack={() => setShowPartDetail(false)} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <PartsDashboard />;
      case 'catalog':
        return <PartsCatalog />;
      case 'warehouses':
        return <WarehousesView />;
      case 'orders':
        return <PartsOrders />;
      case 'locator':
        return <PartsLocator />;
      case 'pricing':
        return <PricingView />;
      case 'forecasting':
        return <ForecastingView />;
      default:
        return <PartsDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      
      <div className="pl-64">
        <Header />
        
        <main className="p-6">
          {/* Sub Navigation */}
          {!showPartDetail && (
            <div className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-secondary/50 p-1 h-auto flex-wrap">
                  {tabs.map((tab) => (
                    <TabsTrigger 
                      key={tab.id} 
                      value={tab.id}
                      className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}

          {/* Main Content */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default PartsDistribution;
