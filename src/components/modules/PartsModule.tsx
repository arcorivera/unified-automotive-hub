import { useState } from 'react';
import {
    FileText,
    RefreshCcw,
    Search,
    BarChart3,
    Plus,
    ArrowUpRight,
    ArrowDownLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

const tabs = [
    { id: 'sales', label: 'Sales & Invoicing', icon: FileText },
    { id: 'reordering', label: 'Reordering Parts', icon: RefreshCcw },
    { id: 'enquiries', label: 'Inquiries', icon: Search },
    { id: 'reports', label: 'Reports - Parts', icon: BarChart3 },
];

export const PartsModule = () => {
    const [activeTab, setActiveTab] = useState('sales');

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">PARTS MANAGEMENT</h1>
                <p className="text-muted-foreground text-sm uppercase tracking-widest">Enterprise Logistics & Inventory</p>
            </div>

            {/* Internal Navigation Tabs */}
            <div className="flex space-x-1 bg-muted/50 p-1 rounded-lg w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all",
                            activeTab === tab.id
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                        )}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="mt-6 border rounded-xl bg-card min-h-[400px] p-6 shadow-sm">
                {activeTab === 'sales' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Invoices & Counter Sales</h2>
                            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
                                <Plus className="w-4 h-4" /> New Invoice
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 border rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground uppercase font-bold">Today's Sales</p>
                                <p className="text-2xl font-bold">$12,450.00</p>
                            </div>
                            <div className="p-4 border rounded-lg bg-muted/30">
                                <p className="text-xs text-muted-foreground uppercase font-bold">Pending Pickups</p>
                                <p className="text-2xl font-bold">14 Items</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'reordering' && (
                    <div className="space-y-4 text-center py-12">
                        <RefreshCcw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h2 className="text-xl font-semibold">Stock Reordering</h2>
                        <p className="text-muted-foreground max-w-md mx-auto">
                            Automated reorder triggers for items below safety stock levels.
                        </p>
                    </div>
                )}

                {/* Placeholders for other tabs... */}
                {(activeTab === 'enquiries' || activeTab === 'reports') && (
                    <div className="flex items-center justify-center h-full py-20 text-muted-foreground">
                        Module Content for {activeTab.toUpperCase()} Loading...
                    </div>
                )}
            </div>
        </div>
    );
};