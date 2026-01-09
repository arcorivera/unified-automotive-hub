import { useState } from 'react';
import { 
  ShoppingCart, 
  ArrowRightLeft, 
  Building2, 
  Filter,
  ChevronDown,
  ChevronRight,
  Check,
  Clock,
  Truck,
  Package,
  X,
  Plus,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Order {
  id: string;
  type: 'purchase' | 'transfer' | 'dealer';
  reference: string;
  source: string;
  destination: string;
  items: number;
  totalValue: number;
  status: 'draft' | 'pending' | 'approved' | 'in-transit' | 'completed' | 'cancelled';
  createdAt: string;
  eta?: string;
  createdBy: string;
  timeline: TimelineEvent[];
}

interface TimelineEvent {
  status: string;
  date: string;
  user: string;
  note?: string;
}

const orders: Order[] = [
  {
    id: '1',
    type: 'purchase',
    reference: 'PO-2024-0156',
    source: 'Toyota Parts Co.',
    destination: 'Main Warehouse',
    items: 45,
    totalValue: 12450.00,
    status: 'in-transit',
    createdAt: '2024-01-05',
    eta: '2024-01-10',
    createdBy: 'John Smith',
    timeline: [
      { status: 'Created', date: '2024-01-05 09:00', user: 'John Smith' },
      { status: 'Approved', date: '2024-01-05 14:30', user: 'Manager' },
      { status: 'Shipped', date: '2024-01-07 10:00', user: 'Toyota Parts Co.', note: 'Tracking: TRK123456' },
    ]
  },
  {
    id: '2',
    type: 'transfer',
    reference: 'TR-2024-0089',
    source: 'Main Warehouse',
    destination: 'North Branch',
    items: 120,
    totalValue: 8900.00,
    status: 'pending',
    createdAt: '2024-01-08',
    createdBy: 'Maria Garcia',
    timeline: [
      { status: 'Created', date: '2024-01-08 11:00', user: 'Maria Garcia' },
    ]
  },
  {
    id: '3',
    type: 'dealer',
    reference: 'DD-2024-0034',
    source: 'East Branch Dealer',
    destination: 'Main Warehouse',
    items: 25,
    totalValue: 3200.00,
    status: 'approved',
    createdAt: '2024-01-07',
    eta: '2024-01-12',
    createdBy: 'David Lee',
    timeline: [
      { status: 'Requested', date: '2024-01-07 15:00', user: 'East Branch Dealer' },
      { status: 'Approved', date: '2024-01-08 09:30', user: 'David Lee' },
    ]
  },
  {
    id: '4',
    type: 'purchase',
    reference: 'PO-2024-0155',
    source: 'Bosch Automotive',
    destination: 'South Distribution',
    items: 78,
    totalValue: 15600.00,
    status: 'completed',
    createdAt: '2024-01-02',
    createdBy: 'Sarah Johnson',
    timeline: [
      { status: 'Created', date: '2024-01-02 10:00', user: 'Sarah Johnson' },
      { status: 'Approved', date: '2024-01-02 11:30', user: 'Manager' },
      { status: 'Shipped', date: '2024-01-03 14:00', user: 'Bosch Automotive' },
      { status: 'Received', date: '2024-01-06 09:00', user: 'Warehouse Staff' },
    ]
  },
  {
    id: '5',
    type: 'purchase',
    reference: 'PO-2024-0157',
    source: 'NGK Spark Plugs',
    destination: 'Main Warehouse',
    items: 200,
    totalValue: 4500.00,
    status: 'draft',
    createdAt: '2024-01-09',
    createdBy: 'John Smith',
    timeline: [
      { status: 'Draft Created', date: '2024-01-09 08:00', user: 'John Smith' },
    ]
  },
];

const statusSteps = ['draft', 'pending', 'approved', 'in-transit', 'completed'];

export const PartsOrders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <Check className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'completed': return <Package className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const styles = {
      draft: 'bg-muted text-muted-foreground',
      pending: 'badge-warning',
      approved: 'badge-primary',
      'in-transit': 'bg-accent/20 text-accent',
      completed: 'badge-success',
      cancelled: 'badge-destructive',
    };
    return (
      <span className={cn("badge-status", styles[status])}>
        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getTypeIcon = (type: Order['type']) => {
    switch (type) {
      case 'purchase': return <ShoppingCart className="w-4 h-4 text-primary" />;
      case 'transfer': return <ArrowRightLeft className="w-4 h-4 text-accent" />;
      case 'dealer': return <Building2 className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusStep = (status: Order['status']) => {
    if (status === 'cancelled') return -1;
    return statusSteps.indexOf(status);
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.type === activeTab;
  }).filter(order => 
    order.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Parts Orders</h2>
          <p className="text-muted-foreground text-sm">Purchase orders, transfers, and dealer requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Order
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList className="bg-secondary">
            <TabsTrigger value="all" className="gap-2">
              All Orders
              <Badge variant="secondary" className="ml-1 text-xs">{orders.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="purchase" className="gap-2">
              <ShoppingCart className="w-4 h-4" />
              Purchase Orders
            </TabsTrigger>
            <TabsTrigger value="transfer" className="gap-2">
              <ArrowRightLeft className="w-4 h-4" />
              Transfers
            </TabsTrigger>
            <TabsTrigger value="dealer" className="gap-2">
              <Building2 className="w-4 h-4" />
              Dealer Requests
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input 
              placeholder="Search orders..."
              className="w-64 bg-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="module-card overflow-hidden">
                {/* Order Header */}
                <div 
                  className="p-4 cursor-pointer hover:bg-secondary/30 transition-colors"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="p-1">
                        <ChevronRight className={cn(
                          "w-4 h-4 text-muted-foreground transition-transform",
                          expandedOrder === order.id && "rotate-90"
                        )} />
                      </button>
                      <div className="p-2 rounded-lg bg-secondary">
                        {getTypeIcon(order.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mono text-primary font-medium">{order.reference}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <span>{order.source}</span>
                          <span>→</span>
                          <span>{order.destination}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="mono text-foreground font-medium">${order.totalValue.toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground">{order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-foreground">{order.createdAt}</p>
                        {order.eta && order.status !== 'completed' && (
                          <p className="text-xs text-muted-foreground">ETA: {order.eta}</p>
                        )}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="w-4 h-4" />
                            View Details
                          </DropdownMenuItem>
                          {order.status === 'draft' && (
                            <DropdownMenuItem className="gap-2">
                              <Check className="w-4 h-4" />
                              Submit for Approval
                            </DropdownMenuItem>
                          )}
                          {order.status === 'pending' && (
                            <DropdownMenuItem className="gap-2 text-success">
                              <Check className="w-4 h-4" />
                              Approve
                            </DropdownMenuItem>
                          )}
                          {order.status === 'in-transit' && (
                            <DropdownMenuItem className="gap-2">
                              <Package className="w-4 h-4" />
                              Mark as Received
                            </DropdownMenuItem>
                          )}
                          {order.status !== 'completed' && order.status !== 'cancelled' && (
                            <DropdownMenuItem className="gap-2 text-destructive">
                              <X className="w-4 h-4" />
                              Cancel Order
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Progress Steps */}
                  {order.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 mt-4 ml-12">
                      {statusSteps.map((step, index) => (
                        <div key={step} className="flex items-center gap-2">
                          <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs",
                            index <= getStatusStep(order.status) 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-secondary text-muted-foreground"
                          )}>
                            {index < getStatusStep(order.status) ? (
                              <Check className="w-3 h-3" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <span className={cn(
                            "text-xs capitalize hidden md:inline",
                            index <= getStatusStep(order.status) ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {step.replace('-', ' ')}
                          </span>
                          {index < statusSteps.length - 1 && (
                            <div className={cn(
                              "w-8 h-0.5 hidden md:block",
                              index < getStatusStep(order.status) ? "bg-primary" : "bg-secondary"
                            )} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Expanded Content */}
                {expandedOrder === order.id && (
                  <div className="border-t border-border p-4 bg-secondary/20 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Order Details */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Order Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Created By</span>
                            <span className="text-foreground">{order.createdBy}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Order Type</span>
                            <span className="text-foreground capitalize">{order.type} Order</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Items</span>
                            <span className="mono text-foreground">{order.items}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Value</span>
                            <span className="mono text-success">${order.totalValue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Timeline */}
                      <div>
                        <h4 className="font-medium text-foreground mb-3">Activity Timeline</h4>
                        <div className="space-y-3">
                          {order.timeline.map((event, index) => (
                            <div key={index} className="flex items-start gap-3">
                              <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                              <div>
                                <p className="text-sm text-foreground">{event.status}</p>
                                <p className="text-xs text-muted-foreground">
                                  {event.date} by {event.user}
                                </p>
                                {event.note && (
                                  <p className="text-xs text-muted-foreground mt-1">{event.note}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <Button variant="outline" size="sm">View Full Details</Button>
                      {order.status === 'pending' && (
                        <Button size="sm" className="gap-2">
                          <Check className="w-4 h-4" />
                          Approve Order
                        </Button>
                      )}
                      {order.status === 'in-transit' && (
                        <Button size="sm" className="gap-2">
                          <Package className="w-4 h-4" />
                          Confirm Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="module-card p-12 text-center">
              <ShoppingCart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                There are no orders matching your criteria
              </p>
              <Button>Create New Order</Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
