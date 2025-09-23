import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Users, 
  CreditCard, 
  Settings, 
  Shield, 
  Activity,
  TrendingUp,
  DollarSign,
  Eye,
  Download
} from 'lucide-react';
import adminDashboard from '@assets/generated_images/Admin_dashboard_mockup_51e7764e.png';

const features = [
  {
    icon: Users,
    title: 'Player Management',
    description: 'Complete user management with KYC verification, account status control, and detailed player profiles.',
    features: ['User Registration & Verification', 'Account Status Management', 'Player Activity Tracking', 'Ban/Suspend Controls']
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Comprehensive reporting system with real-time analytics and customizable dashboards.',
    features: ['Revenue Analytics', 'Player Behavior Reports', 'Game Performance Metrics', 'Custom Report Builder']
  },
  {
    icon: CreditCard,
    title: 'Payment Management',
    description: 'Secure payment processing with multi-gateway support and detailed transaction tracking.',
    features: ['Transaction History', 'Payment Gateway Integration', 'Withdrawal Management', 'Fraud Detection']
  },
  {
    icon: Settings,
    title: 'Game Configuration',
    description: 'Easy game settings management with real-time updates and A/B testing capabilities.',
    features: ['Game Parameters Control', 'RTP Configuration', 'Bonus Management', 'Tournament Settings']
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Advanced security features with compliance tools and audit trails.',
    features: ['Access Control', 'Audit Logs', 'Compliance Reports', 'Security Monitoring']
  },
  {
    icon: Activity,
    title: 'System Monitoring',
    description: 'Real-time system health monitoring with alerts and performance optimization tools.',
    features: ['Server Monitoring', 'Performance Metrics', 'Alert System', 'Error Tracking']
  }
];

const stats = [
  { title: 'Active Players', value: '12,847', change: '+12%', icon: Users, color: 'text-blue-500' },
  { title: 'Revenue Today', value: '$45,290', change: '+18%', icon: DollarSign, color: 'text-green-500' },
  { title: 'Game Sessions', value: '8,394', change: '+7%', icon: Activity, color: 'text-purple-500' },
  { title: 'Conversion Rate', value: '3.2%', change: '+0.4%', icon: TrendingUp, color: 'text-orange-500' }
];

export default function AdminDemo() {
  return (
    <div className="py-12 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <Badge className="mb-2 sm:mb-4 bg-accent/20 text-accent border-accent text-xs sm:text-sm">
            Admin Dashboard
          </Badge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Powerful Admin Control Panel
          </h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Take complete control of your gaming platform with our comprehensive admin dashboard. 
            Monitor, manage, and optimize every aspect of your business in real-time.
          </p>
        </div>

        {/* Dashboard Screenshot */}
        <div className="mb-8 sm:mb-16">
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={adminDashboard}
                alt="Admin Dashboard Interface"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-white mb-1 sm:mb-2">Live Dashboard Preview</h3>
                    <p className="text-sm sm:text-base text-gray-300">Real-time data and intuitive controls</p>
                  </div>
                  
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="hover-elevate">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-6 sm:h-8 w-6 sm:w-8 ${stat.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-xl sm:text-2xl font-bold mb-1">{stat.value}</div>
                <p className="text-xs sm:text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Complete Business Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-elevate">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <feature.icon className="h-5 sm:h-6 w-5 sm:w-6 text-primary" />
                    </div>
                    <CardTitle className="text-base sm:text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    {feature.features.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Admin Panel Benefits */}
        <div className="mb-8 sm:mb-16">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 sm:p-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Why Our Admin Panel Stands Out</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">99.9%</div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Uptime Guarantee</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Rock-solid reliability with enterprise-grade infrastructure
                  </p>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-accent mb-2">24/7</div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Real-time Monitoring</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Continuous monitoring with instant alerts and notifications
                  </p>
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-destructive mb-2">30+</div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Integrated Features</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Everything you need to run your gaming business effectively
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Features */}
        <div className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">Enterprise Security</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <Card className="hover-elevate">
              <CardContent className="p-6 sm:p-8">
                <Shield className="h-10 sm:h-12 w-10 sm:w-12 text-primary mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-3">Advanced Security</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  Multi-layer security with encryption, fraud detection, and compliance tools.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    256-bit SSL encryption
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    Two-factor authentication
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    IP whitelisting & geo-blocking
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                    Automated fraud detection
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="hover-elevate">
              <CardContent className="p-6 sm:p-8">
                <BarChart3 className="h-10 sm:h-12 w-10 sm:w-12 text-accent mb-4" />
                <h3 className="text-lg sm:text-xl font-bold mb-3">Smart Analytics</h3>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                  AI-powered insights to help you make data-driven decisions and optimize performance.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                    Predictive analytics
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                    Custom report builder
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                    Real-time dashboards
                  </li>
                  <li className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                    Export & API access
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 sm:p-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to Take Control?</h2>
              <p className="text-base sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto">
                Experience the power of our admin dashboard with a free demo. 
                See how easy it is to manage your gaming platform.
              </p>
              <div className="flex flex-col gap-4 justify-center">
                <Button size="lg" data-testid="button-request-demo" className="text-sm sm:text-base">
                  <Eye className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Request Live Demo
                </Button>
                <Button variant="outline" size="lg" data-testid="button-download-brochure" className="text-sm sm:text-base">
                  <Download className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Download Brochure
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}