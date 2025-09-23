import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Crown,
  ArrowRight,
  Star,
  Play,
  Mail,
  CheckCircle,
  IndianRupee
} from 'lucide-react';
import { Link } from 'wouter';
import gameScreenshot1 from '@assets/IMG-20250919-WA0005_1758238534356.jpg';
import gameScreenshot2 from '@assets/IMG-20250919-WA0006_1758238534356.jpg';
import gameScreenshot3 from '@assets/IMG-20250919-WA0008_1758238534357.jpg';

const yonoSlotFeatures = [
  'API-based Slot Games Development',
  'Indian Rummy Game Integration',
  'Teen Patti Game Development',
  'Crash Games (Aviator Style)',
  'Fishing Games Development',
  'Complete Source Code Included',
  'Admin Panel for All Games',
  'Payment Gateway Integration',
  'Mobile & Desktop Compatible',
  'Real Money Gaming Features'
];

const gameScreenshots = [
  {
    image: gameScreenshot1,
    title: 'Login & Rewards Interface'
  },
  {
    image: gameScreenshot2,
    title: 'Game Lobby & Navigation'
  },
  {
    image: gameScreenshot3,
    title: 'Slot Game Mechanics'
  }
];

export default function Services() {
  return (
    <section className="py-16 sm:py-24 bg-background" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent text-[1rem] sm:text-[1.1rem]">
            Our Product
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YONO SLOT Game Development
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Professional YONO SLOT Game Development by A2Z. We provide API-based slot games, Indian rummy, 
            teen patti, crash games like aviator, and fishing games for <strong className="text-accent">₹1,30,000</strong>.
          </p>
        </div>

        {/* Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-start mb-16">
          {/* Product Details */}
          <div>
            <Card className="relative overflow-hidden hover-elevate transition-all duration-300 ring-1 sm:ring-2 ring-accent/50">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-2 sm:px-3 py-1 text-xs sm:text-sm font-semibold rounded-bl-lg">
                Complete Package
              </div>
              
              <CardContent className="p-4 sm:p-8">
                {/* Product Icon */}
                <div className="inline-flex p-2 sm:p-4 rounded-xl bg-gradient-to-br from-primary to-accent mb-4 sm:mb-6">
                  <Crown className="h-8 sm:h-12 w-8 sm:w-12 text-white" />
                </div>

                {/* Product Title */}
                <h3 className="text-xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4 text-foreground">
                  YONO SLOT Game Platform
                </h3>

                {/* Pricing */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center text-2xl sm:text-4xl md:text-5xl font-bold text-accent mb-1 sm:mb-2">
                    <IndianRupee className="h-5 sm:h-8 w-5 sm:w-8 mr-1" />
                    1,30,000
                  </div>
                  <p className="text-xs sm:text-base text-muted-foreground">Complete development package</p>
                </div>

                {/* Product Description */}
                <p className="text-xs sm:text-base md:text-lg text-muted-foreground mb-6 leading-relaxed">
                  Complete YONO SLOT Game Development with API-based slot games, Indian rummy, teen patti, 
                  crash games like aviator, and fishing games. Full source code and admin panel included.
                </p>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-3 mb-6 sm:mb-8">
                  {yonoSlotFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center text-xs sm:text-sm">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-accent mr-1.5 sm:mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Link href="/contact" className="flex-1">
                    <Button className="w-full text-xs sm:text-base" data-testid="button-purchase-now">
                      <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      Contact to Purchase
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                    </Button>
                  </Link>
                  <Link href="/games" className="flex-1">
                    <Button variant="outline" className="w-full text-xs sm:text-base" data-testid="button-view-demo">
                      <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                      View Demo
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Screenshots */}
          <div>
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-6 text-center">Authentic Game Screenshots</h3>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              {gameScreenshots.map((screenshot, index) => (
                <Card key={index} className="overflow-hidden hover-elevate transition-all duration-300">
                  <div className="relative">
                    <img 
                      src={screenshot.image} 
                      alt={screenshot.title}
                      className="w-full h-40 sm:h-48 md:h-56 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/90 to-transparent p-1 sm:p-3">
                      <p className="text-xs sm:text-sm font-medium text-foreground text-center">{screenshot.title}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center px-2 sm:px-0">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-4 sm:p-8 md:p-12 border border-accent/20">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-6 gap-1 sm:gap-3">
              <Star className="h-5 sm:h-6 w-5 sm:w-6 text-accent" />
              <h3 className="text-lg sm:text-2xl md:text-3xl font-bold">
                Ready to Get Your YONO SLOT Game?
              </h3>
            </div>
            <p className="text-xs sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed">
              Contact A2Z today to purchase the complete YONO SLOT game package. 
              Full source code, admin panel, and professional support included.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-xs sm:text-base" data-testid="button-contact-purchase">
                  <Mail className="h-4 sm:h-5 w-4 sm:w-5 mr-1 sm:mr-2" />
                  Contact for Purchase
                  <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-1 sm:ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
