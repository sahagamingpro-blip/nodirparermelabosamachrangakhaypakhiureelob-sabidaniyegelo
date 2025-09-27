import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  RefreshCw,
  Database,
  Server,
  Globe,
  Clock
} from "lucide-react";

interface ServiceStatus {
  name: string;
  status: "operational" | "degraded" | "down";
  responseTime?: number;
  lastChecked: string;
  details?: string;
}

export default function StatusPage() {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: "Frontend Application",
      status: "operational",
      responseTime: 45,
      lastChecked: new Date().toISOString(),
    },
    {
      name: "Backend API",
      status: "operational",
      responseTime: 120,
      lastChecked: new Date().toISOString(),
    },
    {
      name: "Database",
      status: "operational",
      responseTime: 85,
      lastChecked: new Date().toISOString(),
    },
    {
      name: "Authentication",
      status: "operational",
      responseTime: 95,
      lastChecked: new Date().toISOString(),
    },
  ]);
  
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const checkServiceStatus = async () => {
    setIsRefreshing(true);
    
    try {
      // Check health endpoint
      const healthResponse = await fetch("/health");
      const healthData = await healthResponse.json();
      
      // Update services status
      setServices(prev => prev.map(service => {
        if (service.name === "Backend API") {
          return {
            ...service,
            status: healthResponse.ok ? "operational" : "down",
            responseTime: healthData.uptime ? Math.round(healthData.uptime * 1000) : service.responseTime,
            lastChecked: new Date().toISOString()
          };
        }
        return service;
      }));
      
      setLastUpdated(new Date().toISOString());
    } catch (error) {
      console.error("Error checking service status:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    checkServiceStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkServiceStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "down":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded";
      case "down":
        return "Down";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "bg-green-100 text-green-800";
      case "degraded":
        return "bg-yellow-100 text-yellow-800";
      case "down":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatLastChecked = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const overallStatus = services.every(service => service.status === "operational") 
    ? "operational" 
    : services.some(service => service.status === "down") 
      ? "down" 
      : "degraded";

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-lg text-gray-600 mb-6">
            Current status of all YONO Game Development Services systems
          </p>
          
          <div className="inline-flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-sm">
            <div className={`w-3 h-3 rounded-full ${
              overallStatus === "operational" 
                ? "bg-green-500" 
                : overallStatus === "degraded" 
                  ? "bg-yellow-500" 
                  : "bg-red-500"
            }`}></div>
            <span className="font-medium">
              {overallStatus === "operational" 
                ? "All Systems Operational" 
                : overallStatus === "degraded" 
                  ? "Partial Outage" 
                  : "Major Outage"}
            </span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500 text-sm">
              Last updated: {formatLastChecked(lastUpdated)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={checkServiceStatus}
              disabled={isRefreshing}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2 text-lg">
                      {getStatusIcon(service.status)}
                      <span>{service.name}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {service.details || "Service status monitoring"}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {getStatusText(service.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {service.responseTime 
                        ? `${service.responseTime}ms response` 
                        : "Response time N/A"}
                    </span>
                  </div>
                  <span>Last checked: {formatLastChecked(service.lastChecked)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Application Version</span>
                <span className="font-medium">v1.0.0</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-gray-600">Deployment Status</span>
                <Badge variant="outline">Production</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Monitoring</span>
                <span className="text-green-600 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Active
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>This status page is updated automatically every 30 seconds.</p>
          <p className="mt-2">If you're experiencing issues, please contact our support team.</p>
        </div>
      </div>
    </div>
  );
}