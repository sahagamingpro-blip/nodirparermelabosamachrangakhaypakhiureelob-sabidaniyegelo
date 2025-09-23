import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap, CheckCircle, Star, Play, Mail, Gamepad2, DollarSign, Smartphone, Palette } from 'lucide-react';
import { Link } from 'wouter';
import heroImage from '@assets/generated_images/Green_slot_casino_background_1423b67f.png';

export default function Hero() {
  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
      data-testid="hero-section"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-8 sm:py-12">
        {/* Badge */}
        <div className="mb-6 sm:mb-8">
          <Badge 
            variant="outline" 
            className="bg-accent/20 border-accent text-accent px-3 py-1.5 sm:px-4 sm:py-2 text-[0.66rem] sm:text-sm backdrop-blur-sm whitespace-normal sm:whitespace-nowrap"
            data-testid="badge-product"
          >
            <Zap className="h-4 w-4 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
            Premium YONO SLOT Game Development - ₹1,30,000
          </Badge>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
          Professional <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YONO SLOT
          </span>
          <br className="hidden sm:block" />
          <span className="sm:mt-2 inline-block">Game Development</span>
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 sm:px-4">
          Get your complete <strong className="text-accent">YONO SLOT casino game platform</strong> developed by A2Z.
          Professional slot machine game with authentic Indian themes. <strong className="text-accent">Full source code included</strong> for ₹1,30,000.
        </p>

        {/* Key Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10 max-w-4xl mx-auto px-2 sm:px-4">
          <div className="flex items-center bg-background/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2.5 sm:py-3" data-testid="feature-slot-game">
            <Gamepad2 className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2 flex-shrink-0" />
            <span className="text-white font-medium text-sm sm:text-base">Complete Slot Game</span>
          </div>
          <div className="flex items-center bg-background/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2.5 sm:py-3" data-testid="feature-source-code">
            <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2 flex-shrink-0" />
            <span className="text-white font-medium text-sm sm:text-base">Full Source Code With API</span>
          </div>
          <div className="flex items-center bg-background/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2.5 sm:py-3" data-testid="feature-indian-theme">
            <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2 flex-shrink-0" />
            <span className="text-white font-medium text-sm sm:text-base">Indian Theme Design</span>
          </div>
          <div className="flex items-center bg-background/20 backdrop-blur-sm rounded-lg px-3 sm:px-4 py-2.5 sm:py-3" data-testid="feature-mobile-ready">
            <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-accent mr-2 flex-shrink-0" />
            <span className="text-white font-medium text-sm sm:text-base">Mobile & Desktop Ready</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4 sm:px-0">
          <Link href="/contact" className="w-full sm:w-auto">
            <Button 
              size="lg" 
              className="w-full sm:w-auto bg-gradient-to-r from-destructive to-orange-600 hover:from-destructive/90 hover:to-orange-600/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-contact-purchase"
            >
              <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              Contact to Purchase
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
            </Button>
          </Link>
          
          <Link href="/games" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto bg-background/20 backdrop-blur-sm border-white/30 text-white hover:bg-background/30 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold"
              data-testid="button-view-demo"
            >
              <Play className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              View Game Demo
            </Button>
          </Link>
        </div>

        {/* Social Proof */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 text-gray-300 px-4 sm:px-0">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-accent/20 border-accent text-accent text-sm">
              ₹1,30,000
            </Badge>
            <span className="text-sm sm:text-base">Complete Package</span>
          </div>
          
          <div className="hidden sm:block w-px h-6 bg-gray-600" />
          
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 bg-primary/20 border-primary text-primary text-sm">
              A2Z
            </Badge>
            <span className="text-sm sm:text-base">www.a2z.dog</span>
          </div>
          
          <div className="hidden sm:block w-px h-6 bg-gray-600" />
          
          <div className="flex items-center">
            <div className="flex -space-x-0.5 mr-2 sm:mr-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-sm sm:text-base">Professional Quality</span>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-primary/20 rounded-full blur-xl animate-bounce" />
      <div className="absolute bottom-20 right-10 w-20 h-20 bg-accent/20 rounded-full blur-xl animate-bounce delay-1000" />
      <div className="absolute top-1/2 left-5 w-12 h-12 bg-destructive/20 rounded-full blur-xl animate-bounce delay-500" />
    </section>
  );
}