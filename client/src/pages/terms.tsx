import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  IndianRupee,
  Shield,
  AlertTriangle,
  CheckCircle,
  Mail,
  ArrowLeft,
  Crown
} from 'lucide-react';
import { Link } from 'wouter';

export default function TermsOfService() {
  const sections = [
    {
      title: "YONO SLOT Game Purchase Terms",
      icon: Crown,
      content: [
        "Complete YONO SLOT Game package is available for ₹1,30,000 (One Lakh Thirty Thousand Indian Rupees)",
        "Package includes: API-based slot games, Indian rummy, teen patti, crash games (aviator style), and fishing games",
        "Full source code, admin panel, and all game features are included",
        "Payment must be completed before delivery of the game package",
        "Delivery timeline will be communicated after payment confirmation"
      ]
    },
    {
      title: "Service Delivery",
      icon: CheckCircle,
      content: [
        "Complete source code will be delivered within the agreed timeline",
        "Admin panel with full functionality included",
        "Mobile and desktop compatibility ensured",
        "Payment gateway integration support provided",
        "Basic setup documentation included"
      ]
    },
    {
      title: "Usage Rights & Licensing",
      icon: Shield,
      content: [
        "You receive full rights to use and modify the YONO SLOT Game source code",
        "Commercial use is permitted for the purchased game package",
        "Reselling the source code as-is to other parties is prohibited",
        "A2Z Game Developer retains no ownership rights after delivery",
        "You are responsible for hosting, maintenance, and legal compliance"
      ]
    },
    {
      title: "Support & Warranty",
      icon: AlertTriangle,
      content: [
        "30 days of basic technical support included after delivery",
        "Bug fixes for critical issues provided during support period",
        "Additional customizations may incur extra charges",
        "No warranty on third-party integrations or hosting issues",
        "Support requests must be submitted to support@a2z.dog"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/">
            <Button variant="ghost" className="mb-4" data-testid="button-back-home">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            <FileText className="h-3 w-3 mr-1" />
            Terms of Service
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Terms of Service
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read these terms carefully before purchasing our YONO SLOT Game development package. 
            By proceeding with the purchase, you agree to these terms and conditions.
          </p>
          
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: September 22, 2025
          </p>
        </div>

        {/* Pricing Highlight */}
        <Card className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-6 w-6 text-accent mr-2" />
                <span className="text-2xl font-bold text-accent">YONO SLOT Game Package</span>
              </div>
              <div className="flex items-center justify-center text-4xl font-bold text-foreground mb-2">
                <IndianRupee className="h-8 w-8 mr-1" />
                1,30,000
              </div>
              <p className="text-muted-foreground">
                Complete development package with full source code
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`terms-section-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center text-2xl">
                    <div className="inline-flex p-3 rounded-lg bg-accent/10 mr-4">
                      <IconComponent className="h-6 w-6 text-accent" />
                    </div>
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="h-2 w-2 rounded-full bg-accent mt-2 mr-3 flex-shrink-0" />
                        <span className="text-muted-foreground leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}

          {/* Payment & Refund Policy */}
          <Card className="border-amber-200 dark:border-amber-800">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl text-amber-600 dark:text-amber-400">
                <div className="inline-flex p-3 rounded-lg bg-amber-100 dark:bg-amber-900/20 mr-4">
                  <IndianRupee className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                Payment & Refund Policy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Payment Terms:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                      Full payment of ₹1,30,000 required before project delivery
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                      Payment methods and details will be provided upon order confirmation
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Refund Policy:</h4>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                      Refunds available only if we fail to deliver within agreed timeline
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-amber-500 mt-2 mr-3 flex-shrink-0" />
                      No refunds after successful delivery of complete source code
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="inline-flex p-3 rounded-lg bg-accent/10 mr-4">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                Questions About Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service or need clarification about 
                our YONO SLOT Game package, please contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-accent mr-2" />
                  <a href="mailto:support@a2z.dog?subject=YONO SLOT Purchase Inquiry" className="text-accent hover:underline">
                    support@a2z.dog
                  </a>
                </div>
                <div className="text-muted-foreground">
                  Website: www.a2z.dog (.dog = Development of Games)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Agreement */}
          <Card>
            <CardHeader>
              <CardTitle>Agreement</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                By purchasing our YONO SLOT Game package, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service. These terms constitute a legal agreement 
                between you and A2Z Game Developer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}