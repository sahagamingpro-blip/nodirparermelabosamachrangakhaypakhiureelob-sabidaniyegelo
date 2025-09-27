import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Smartphone, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

// Games data with actual app icons
const games = [
  {
    id: 1,
    name: 'ABC Rummy',
    icon: '/assets/app-downloads-icon/ABC-Rummy.webp',
    description: 'Premium Rummy Game',
    downloadUrl: 'https://www.abcrummy5.com/?code=75CQQFHYF9K&t=1756350180',
    category: 'Cards'
  },
  {
    id: 2,
    name: 'Ind Rummy',
    icon: '/assets/app-downloads-icon/Ind-Rummy.webp',
    description: 'Indian Rummy Game',
    downloadUrl: 'https://indrummybet4.net/?code=2BAZJ66WS6Q&t=1758620704',
    category: 'Cards'
  },
  {
    id: 3,
    name: 'Jaiho Win',
    icon: '/assets/app-downloads-icon/Jaiho-Win.webp',
    description: 'Win Big Casino Game',
    downloadUrl: 'https://www.jaihowin13.com/?code=1XNNLEWP5UD&t=1758640095041',
    category: 'Casino'
  },
  {
    id: 4,
    name: 'Love Rummy',
    icon: '/assets/app-downloads-icon/Love-Rummy.jpg',
    description: 'Romantic Rummy Game',
    downloadUrl: 'https://www.loverummy6.com/?code=AFCAN1MUAPT&t=1756321032',
    category: 'Cards'
  },
  {
    id: 5,
    name: 'MAHA Games',
    icon: '/assets/app-downloads-icon/MAHA-GAMES.png',
    description: 'Multi-Game Platform',
    downloadUrl: 'https://mahagames.poker/?code=J24RRS455ZU&t=1758640149858',
    category: 'Casino'
  },
  {
    id: 6,
    name: 'Saga Slots',
    icon: '/assets/app-downloads-icon/Saga-Slots.webp',
    description: 'Epic Slot Adventure',
    downloadUrl: 'https://www.sagaslots2.com/?code=41LHAKKZW3D&t=1756350033',
    category: 'Slots'
  },
  {
    id: 7,
    name: 'Spin 777',
    icon: '/assets/app-downloads-icon/logo-spin777.png',
    description: 'Classic Slot Machine',
    downloadUrl: 'https://spin777-s.com/?code=7V91NDSDK8R&t=1756351664',
    category: 'Slots'
  },
  {
    id: 8,
    name: 'Spin Gold',
    icon: '/assets/app-downloads-icon/Spin-Gold.jpg',
    description: 'Golden Slot Experience',
    downloadUrl: 'https://spingoldagents.com/?code=HLT3JM8SWWJ&t=1756351122',
    category: 'Slots'
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        

        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            <Smartphone className="h-3 w-3 mr-1" />
            Our Portfolio
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            We Made These Games
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Download and experience the quality of our game development expertise. 
            Each game showcases our commitment to creating engaging, high-quality gaming experiences.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '100+', label: 'Games Developed' },
            { number: '5M+', label: 'Downloads' },
            { number: '4.8', label: 'Average Rating' },
            { number: '24/7', label: 'Support' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 bg-card rounded-lg border">
              <div className="text-3xl font-bold text-primary mb-2">
                {stat.number}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {games.map((game) => (
            <Card key={game.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-gradient-to-br from-card to-card/80 border-2 hover:border-primary/30">
              <CardContent className="p-6 text-center">
                 {/* App Icon */}
                 <div className="relative mb-4">
                   <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                     {typeof game.icon === 'string' && game.icon.includes('.') ? (
                       <img 
                         src={game.icon} 
                         alt={game.name}
                         className="w-full h-full object-cover rounded-2xl"
                       />
                     ) : (
                       <span className="text-4xl md:text-5xl">{game.icon}</span>
                     )}
                   </div>
                   {/* Glow effect */}
                   <div className="absolute inset-0 w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                 </div>

                {/* Game Info */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg md:text-xl mb-2 group-hover:text-primary transition-colors">
                    {game.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {game.description}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {game.category}
                  </Badge>
                </div>

                {/* Download Button */}
                <Button 
                  size="sm" 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                  onClick={() => window.open(game.downloadUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20">
            <h3 className="text-2xl font-bold mb-4">Want a Custom Game?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              We create custom casino games, slot machines, card games, and more. 
              Let us bring your gaming vision to life with our expert development team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => window.location.href = '/contact'}>
                Start Your Project
              </Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = '/services'}>
                View Our Services
              </Button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            More games coming soon! Follow us for updates and new releases.
          </p>
        </div>
      </div>
    </div>
  );
}
