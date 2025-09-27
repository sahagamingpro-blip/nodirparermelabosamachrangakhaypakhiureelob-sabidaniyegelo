import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAdminAuth, AdminAuthProvider } from "@/hooks/use-admin-auth";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";
import { Loader2 } from "lucide-react";

function AdminPanelContent() {
  const { admin, isLoading, isAuthenticated } = useAdminAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated and not already on login page
    if (!isLoading && !isAuthenticated && location !== "/admin-rs/login") {
      setLocation("/admin-rs/login");
    }
    
    // Redirect to dashboard if authenticated and on login page
    if (!isLoading && isAuthenticated && location === "/admin-rs/login") {
      setLocation("/admin-rs");
    }
  }, [isLoading, isAuthenticated, location, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin />;
  }

  // Show dashboard if authenticated
  return <AdminDashboard />;
}

export default function AdminPanel() {
  return (
    <AdminAuthProvider>
      <AdminPanelContent />
    </AdminAuthProvider>
  );
}
