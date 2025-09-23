import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger, DialogClose, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { ExternalLink, Eye, Star, Crown, Play, Mail, CheckCircle, IndianRupee, ArrowRight, X } from 'lucide-react';
import { Link } from 'wouter';
import indSlotImage1 from '@assets/IMG-20250919-WA0004_1758238534356.jpg';
import indSlotImage2 from '@assets/IMG-20250919-WA0005_1758238534356.jpg';
import indSlotImage3 from '@assets/IMG-20250919-WA0006_1758238534356.jpg';
import indSlotImage4 from '@assets/IMG-20250919-WA0008_1758238534357.jpg';
import indSlotImage5 from '@assets/IMG-20250919-WA0009_1758238534357.jpg';
import indSlotImage6 from '@assets/IMG-20250919-WA0010_1758238534357.jpg';

// Authentic YONO SLOT game screenshots showcasing A2Z development work
const indSlotScreenshots = [
  {
    id: 'login-rewards',
    title: 'Login & Daily Rewards System',
    image: indSlotImage1,
    description: 'Complete login interface with daily rewards, bonus systems, and user authentication.',
    features: ['Secure User Login', 'Daily Bonus System', 'Reward Tracking', 'User Profile Management']
  },
  {
    id: 'game-lobby',
    title: 'Game Lobby & Navigation',
    image: indSlotImage2,
    description: 'Professional game lobby with smooth navigation, game selection, and user interface.',
    features: ['Game Selection', 'Balance Display', 'Navigation Menu', 'User Dashboard']
  },
  {
    id: 'slot-gameplay',
    title: 'YONO SLOT Game Mechanics',
    image: indSlotImage3,
    description: 'Core slot machine gameplay with authentic Indian themes and winning combinations.',
    features: ['5-Reel Slot Machine', 'Indian Cultural Themes', 'Winning Animations', 'Bonus Features']
  },
  {
    id: 'game-interface-1',
    title: 'Advanced Game Interface',
    image: indSlotImage4,
    description: 'Sophisticated gaming interface with professional graphics and smooth animations.',
    features: ['HD Graphics', 'Smooth Animations', 'Sound Effects', 'Responsive Design']
  },
  {
    id: 'game-interface-2',
    title: 'Additional Game Features',
    image: indSlotImage5,
    description: 'Extended game features including bonus rounds, free spins, and special symbols.',
    features: ['Bonus Rounds', 'Free Spins', 'Wild Symbols', 'Progressive Jackpots']
  },
  {
    id: 'game-interface-3',
    title: 'Complete Gaming Experience',
    image: indSlotImage6,
    description: 'Full-featured gaming experience with all YONO SLOT functionalities implemented.',
    features: ['Complete Game Flow', 'Payment Integration', 'Admin Controls', 'Analytics Dashboard']
  }
];

export default function GameShowcase() {
  return (
    <section className="py-24 bg-card/30" data-testid="games-showcase-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            Live Screenshots
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YONO SLOT Game Screenshots
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Authentic screenshots from the actual YONO SLOT game developed by A2Z. 
            See the professional quality and features included in our <strong className="text-accent">₹1,30,000</strong> package.
          </p>
        </div>

        {/* Screenshots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {indSlotScreenshots.map((screenshot, index) => (
            <Card key={screenshot.id} className="group overflow-hidden hover-elevate cursor-pointer transition-all duration-300">
              <div className="relative overflow-hidden">
                <img
                  src={screenshot.image}
                  alt={screenshot.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  data-testid={`image-${screenshot.id}`}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex hidden items-center justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                        data-testid={`button-view-${screenshot.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Size
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
                      <VisuallyHidden>
                        <DialogTitle>{screenshot.title} - YONO SLOT Game Screenshot</DialogTitle>
                      </VisuallyHidden>
                      <DialogClose className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90">
                        <X className="h-5 w-5 text-black" />
                      </DialogClose>
                      <div className="flex flex-col gap-6">
                        <div className="relative">
                          <img
                            src={screenshot.image}
                            alt={screenshot.title}
                            className="w-full h-96 object-contain rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-accent/90 text-accent-foreground">
                            Authentic Screenshot
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center mb-3">
                            <Crown className="h-5 w-5 text-accent mr-2" />
                            <h3 className="text-2xl font-bold">{screenshot.title}</h3>
                          </div>
                          <Badge variant="outline" className="mb-4 bg-primary/10 border-primary text-primary">
                            YONO SLOT Game
                          </Badge>
                          <p className="text-muted-foreground mb-6">{screenshot.description}</p>
                          <div className="space-y-2 mb-6">
                            <h4 className="font-semibold flex items-center">
                              <CheckCircle className="h-4 w-4 text-accent mr-2" />
                              Included Features:
                            </h4>
                            {screenshot.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Complete Package Price:</span>
                              <div className="flex items-center text-xl font-bold text-accent">
                                <IndianRupee className="h-5 w-5 mr-1" />
                                1,30,000
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Link href="/contact" className="flex-1">
                              <Button className="w-full" data-testid={`button-contact-purchase-${screenshot.id}`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Contact to Purchase
                              </Button>
                            </Link>
                            <Button variant="outline" data-testid={`button-request-demo-${screenshot.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              Demo
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="absolute inset-0 md:hidden">
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="w-full h-full" data-testid={`mobile-trigger-${screenshot.id}`}></div>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
                      <VisuallyHidden>
                        <DialogTitle>{screenshot.title} - YONO SLOT Game Screenshot</DialogTitle>
                      </VisuallyHidden>
                      <DialogClose className="absolute top-4 right-4 p-2 rounded-full bg-white/80 hover:bg-white/90">
                        <X className="h-5 w-5 text-black" />
                      </DialogClose>
                      <div className="flex flex-col gap-6">
                        <div className="relative">
                          <img
                            src={screenshot.image}
                            alt={screenshot.title}
                            className="w-full h-96 object-contain rounded-lg"
                          />
                          <Badge className="absolute top-2 left-2 bg-accent/90 text-accent-foreground">
                            Authentic Screenshot
                          </Badge>
                        </div>
                        <div>
                          <div className="flex items-center mb-3">
                            <Crown className="h-5 w-5 text-accent mr-2" />
                            <h3 className="text-2xl font-bold">{screenshot.title}</h3>
                          </div>
                          <Badge variant="outline" className="mb-4 bg-primary/10 border-primary text-primary">
                            YONO SLOT Game
                          </Badge>
                          <p className="text-muted-foreground mb-6">{screenshot.description}</p>
                          <div className="space-y-2 mb-6">
                            <h4 className="font-semibold flex items-center">
                              <CheckCircle className="h-4 w-4 text-accent mr-2" />
                              Included Features:
                            </h4>
                            {screenshot.features.map((feature, featureIndex) => (
                              <div key={featureIndex} className="flex items-center text-sm">
                                <div className="w-1.5 h-1.5 bg-accent rounded-full mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 mb-6">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Complete Package Price:</span>
                              <div className="flex items-center text-xl font-bold text-accent">
                                <IndianRupee className="h-5 w-5 mr-1" />
                                1,30,000
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Link href="/contact" className="flex-1">
                              <Button className="w-full" data-testid={`button-contact-purchase-${screenshot.id}`}>
                                <Mail className="h-4 w-4 mr-2" />
                                Contact to Purchase
                              </Button>
                            </Link>
                            <Button variant="outline" data-testid={`button-request-demo-${screenshot.id}`}>
                              <Play className="h-4 w-4 mr-2" />
                              Demo
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
                  {screenshot.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {screenshot.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs bg-accent/10 border-accent text-accent">
                    Authentic Screenshot
                  </Badge>
                  
                  <Button variant="ghost" size="sm" data-testid={`button-quick-view-${screenshot.id}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-8 sm:mt-16">
  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-6 sm:p-8 md:p-12 border border-accent/20">
    <div className="flex flex-col sm:flex-row items-center justify-center mb-4">
      <Crown className="h-5 sm:h-6 w-5 sm:w-6 text-accent mx-auto sm:mx-0 sm:mr-2" />
      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mt-2 sm:mt-0">
        Get Your YONO SLOT Game Today
      </h3>
    </div>
    <p className="text-base sm:text-muted-foreground mb-6 max-w-2xl mx-auto">
      These authentic screenshots show the complete YONO SLOT game package available for <strong className="text-accent">₹1,30,000</strong>. 
      Contact A2Z to purchase the full source code and start your casino business.
    </p>
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
      <Link href="/contact">
        <Button size="lg" className="text-sm sm:text-base" data-testid="button-contact-purchase-main">
          <Mail className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
          Contact for Purchase
          <ArrowRight className="h-4 sm:h-5 w-4 sm:w-5 ml-2" />
        </Button>
      </Link>
      <div className="flex items-center text-muted-foreground">
        <span className="text-xs sm:text-sm">Email: </span>
        <Badge variant="outline" className="ml-2 bg-accent/20 border-accent text-accent text-xs sm:text-sm">
          support@a2z.dog
        </Badge>
      </div>
    </div>
  </div>
</div>
      </div>
    </section>
  );
}