import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Eye, Mail, ArrowRight, X, ZoomIn, Crown } from 'lucide-react';
import { Link } from 'wouter';

// Import all game screenshots from attached assets
import img1 from '@assets/IMG-20250919-WA0004_1758238534356.jpg';
import img2 from '@assets/IMG-20250919-WA0005_1758238534356.jpg';
import img3 from '@assets/IMG-20250919-WA0006_1758238534356.jpg';
import img4 from '@assets/IMG-20250919-WA0007_1758238534356.jpg';

import img6 from '@assets/IMG-20250919-WA0008_1758238534357.jpg';

import img8 from '@assets/IMG-20250919-WA0009_1758557954081.jpg';

import img10 from '@assets/IMG-20250919-WA0010_1758557954084.jpg';
import img11 from '@assets/IMG-20250919-WA0011_1758238534358.jpg';

import img13 from '@assets/IMG-20250919-WA0013_1758238508478.jpg';
import img14 from '@assets/IMG-20250919-WA0014_1758238534358.jpg';
import img15 from '@assets/IMG-20250919-WA0018_1758557954085.jpg';
import img16 from '@assets/IMG-20250919-WA0019_1758238534358.jpg';
import img17 from '@assets/IMG-20250919-WA0021_1758557954085.jpg';
import img18 from '@assets/IMG-20250919-WA0023_1758238534358.jpg';
import img19 from '@assets/IMG-20250919-WA0024_1758238534359.jpg';
import img20 from '@assets/IMG-20250919-WA0026_1758238534359.jpg';

import img22 from '@assets/IMG-20250919-WA0029_1758557954086.jpg';
import img23 from '@assets/IMG-20250919-WA0030_1758557954086.jpg';

import genImg3 from '@assets/generated_images/Green_slot_casino_background_1423b67f.png';
import genImg4 from '@assets/generated_images/Indian_Rummy_game_screenshot_61100e8c.png';


// All game screenshots and generated images
const gameImages = [
  { id: 'screenshot-1', image: img1, title: 'Game Login Interface', type: 'screenshot' },
  { id: 'screenshot-2', image: img2, title: 'Game Dashboard', type: 'screenshot' },
  { id: 'screenshot-3', image: img3, title: 'Slot Game Interface', type: 'screenshot' },
  { id: 'screenshot-4', image: img4, title: 'Game Features', type: 'screenshot' },
  
  { id: 'screenshot-6', image: img6, title: 'User Profile', type: 'screenshot' },
  
  { id: 'screenshot-8', image: img8, title: 'Bonus Features', type: 'screenshot' },
  
  { id: 'screenshot-10', image: img10, title: 'Game Interface', type: 'screenshot' },
  { id: 'screenshot-11', image: img11, title: 'Game Menu', type: 'screenshot' },
  
  { id: 'screenshot-13', image: img13, title: 'Game Settings', type: 'screenshot' },
  { id: 'screenshot-14', image: img14, title: 'Reward System', type: 'screenshot' },
  { id: 'screenshot-15', image: img15, title: 'Game Navigation', type: 'screenshot' },
  { id: 'screenshot-16', image: img16, title: 'User Interface', type: 'screenshot' },
  { id: 'screenshot-17', image: img17, title: 'Game Features', type: 'screenshot' },
  { id: 'screenshot-18', image: img18, title: 'Slot Interface', type: 'screenshot' },
  { id: 'screenshot-19', image: img19, title: 'Game Options', type: 'screenshot' },
  { id: 'screenshot-20', image: img20, title: 'Player Panel', type: 'screenshot' },
  
  { id: 'screenshot-22', image: img22, title: 'Game Display', type: 'screenshot' },
  { id: 'screenshot-23', image: img23, title: 'Game Screen', type: 'screenshot' },
  
  
  { id: 'generated-3', image: genImg3, title: 'Green Slot Background', type: 'mockup' },
  { id: 'generated-4', image: genImg4, title: 'Indian Rummy Game', type: 'mockup' },
  
];

export default function GameShowcase() {
  const [selectedImage, setSelectedImage] = useState<typeof gameImages[0] | null>(null);

  return (
    <section className="py-24 bg-card/30" data-testid="games-showcase-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            Game Gallery
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YONO SLOT Game Screenshots & Designs
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Authentic screenshots and design mockups from the YONO SLOT game. 
            Click any image to view in full size. Complete package available for <strong className="text-accent">₹1,30,000</strong>.
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {gameImages.map((gameImage) => (
            <Card 
              key={gameImage.id} 
              className="group overflow-hidden hover-elevate cursor-pointer transition-all duration-300 aspect-square"
              onClick={() => setSelectedImage(gameImage)}
              data-testid={`image-card-${gameImage.id}`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={gameImage.image}
                  alt={gameImage.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  data-testid={`image-${gameImage.id}`}
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-2">
                    <ZoomIn className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs font-medium truncate">{gameImage.title}</p>
                  </div>
                </div>
                <Badge 
                  className={`absolute top-2 left-2 text-xs ${
                    gameImage.type === 'screenshot' 
                      ? 'bg-accent/90 text-accent-foreground' 
                      : 'bg-primary/90 text-primary-foreground'
                  }`}
                >
                  {gameImage.type === 'screenshot' ? 'Live' : 'Design'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Image Popup Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => { if (!open) setSelectedImage(null); }}>
          <DialogContent className="max-w-4xl w-[95vw] h-[95vh] p-0 overflow-hidden flex flex-col">
            {selectedImage && (
              <>
                <VisuallyHidden>
                  <DialogTitle>{selectedImage.title} - YONO SLOT Game Image</DialogTitle>
                  <DialogDescription>
                    {selectedImage.type === 'screenshot' 
                      ? 'Authentic screenshot from the actual YONO SLOT game' 
                      : 'Professional design mockup showcasing game concepts'}
                  </DialogDescription>
                </VisuallyHidden>

                {/* Close Button */}
                <DialogClose className="absolute top-4 right-4 z-20 p-2 rounded-full border border-white bg-black/50 hover:bg-black/70 text-white">
                  <X className="h-5 w-5" />
                </DialogClose>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="relative bg-black flex items-center justify-center">
                    <img
                      src={selectedImage.image}
                      alt={selectedImage.title}
                      className="w-full h-auto object-contain max-h-[70vh] mx-auto"
                    />
                  </div>

                  <div className="p-6 bg-card">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">{selectedImage.title}</h3>
                        <Badge 
                          variant="outline" 
                          className={selectedImage.type === 'screenshot' 
                            ? 'bg-accent/10 border-accent text-accent' 
                            : 'bg-primary/10 border-primary text-primary'
                          }
                        >
                          {selectedImage.type === 'screenshot' ? 'Live Screenshot' : 'Design Mockup'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <p className="text-muted-foreground text-sm">
                        {selectedImage.type === 'screenshot' 
                          ? 'Authentic screenshot from the actual YONO SLOT game developed by A2Z'
                          : 'Professional design mockup showcasing game concepts and features'}
                      </p>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href="/contact">
                          <Button size="sm" data-testid="button-contact-from-popup">
                            <Mail className="h-4 w-4 mr-2" />
                            Get This Game
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

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
