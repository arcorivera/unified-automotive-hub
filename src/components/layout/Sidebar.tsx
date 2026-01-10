import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Wrench, Users, DollarSign, Settings,
  Gauge, ShoppingCart, Star, Hammer, Shield,
  FileText, RefreshCcw, Search, BarChart3, ChevronDown,
  PlusCircle, ClipboardList, ArrowLeftRight, Printer,
  XCircle, FileSearch, Calculator, Barcode, LockKeyholeOpen,
  History, PrinterCheck, UserMinus, Scan, Truck, AlertTriangle,
  PauseCircle, FileCheck, FileOutput, Link2, AlertCircle,
  LayoutList, UserSearch, Clock, Receipt, ClipboardCheck, Files,
  ExternalLink, Ticket, PackageSearch, LineChart, RefreshCw, Settings2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const navItems = [
  { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
  {
    id: 'parts',
    label: 'PARTS',
    icon: Package,
    subItems: [
      {
        id: 'sales',
        label: 'Sales & Invoicing',
        icon: FileText,
        path: '/parts?tab=sales',
        deepItems: [
          { id: 'invoice-entry', label: 'Invoice Entry', icon: PlusCircle },
          { id: 'quotation-entry', label: 'Quotation Entry', icon: ClipboardList },
          { id: 'branch-transfer', label: 'Branch Transfer', icon: ArrowLeftRight },
          { id: 'reprint-quotation', label: 'Reprint Quotation', icon: Printer },
          { id: 'reprint-picking', label: 'Reprint Picking Slip', icon: Printer },
          { id: 'reprint-invoice', label: 'Reprint Invoice', icon: Printer },
          { id: 'lost-sales', label: 'Lost Sales', icon: XCircle },
          { id: 'consolidated-picking', label: 'Consolidated Picking Slip', icon: FileSearch },
          { id: 'close-document', label: 'Close One Document', icon: XCircle },
          { id: 'add-parts', label: 'Add Parts', icon: PackageSearch },
        ]
      },
      {
        id: 'reordering',
        label: 'Reordering Parts',
        icon: RefreshCcw,
        path: '/parts?tab=reordering',
        deepItems: [
          { id: 'reorder-calc', label: 'Reorder Calculation', icon: Calculator },
          { id: 'reorder-barcoders', label: 'Reorder Barcoders', icon: Barcode },
          { id: 'parts-order', label: 'Parts Order', icon: ShoppingCart },
          { id: 'reset-locked', label: 'Reset Locked Order', icon: LockKeyholeOpen },
          { id: 'recall-suspended', label: 'Recall Suspended Documents', icon: History },
          { id: 'print-extra', label: 'Print Extra Copies', icon: Printer },
          { id: 'print-deferred', label: 'Print Deferred Documents', icon: PrinterCheck },
          { id: 'cancel-cust-bo', label: 'Cancel Customer Backorders', icon: UserMinus },
          { id: 'cancel-rb', label: "Cancel 'RB' Barcode Quantities", icon: Scan },
          { id: 'cancel-supplier-bo', label: 'Cancel Supplier Backorder', icon: Truck },
          { id: 'cancel-receipts', label: 'Cancel Order/Suspended Receipts', icon: AlertTriangle },
          { id: 'resuspend-receipt', label: 'Re-suspend a Receipt', icon: PauseCircle },
          { id: 'parts-receipt', label: 'Parts Receipt', icon: FileCheck },
          { id: 'order-export', label: 'Parts Order Export', icon: FileOutput },
          { id: 'invoice-linking', label: 'Invoice Receipt Linking', icon: Link2 },
          { id: 'bo-reallocation', label: 'Backorder Reallocation', icon: ArrowLeftRight },
          { id: 'force-quantity', label: 'Stock Order Force Quantity', icon: AlertCircle },
        ]
      },
      {
        id: 'inquiries',
        label: 'Inquiries',
        icon: Search,
        path: '/parts?tab=inquiries',
        deepItems: [
          { id: 'parts-enquiry', label: 'Parts Enquiry', icon: Search },
          { id: 'bom-enquiry', label: 'BOM Enquiry', icon: LayoutList },
          { id: 'invoice-enquiry', label: 'Invoice Enquiry', icon: FileText },
          { id: 'parts-sales-enquiry', label: 'Parts Sales Enquiry', icon: BarChart3 },
          { id: 'customer-sales-enquiry', label: 'Customer Sales Enquiry', icon: UserSearch },
          { id: 'cust-backorder-enquiry', label: 'Customer Back Order Enquiry', icon: Clock },
          { id: 'cust-history-enquiry', label: 'Customer Product Sales History', icon: History },
          { id: 'supplier-inv-enquiry', label: "Supplier's Invoice Enquiry", icon: Receipt },
          { id: 'order-receipt-enquiry', label: 'Order/Receipt Enquiry', icon: ClipboardCheck },
          { id: 'supp-order-receipt-enquiry', label: 'Supplier Orders/Receipts Enquiry', icon: Truck },
          { id: 'doc-enquiry', label: 'Order and Receipting Documents', icon: Files },
          { id: 'supp-ref-enquiry', label: 'Supplier Reference Enquiry', icon: ExternalLink },
          { id: 'gift-cert-enquiry', label: 'Gift Certificate Enquiry', icon: Ticket },
        ]
      },
      {
        id: 'reports',
        label: 'Reports - Parts',
        icon: BarChart3,
        path: '/parts?tab=reports',
        deepItems: [
          { id: 'stock-reports', label: 'Stock Reports', icon: PackageSearch },
          { id: 'sales-reports', label: 'Sales Reports', icon: LineChart },
          { id: 'reordering-reports', label: 'Reordering Reports', icon: RefreshCw },
          { id: 'custom-reports', label: 'Custom Reports - Parts', icon: Settings2 },
        ]
      },
    ]
  },
  { id: 'services', label: 'SERVICES', icon: Wrench },
  { id: 'showroom', label: 'SHOWROOM', icon: ShoppingCart },
  { id: 'accounting', label: 'ACCOUNTING', icon: DollarSign },
  { id: 'crm', label: 'CRM', icon: Users },
  { id: 'favorites', label: 'FAVORITES', icon: Star },
  { id: 'tools', label: 'TOOLS', icon: Hammer },
];

export const Sidebar = ({ activeModule, onModuleChange }: { activeModule: string; onModuleChange: (m: string) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [partsOpen, setPartsOpen] = useState(activeModule === 'parts');
  const [expandedSub, setExpandedSub] = useState<string | null>(null);

  // Synchronize expanded state with URL on mount or location change
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const currentTab = params.get('tab');
    if (currentTab) {
      setExpandedSub(currentTab);
    }
  }, [location.search]);

  const handleDeepNavigation = (tab: string, sub: string) => {
    onModuleChange('parts');
    // We explicitly set both tab and sub to ensure PartsDistribution.tsx logic triggers correctly
    navigate(`/parts?tab=${tab}&sub=${sub}`);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="h-16 flex items-center px-4 border-b border-sidebar-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center mr-3">
          <Gauge className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-sm tracking-tight text-foreground uppercase">AutoDealer ERP</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
        <div className="space-y-1">
          {navItems.map((item) => (
            item.id === 'parts' ? (
              <Collapsible key={item.id} open={partsOpen} onOpenChange={setPartsOpen}>
                <CollapsibleTrigger asChild>
                  <button className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                    activeModule === 'parts' ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
                  )}>
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="flex-1 text-left text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", partsOpen ? "rotate-180" : "")} />
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent className="mt-1 ml-4 border-l border-sidebar-border pl-2 space-y-1 animate-in slide-in-from-top-2">
                  {item.subItems?.map((sub) => {
                    const isActiveSub = location.search.includes(`tab=${sub.id}`);
                    const isExpanded = expandedSub === sub.id;

                    return (
                      <div key={sub.id}>
                        <button
                          onClick={() => {
                            setExpandedSub(isExpanded ? null : sub.id);
                            // If it has deep items, we don't necessarily want to navigate yet, 
                            // or we navigate to the first sub-item by default
                            navigate(sub.path);
                          }}
                          className={cn(
                            "w-full flex items-center justify-between px-3 py-1.5 rounded-md text-[11px] font-bold transition-all",
                            isActiveSub ? "text-primary bg-primary/10" : "text-muted-foreground hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <sub.icon className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>{sub.label}</span>
                          </div>
                          {sub.deepItems && (
                            <ChevronDown className={cn("w-3 h-3 transition-transform", isExpanded ? "rotate-180" : "")} />
                          )}
                        </button>

                        {sub.deepItems && isExpanded && (
                          <div className="ml-5 mt-1 space-y-0.5 border-l border-primary/20 pl-2 animate-in slide-in-from-top-1">
                            {sub.deepItems.map((deep) => {
                              const isActiveDeep = location.search.includes(`sub=${deep.id}`);
                              return (
                                <button
                                  key={deep.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeepNavigation(sub.id, deep.id);
                                  }}
                                  className={cn(
                                    "w-full text-left px-2 py-1.5 text-[10px] rounded hover:bg-muted transition-all flex items-center gap-2",
                                    isActiveDeep ? "text-primary font-bold bg-primary/5" : "text-muted-foreground/70"
                                  )}
                                >
                                  <deep.icon className={cn("w-2.5 h-2.5", isActiveDeep ? "opacity-100" : "opacity-50")} />
                                  <span className="truncate">{deep.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <button
                key={item.id}
                onClick={() => {
                  onModuleChange(item.id);
                  setPartsOpen(false);
                  navigate(item.id === 'dashboard' ? '/' : `/${item.id}`);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all",
                  activeModule === item.id ? "text-primary bg-primary/5" : "text-muted-foreground hover:bg-muted"
                )}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span className="flex-1 text-left text-[11px] font-black uppercase tracking-widest">{item.label}</span>
              </button>
            )
          ))}
        </div>
      </nav>
    </aside>
  );
};