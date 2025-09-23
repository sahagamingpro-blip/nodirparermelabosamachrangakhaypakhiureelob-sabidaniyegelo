import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Target, 
  Eye, 
  Heart, 
  Trophy, 
  Users, 
  Code, 
  Zap, 
  Shield,
  Calendar,
  MapPin,
  Linkedin
} from 'lucide-react';

const milestones = [
  { year: '2019', title: 'Company Founded', desc: 'Started with a vision to revolutionize casino gaming' },
  { year: '2020', title: 'First 100 Games', desc: 'Delivered our first 100+ games to satisfied clients' },
  { year: '2021', title: 'API Partnerships', desc: 'Partnered with major providers like Jili, JDB, and Evolution' },
  { year: '2022', title: 'Global Expansion', desc: 'Expanded operations to serve clients worldwide' },
  { year: '2023', title: 'Innovation Award', desc: 'Won "Best Casino Development Company" award' },
  { year: '2024', title: '500+ Games Delivered', desc: 'Reached milestone of 500+ successful game deliveries' }
];

const team = [
  { name: 'Alex Rodriguez', role: 'CEO & Founder', bio: '10+ years in gaming industry, former EA Games developer', avatar: '', location: 'San Francisco, CA' },
  { name: 'Sarah Chen', role: 'CTO', bio: 'Expert in casino gaming APIs and blockchain integration', avatar: '', location: 'Singapore' },
  { name: 'Michael Kumar', role: 'Lead Developer', bio: 'Specialized in Rummy and card game development', avatar: '', location: 'Mumbai, India' },
  { name: 'Emily Johnson', role: 'UX Designer', bio: 'Casino UI/UX specialist with 8+ years experience', avatar: '', location: 'London, UK' }
];

const values = [
  { icon: Zap, title: 'Lightning Fast', description: 'We deliver quality games in record time without compromising on quality.' },
  { icon: Shield, title: 'Secure & Reliable', description: 'Bank-grade security and 99.9% uptime guarantee for all our solutions.' },
  { icon: Heart, title: 'Client-Focused', description: 'Your success is our success. We go above and beyond for every client.' },
  { icon: Code, title: 'Quality Code', description: 'Clean, maintainable, and well-documented code that scales with your business.' }
];

export default function About() {
  return (
    <div className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <Badge className="mb-3 sm:mb-4 bg-primary/20 text-primary border-primary text-[0.875rem] sm:text-base">
            About A2Z Game Developer
          </Badge>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-snug">
            Crafting Gaming Experiences<br />Since 2019
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We are a passionate team of gaming professionals dedicated to creating exceptional 
            casino and card games that captivate players and drive business success.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-16">
          {[
            { number: '500+', label: 'Games Delivered' },
            { number: '100+', label: 'Happy Clients' },
            { number: '50+', label: 'Countries Served' },
            { number: '5', label: 'Years Experience' }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl sm:text-4xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">{stat.number}</div>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-16">
          {[
            { icon: Target, title: 'Mission', desc: 'To deliver world-class casino games that combine cutting-edge technology with exceptional user experience, empowering entrepreneurs to build successful gaming platforms.' },
            { icon: Eye, title: 'Vision', desc: 'To be the global leader in casino game development, known for innovation, quality, and lightning-fast delivery that transforms gaming businesses worldwide.' },
            { icon: Heart, title: 'Values', desc: 'Excellence in every line of code, transparency in every interaction, and unwavering commitment to our clients\' success and satisfaction.' }
          ].map((item, index) => (
            <Card key={index} className="text-center hover-elevate">
              <CardContent className="p-4 sm:p-8">
                <item.icon className="h-10 sm:h-12 w-10 sm:w-12 text-primary mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">{item.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <div className="mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-8 sm:mb-12">Our Journey</h2>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-0.5 w-[1px] h-full bg-border" />
            <div className="space-y-8 sm:space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col sm:flex-row items-center ${index % 2 === 0 ? 'sm:justify-start' : 'sm:justify-end'} relative`}>
                  <Card className="w-full max-w-md hover-elevate mb-2 sm:mb-0">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-center space-x-2 mb-2">
                        <Calendar className="h-4 sm:h-5 w-4 sm:w-5 text-primary" />
                        <Badge variant="outline" className="text-[0.65rem] sm:text-xs">{milestone.year}</Badge>
                      </div>
                      <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">{milestone.title}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{milestone.desc}</p>
                    </CardContent>
                  </Card>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-primary rounded-full border-2 sm:border-4 border-background top-1/2 -translate-y-1/2" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-8 sm:mb-12">What Drives Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover-elevate">
                <CardContent className="p-4 sm:p-6">
                  <value.icon className="h-10 sm:h-12 w-10 sm:w-12 text-primary mx-auto mb-2 sm:mb-4" />
                  <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-3">{value.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-8 sm:mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover-elevate">
                <CardContent className="p-4 sm:p-6">
                  <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto mb-2 sm:mb-4">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-sm sm:text-lg font-bold mb-1 sm:mb-2">{member.name}</h3>
                  <Badge variant="outline" className="mb-2 sm:mb-3 text-[0.65rem] sm:text-xs">{member.role}</Badge>
                  <p className="text-xs sm:text-sm leading-relaxed mb-2 sm:mb-3 text-muted-foreground">{member.bio}</p>
                  <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{member.location}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="mt-2 sm:mt-3">
                    <Linkedin className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center px-2 sm:px-0">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-6 sm:p-12">
              <Trophy className="h-12 sm:h-16 w-12 sm:w-16 text-primary mx-auto mb-4 sm:mb-6" />
              <h2 className="text-xl sm:text-3xl md:text-3xl font-bold mb-2 sm:mb-4">Ready to Build Something Amazing?</h2>
              <p className="text-sm sm:text-xl md:text-xl text-muted-foreground mb-4 sm:mb-8 max-w-full sm:max-w-2xl mx-auto leading-relaxed">
                Join the 100+ entrepreneurs who have built successful gaming platforms with our expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-start-project">Start Your Project</Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto" data-testid="button-meet-team">Meet Our Team</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
