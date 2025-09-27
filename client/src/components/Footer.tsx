import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Gamepad2, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Linkedin, 
  MessageCircle,
  Send,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    services: [
      { name: 'Slot Games Development', href: '/services#slots' },
      { name: 'Indian Rummy Games Development', href: '/services#slots' },
      { name: 'Teen Patti Games Development', href: '/services#slots' },
      { name: 'Crash Games (Aviator) Development', href: '/services#slots' },
      { name: 'Fishing Games Development', href: '/services#slots' },
      { name: 'Sports/Casino Games Development', href: '/services#slots' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'View App Demo', href: '/app-demo' },
      { name: 'View Admin Demo', href: '/admin-demo' }
    ],
    support: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' }
    ]
  };

  const socialLinks = [
    { name: 'Email', icon: Mail, href: 'mailto:support@a2z.dog', color: 'hover:text-accent' },
    { name: 'Telegram', icon: MessageCircle, href: 'https://t.me/yt_dvx', color: 'hover:text-green-400' }
  ];

  return (
    <footer className="bg-card border-t border-border" data-testid="footer">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  A2Z Game Developer
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              Professional Slot, Casino game development company specializing in YONO SLOT Game Development. 
              We provide API-based slot games, Indian rummy, teen patti, crash games like aviator, and fishing games.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <a href="mailto:support@a2z.dog?subject=YONO SLOT Purchase Inquiry&body=Hi, I am interested in purchasing the YONO SLOT game for ₹1,30,000. Please send me the payment details and delivery timeline." target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-yellow-400">
                  support@a2z.dog
                </a>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-green-400" />
                <a href="https://t.me/yt_dvx" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-400">
                  Telegram: @yt_dvx
                </a>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-yellow-400" />
                <span>www.a2z.dog - Development of Games</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="icon"
                  className={`hover-elevate ${social.color} transition-colors`}
                  asChild
                  data-testid={`link-social-${social.name.toLowerCase()}`}
                >
                  <a href={social.href} target="_blank" rel="noopener noreferrer">
                    <social.icon className="h-5 w-5" />
                    <span className="sr-only">{social.name}</span>
                  </a>
                </Button>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-muted-foreground hover:text-primary text-left justify-start"
                      data-testid={`link-service-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Important Pages */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Important Pages</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <Button 
                      variant="ghost" 
                      className="p-0 h-auto text-muted-foreground hover:text-primary text-left justify-start"
                      data-testid={`link-company-${link.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {link.name}
                    </Button>
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/contact">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-muted-foreground hover:text-primary text-left justify-start"
                    data-testid="link-privacy-policy"
                  >
                    Contact Us
                  </Button>
                </Link>
              </li>
              
              <li>
                <Link href="/privacy">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-muted-foreground hover:text-primary text-left justify-start"
                    data-testid="link-privacy-policy"
                  >
                    Privacy Policy
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <Button 
                    variant="ghost" 
                    className="p-0 h-auto text-muted-foreground hover:text-primary text-left justify-start"
                    data-testid="link-terms-conditions"
                  >
                    Terms & Conditions
                  </Button>
                </Link>
              </li>
            </ul>
          </div>

        </div>
      </div>
      {/* Bottom Bar */}
      <div className="border-t border-border bg-background/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>© {currentYear} A2Z Game Developer. All rights reserved.</span>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-accent/20 border-accent text-accent">
                ⚡ 3-4 Days
              </Badge>
              <Badge variant="outline" className="bg-primary/20 border-primary text-green">
                🔒 100% Secure
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {/* Floating Casino Glow Effect */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </footer>
  );
}