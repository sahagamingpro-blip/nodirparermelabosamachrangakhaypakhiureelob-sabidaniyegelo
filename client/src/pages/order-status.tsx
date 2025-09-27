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
  Calendar,
  IndianRupee,
  Loader2,
  MessageCircle,
  Download,
  User,
  Mail,
  Phone
} from 'lucide-react';
import { useLocation } from 'wouter';

// Helper functions
const formatIndianCurrency = (amount: number) => {
  return amount.toLocaleString('en-IN');
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

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
    case 'in_development':
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
    case 'in_development':
      return <Clock className="h-4 w-4" />;
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
          console.log('🔧 Orders data received:', data);
          data.forEach((order: any, index: number) => {
            console.log(`🔧 Order ${index + 1}:`, {
              id: order.id,
              status: order.status,
              download_file: order.download_file,
              hasDownloadFile: !!order.download_file
            });
          });
          setOrders(data);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect state
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
        <Card className="mb-8 border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center text-accent">
              <User className="h-5 w-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Name:</span>
                <span className="font-medium">{user.fullName}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Email:</span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Phone:</span>
                <span className="font-medium">{user.phone}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground mr-2">Date of Birth:</span>
                <span className="font-medium">{user.dateOfBirth || 'No Data'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders */}
        <div className="space-y-6">
          {ordersLoading ? (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading your orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Crown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't placed any orders yet. Start by ordering your first YONO SLOT game!
                </p>
                <Button onClick={() => setLocation('/order')} className="bg-accent text-black hover:bg-accent/90">
                  <Crown className="h-4 w-4 mr-2" />
                  Order Now
                </Button>
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="border-accent/20">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-accent">Order #{order.id.slice(0, 8)}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
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
                    
                    {order.status === 'completed' && order.download_file && (
                      <Button 
                        className="flex-1 bg-green hover:bg-grey/90"
                        onClick={() => {
                          window.open(order.download_file, '_blank', 'noopener,noreferrer');
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
}
