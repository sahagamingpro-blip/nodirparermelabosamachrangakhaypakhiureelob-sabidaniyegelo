import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
  ArrowLeft
} from 'lucide-react';
import { Link } from 'wouter';

export default function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Personal information such as name, email address, and phone number when you contact us for YONO SLOT Game purchase",
        "Technical information about your device and browser when visiting our website",
        "Communication records when you interact with our support team at support@a2z.dog",
        "Payment information when purchasing our YONO SLOT Game package (₹1,30,000)"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: UserCheck,
      content: [
        "To process your YONO SLOT Game purchase and deliver the complete package",
        "To provide customer support and respond to your inquiries",
        "To improve our game development services and website functionality",
        "To send you updates about your order and important service announcements"
      ]
    },
    {
      title: "Data Protection & Security",
      icon: Lock,
      content: [
        "We implement industry-standard security measures to protect your personal information",
        "All payment processing is handled through secure, encrypted channels",
        "We do not store credit card information on our servers",
        "Access to your personal data is restricted to authorized personnel only"
      ]
    },
    {
      title: "Information Sharing",
      icon: Eye,
      content: [
        "We do not sell, trade, or rent your personal information to third parties",
        "We may share information with trusted service providers who assist in our operations",
        "We may disclose information when required by law or to protect our rights",
        "All third-party providers are bound by confidentiality agreements"
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
            <Shield className="h-3 w-3 mr-1" />
            Privacy Policy
          </Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A2Z Game Developer is committed to protecting your privacy. This policy explains how we collect, 
            use, and safeguard your information when you purchase our YONO SLOT Game development services.
          </p>
          
          <p className="text-sm text-muted-foreground mt-4">
            Last updated: September 22, 2025
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`privacy-section-${index}`}>
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

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <div className="inline-flex p-3 rounded-lg bg-accent/10 mr-4">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                Contact Us About Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                If you have any questions about this Privacy Policy or how we handle your personal information, 
                please contact us:
              </p>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 text-accent mr-2" />
                  <a href="mailto:support@a2z.dog" className="text-accent hover:underline">
                    support@a2z.dog
                  </a>
                </div>
                <div className="text-muted-foreground">
                  Website: www.a2z.dog (.dog = Development of Games)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                You have the right to access, update, or delete your personal information. You may also opt-out 
                of marketing communications at any time. For YONO SLOT Game purchase inquiries or support, 
                contact us at support@a2z.dog. We will respond to your requests within 30 days.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}