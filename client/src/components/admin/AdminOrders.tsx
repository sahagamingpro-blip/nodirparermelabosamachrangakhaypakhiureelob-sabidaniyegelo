import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Edit, 
  Trash2, 
  ShoppingCart,
  User,
  Calendar,
  DollarSign,
  FileText,
  ExternalLink
} from "lucide-react";

interface Order {
  id: string;
  user_id: number;
  username: string;
  user_full_name: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  game_type: string;
  target_platform: string;
  budget: string;
  timeline: string;
  game_name: string;
  game_logo: string;
  game_support_email: string;
  telegram_id: string;
  whatsapp_number: string;
  additional_requirements: string;
  status: string;
  amount: number;
  usdt_amount: number;
  transaction_id: string;
  transaction_screenshot: string;
  terms_accepted: boolean;
  milestone: string;
  download_file: string;
  created_at: string;
  updated_at: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

export default function AdminOrders() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newMilestone, setNewMilestone] = useState("");
  const [newDownloadFile, setNewDownloadFile] = useState("");
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders", currentPage],
    queryFn: async () => {
      const response = await fetch(`/api/admin/orders?page=${currentPage}&limit=${itemsPerPage}`, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      return response.json() as Promise<OrdersResponse>;
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to update order status");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const updateOrderMilestoneMutation = useMutation({
    mutationFn: async ({ orderId, status, milestone, downloadFile }: { orderId: string; status: string; milestone: string; downloadFile?: string }) => {
      const requestBody = { status, milestone, download_file: downloadFile };
      
      console.log('🔧 Frontend sending update request:', {
        orderId,
        requestBody,
        downloadFile
      });
      
      const response = await fetch(`/api/admin/orders/${orderId}/milestone`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        credentials: "include",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Update failed:', errorData);
        throw new Error(errorData.error || "Failed to update order milestone");
      }
      
      const result = await response.json();
      console.log('✅ Update successful:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      setEditDialogOpen(false);
      setSelectedOrder(null);
      alert("Order updated successfully!");
    },
    onError: (error: Error) => {
      alert(`Error updating order: ${error.message}`);
    },
  });

  const deleteOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to delete order");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewMilestone(order.milestone || "");
    setNewDownloadFile(order.download_file || "");
    setEditDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      await updateOrderMilestoneMutation.mutateAsync({
        orderId: selectedOrder.id,
        status: newStatus,
        milestone: newMilestone,
        downloadFile: newDownloadFile,
      });
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await deleteOrderMutation.mutateAsync(orderId);
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, color: "text-orange-600" },
      payment_verified: { variant: "default" as const, color: "text-blue-600" },
      in_development: { variant: "default" as const, color: "text-purple-600" },
      testing: { variant: "default" as const, color: "text-yellow-600" },
      completed: { variant: "default" as const, color: "text-green-600" },
      cancelled: { variant: "destructive" as const, color: "text-red-600" },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    const displayText = status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {displayText}
      </Badge>
    );
  };

  const filteredOrders = ordersData?.orders.filter(order =>
    order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.game_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const totalPages = Math.ceil((ordersData?.total || 0) / itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Orders Management</h2>
          <p className="text-muted-foreground">
            Manage customer orders, update status and milestones
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-3 py-1">
          <ShoppingCart className="mr-2 h-4 w-4" />
          {ordersData?.total || 0} Total Orders
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>
            View and manage all customer orders
          </CardDescription>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Game Details</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8">
                          <div className="flex flex-col items-center space-y-2">
                            <ShoppingCart className="h-8 w-8 text-muted-foreground" />
                            <p className="text-muted-foreground">No orders found</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">
                            <div className="text-xs text-muted-foreground">
                              {order.id.slice(0, 8)}...
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <User className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{order.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">{order.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="font-medium">{order.game_name}</div>
                              <div className="text-xs text-muted-foreground">
                                {order.game_type} • {order.target_platform}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Budget: {order.budget} • Timeline: {order.timeline}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <DollarSign className="h-3 w-3 text-muted-foreground" />
                                <span className="font-medium">{formatCurrency(order.amount)}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {order.usdt_amount} USDT
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(order.status)}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm font-mono">{order.transaction_id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{formatDate(order.created_at)}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Order</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this order? 
                                      This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteOrder(order.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, ordersData?.total || 0)} of {ordersData?.total || 0} orders
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(totalPages, 5))].map((_, i) => {
                        const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                        if (pageNum > totalPages) return null;
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNum)}
                            className="w-8 h-8 p-0"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Edit Order Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>
              Update order status and milestone information
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4">
              {/* Customer & Game Info - Compact Grid */}
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div>
                  <Label className="text-xs">Customer</Label>
                  <div className="font-medium">{selectedOrder.name}</div>
                  <div className="text-muted-foreground">{selectedOrder.email}</div>
                </div>
                <div>
                  <Label className="text-xs">Game</Label>
                  <div className="font-medium">{selectedOrder.game_name}</div>
                  <div className="text-muted-foreground">{selectedOrder.game_type}</div>
                </div>
                <div>
                  <Label className="text-xs">Payment</Label>
                  <div className="font-medium">{formatCurrency(selectedOrder.amount)}</div>
                  <div className="text-muted-foreground">{selectedOrder.usdt_amount} USDT</div>
                </div>
              </div>

              {/* Additional Details - Collapsible */}
              <details className="border rounded-md">
                <summary className="p-3 cursor-pointer font-medium text-sm bg-muted/50">
                  View Full Order Details
                </summary>
                <div className="p-3 space-y-3">
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <Label className="text-xs">Phone</Label>
                      <div>{selectedOrder.phone}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Company</Label>
                      <div>{selectedOrder.company || 'N/A'}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Country</Label>
                      <div>{selectedOrder.country}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Platform</Label>
                      <div>{selectedOrder.target_platform}</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <Label className="text-xs">Budget</Label>
                      <div>{selectedOrder.budget}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Timeline</Label>
                      <div>{selectedOrder.timeline}</div>
                    </div>
                    <div>
                      <Label className="text-xs">Transaction ID</Label>
                      <div className="font-mono text-xs">{selectedOrder.transaction_id}</div>
                    </div>
                  </div>

                  {/* Game Logo and Transaction Screenshot */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-xs">Game Logo</Label>
                      <div className="mt-1">
                        {selectedOrder.game_logo ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://a2z.dog${selectedOrder.game_logo}`, '_blank', 'noopener,noreferrer')}
                            className="text-xs h-7"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">No Data</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Transaction Screenshot</Label>
                      <div className="mt-1">
                        {selectedOrder.transaction_screenshot ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://a2z.dog${selectedOrder.transaction_screenshot}`, '_blank', 'noopener,noreferrer')}
                            className="text-xs h-7"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-xs">No Data</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {selectedOrder.additional_requirements && (
                    <div>
                      <Label className="text-xs">Additional Requirements</Label>
                      <div className="text-sm bg-muted p-2 rounded text-xs">
                        {selectedOrder.additional_requirements}
                      </div>
                    </div>
                  )}
                </div>
              </details>

              {/* Current Milestone */}
              {selectedOrder.milestone && (
                <div>
                  <Label className="text-sm">Current Milestone</Label>
                  <div className="text-sm  p-2 rounded-md border">
                    {selectedOrder.milestone}
                  </div>
                </div>
              )}
              
              {/* Status and Milestone Update - Main Section */}
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Update Order Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="payment_verified">Payment Verified</SelectItem>
                        <SelectItem value="in_development">In Development</SelectItem>
                        <SelectItem value="testing">Testing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                    <div>
                      <Label>Current Status</Label>
                      <div className="flex items-center h-10 text-white px-3 rounded-md">
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                    </div>
                </div>
              
                <div>
                  <Label htmlFor="milestone">Milestone Update</Label>
                  <Textarea
                    id="milestone"
                    value={newMilestone}
                    onChange={(e) => setNewMilestone(e.target.value)}
                    placeholder="Enter milestone update or project progress..."
                    rows={3}
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This will be visible to the customer on their order status page.
                  </p>
                </div>

                <div>
                  <Label htmlFor="downloadFile">Download File Link</Label>
                  <Input
                    id="downloadFile"
                    value={newDownloadFile}
                    onChange={(e) => setNewDownloadFile(e.target.value)}
                    placeholder="Enter download link (e.g., https://drive.google.com/file/d/...)"
                    className="text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This download button will appear on the customer's order status page when status is "Completed".
                  </p>
                  {selectedOrder?.download_file && (
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">Current download link:</p>
                      <a 
                        href={selectedOrder.download_file} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline break-all"
                      >
                        {selectedOrder.download_file}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateOrder}
              disabled={updateOrderMilestoneMutation.isPending}
            >
              {updateOrderMilestoneMutation.isPending ? "Updating..." : "Update Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
