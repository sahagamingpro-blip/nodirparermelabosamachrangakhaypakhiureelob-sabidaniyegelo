import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Eye, ZoomIn, X, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

// Import first 10 images for homepage preview
import img1 from '@assets/IMG-20250919-WA0004_1758238534356.jpg';
import img2 from '@assets/IMG-20250919-WA0005_1758238534356.jpg';
import img3 from '@assets/IMG-20250919-WA0006_1758238534356.jpg';
import img4 from '@assets/IMG-20250919-WA0007_1758238534356.jpg';
import img5 from '@assets/IMG-20250919-WA0008_1758238534357.jpg';
import img6 from '@assets/IMG-20250919-WA0009_1758238534357.jpg';
import img7 from '@assets/IMG-20250919-WA0010_1758238534357.jpg';
import img8 from '@assets/IMG-20250919-WA0011_1758238534358.jpg';
import img9 from '@assets/IMG-20250919-WA0013_1758238508478.jpg';
import img10 from '@assets/IMG-20250919-WA0014_1758238534358.jpg';

// Homepage preview images (first 10)
const homepageImages = [
  { id: 'home-1', image: img1, title: 'Game Login Interface', type: 'screenshot' },
  { id: 'home-2', image: img2, title: 'Game Dashboard', type: 'screenshot' },
  { id: 'home-3', image: img3, title: 'Slot Game Interface', type: 'screenshot' },
  { id: 'home-4', image: img4, title: 'Game Features', type: 'screenshot' },
  { id: 'home-5', image: img5, title: 'User Profile', type: 'screenshot' },
  { id: 'home-6', image: img6, title: 'Game Selection', type: 'screenshot' },
  { id: 'home-7', image: img7, title: 'Slot Machine', type: 'screenshot' },
  { id: 'home-8', image: img8, title: 'Game Menu', type: 'screenshot' },
  { id: 'home-9', image: img9, title: 'Game Settings', type: 'screenshot' },
  { id: 'home-10', image: img10, title: 'Reward System', type: 'screenshot' }
];

export default function HomepageScreenshots() {
  const [selectedImage, setSelectedImage] = useState<typeof homepageImages[0] | null>(null);

  return (
    <section className="py-24 bg-card/30" data-testid="homepage-screenshots-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            Game Screenshots
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            YONO SLOT Game Preview
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Authentic screenshots from the YONO SLOT game. See the professional quality and features included in our <strong className="text-accent">₹1,30,000</strong> package.
          </p>
        </div>

        {/* Image Grid - First 10 images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12">
          {homepageImages.map((gameImage) => (
            <Card 
              key={gameImage.id} 
              className="group overflow-hidden hover-elevate cursor-pointer transition-all duration-300 aspect-square"
              onClick={() => setSelectedImage(gameImage)}
              data-testid={`homepage-image-card-${gameImage.id}`}
            >
              <div className="relative w-full h-full overflow-hidden">
                <img
                  src={gameImage.image}
                  alt={gameImage.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  data-testid={`homepage-image-${gameImage.id}`}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center text-white p-2">
                    <ZoomIn className="h-6 w-6 mx-auto mb-1" />
                    <p className="text-xs font-medium truncate">{gameImage.title}</p>
                  </div>
                </div>
                {/* Live badge */}
                <Badge 
                  className="absolute top-2 left-2 text-xs bg-accent/90 text-accent-foreground"
                >
                  Live
                </Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/app-demo">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-8 py-3"
              data-testid="button-view-all-screenshots"
            >
              <Eye className="h-5 w-5 mr-2" />
              View All Screenshots
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Image Popup Dialog */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => { if (!open) setSelectedImage(null); }}>
          <DialogContent className="max-w-4xl w-[95vw] h-[95vh] p-0 overflow-hidden flex flex-col">
            {selectedImage && (
              <>
                <VisuallyHidden>
                  <DialogTitle>{selectedImage.title} - YONO SLOT Game Screenshot</DialogTitle>
                  <DialogDescription>
                    Authentic screenshot from the actual YONO SLOT game developed by A2Z
                  </DialogDescription>
                </VisuallyHidden>

                {/* Close Button (only one, styled) */}
                <DialogClose
                  className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 p-2 sm:p-3 rounded-full border border-white bg-black/50 hover:bg-black/70 text-white"
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </DialogClose>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Image */}
                  <div className="relative bg-black flex items-center justify-center">
                    <img
                      src={selectedImage.image}
                      alt={selectedImage.title}
                      className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[70vh] mx-auto"
                    />
                  </div>

                  {/* Info section */}
                  <div className="p-4 sm:p-6 bg-card">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-bold">{selectedImage.title}</h3>
                        <Badge 
                          variant="outline" 
                          className="bg-accent/10 border-accent text-accent text-xs sm:text-sm"
                        >
                          Live Screenshot
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <p className="text-muted-foreground text-sm sm:text-base">
                        Authentic screenshot from the actual YONO SLOT game developed by A2Z
                      </p>
                      
                      <div className="flex gap-2 flex-shrink-0">
                        <Link href="/app-demo">
                          <Button size="sm" variant="outline" data-testid="button-view-all-from-popup">
                            <Eye className="h-4 w-4 mr-2" />
                            View All
                          </Button>
                        </Link>
                        <Link href="/contact">
                          <Button size="sm" data-testid="button-contact-from-homepage-popup">
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
      </div>
    </section>
  );
}
