import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown,
  Clock,
  CheckCircle,
  XCircle,
  Package,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  IndianRupee,
  ExternalLink,
  Loader2,
  MessageCircle,
  Download
} from 'lucide-react';
import { useLocation } from 'wouter';

// Indian number formatting function
const formatIndianCurrency = (amount: number) => {
  return amount.toLocaleString('en-IN');
};

// Helper function to format date in DD/MM/YYYY format
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper function to format time
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'processing':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4" />;
    case 'processing':
      return <Package className="h-4 w-4" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4" />;
    case 'cancelled':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

export default function OrderStatusPage() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Handle redirect for unauthenticated users
  React.useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  // Fetch user orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        const response = await fetch('/api/orders', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders');
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Render loading state
  const renderLoadingState = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  // Render redirect state
  const renderRedirectState = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );

  // Render main order status page content
  const renderOrderStatusPage = () => {
    if (!user) return null; // This should never happen due to the conditional rendering, but satisfies TypeScript
    
    return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-accent mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Order Status
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Track your YONO SLOT game orders and delivery status
          </p>
        </div>

        {/* User Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2 text-accent" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.fullName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{user.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10a2 2 0 002 2h4a2 2 0 002-2V11M8 7h8" />
                </svg>
                <span className="text-sm">{user.dateOfBirth || 'Not provided'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders List */}
        <div className="space-y-6">
          {ordersLoading ? (
            <Card className="p-12 text-center">
              <Loader2 className="h-16 w-16 text-accent animate-spin mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Loading Orders...</h3>
              <p className="text-muted-foreground">Please wait while we fetch your order history.</p>
            </Card>
          ) : orders.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No Orders Yet</h3>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet. Start by ordering your YONO SLOT game package.
              </p>
              <Button onClick={() => setLocation('/order')}>
                <Crown className="h-4 w-4 mr-2" />
                Order YONO SLOT
              </Button>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="bg-muted/50">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <CardTitle className="flex items-center">
                      <Crown className="h-5 w-5 mr-2 text-accent" />
                      {order.game_name || 'YONO SLOT Game'} - Order #{order.id}
                    </CardTitle>
                    <Badge className={`w-fit ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {/* Personal Details */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 text-accent">Personal Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{order.name || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="font-medium">{order.email || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{order.phone || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Company Name:</span>
                        <span className="font-medium">{order.company || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Country:</span>
                        <span className="font-medium">{order.country || 'No Data'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Details */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 text-accent">Game Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Game Name:</span>
                        <span className="font-medium">{order.game_name || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Game Support Email:</span>
                        <span className="font-medium">{order.game_support_email || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Telegram ID:</span>
                        <span className="font-medium">{order.telegram_id || 'No Data'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">WhatsApp Number:</span>
                        <span className="font-medium">{order.whatsapp_number || 'No Data'}</span>
                      </div>
                      <div className="col-span-full">
                        <div className="flex flex-col">
                          <span className="text-muted-foreground mb-2">Custom Message:</span>
                          <span className="font-medium bg-muted p-3 rounded-lg">
                            {order.additional_requirements || 'No Data'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 text-accent">Payment Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <div className="flex items-center">
                          <IndianRupee className="h-4 w-4 mr-1" />
                          <span className="font-medium">{formatIndianCurrency(order.amount)}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">USDT Paid:</span>
                        <span className="font-medium">{order.usdt_amount || 'No Data'} USDT</span>
                      </div>
                      <div className="col-span-full">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Transaction ID:</span>
                          <code className="text-xs bg-muted px-3 py-2 rounded">{order.transaction_id || 'No Data'}</code>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Milestone Display - Modern Card Design */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 text-accent">Latest Update</h4>
                    <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
                      <CardContent className="p-6">
                        {order.milestone ? (
                          <div className="space-y-3">
                            <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                              <div className="flex-1">
                                <p className="text-sm leading-relaxed text-foreground">
                                  {order.milestone}
                                </p>
                                <div className="flex items-center mt-3 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  <span>
                                    Updated: {formatDate(order.updated_at)} at {formatTime(order.updated_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                              <Clock className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-muted-foreground">No Updates Right Now</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              We'll update you as soon as there's progress on your order
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Timeline */}
                  <div className="mb-8">
                    <h4 className="font-semibold text-lg mb-4 text-accent">Order Timeline</h4>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium">Order Placed</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(order.created_at)} at {formatTime(order.created_at)}
                            </p>
                          </div>
                        </div>
                        
                        {order.status === 'completed' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">Order Completed</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDate(order.updated_at)} at {formatTime(order.updated_at)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                    <Button 
                      variant="outline" 
                      className="flex-1 border-accent text-accent hover:bg-accent/10"
                      onClick={() => setLocation('/contact')}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    
                    {order.status === 'completed' && (
                      <Button 
                        className="flex-1 bg-accent hover:bg-accent/90"
                        onClick={() => {
                          // This would typically download files or redirect to download page
                          alert('Game files download will be available here');
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Game Files
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* New Order Button */}
        <div className="text-center mt-12">
          <Button 
            size="lg" 
            onClick={() => setLocation('/order')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            <Crown className="h-5 w-5 mr-2" />
            Order New Game
          </Button>
        </div>
      </div>
    </section>
  );

  // Always render based on state, no early returns
  if (isLoading) {
    return renderLoadingState();
  }

  if (!user) {
    return renderRedirectState();
  }

  return renderOrderStatusPage();
}

