import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

// Mock reviews (replace with backend data later)
const reviews = [
  {
    id: 1,
    name: 'Rahul Sharma',
    role: 'CEO, GamingHub India',
    avatar: '',
    rating: 5,
    review:
      'Exceptional service! They delivered our Rummy game in just 4 days with all API integrations working flawlessly. The admin panel is incredibly user-friendly, and their support team is outstanding.',
    gameType: 'Indian Rummy',
    location: 'Mumbai, India',
    date: '2024-01-15',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    role: 'Founder, CasinoTech Solutions',
    avatar: '',
    rating: 5,
    review:
      'Outstanding work on our slot games! The graphics are stunning, the gameplay is smooth, and the integration with payment gateways was seamless. Highly recommend for serious casino development.',
    gameType: 'Slot Games',
    location: 'London, UK',
    date: '2024-01-10',
  },
  {
    id: 3,
    name: 'Ahmed Al-Mansouri',
    role: 'Director, Emirates Gaming',
    avatar: '',
    rating: 5,
    review:
      'Professional team with excellent communication. Our Teen Patti game exceeded expectations with custom features and beautiful UI. The 6-month support has been invaluable.',
    gameType: 'Teen Patti',
    location: 'Dubai, UAE',
    date: '2024-01-05',
  },
  {
    id: 4,
    name: 'David Chen',
    role: 'CTO, AsianPlay',
    avatar: '',
    rating: 5,
    review:
      'Incredible turnaround time! We got our complete casino platform with 5 games in just one week. The code quality is top-notch and everything is well-documented. Will definitely work with them again.',
    gameType: 'Multiple Games',
    location: 'Singapore',
    date: '2023-12-28',
  },
  {
    id: 5,
    name: 'Maria Rodriguez',
    role: 'Product Manager, LatinCasino',
    avatar: '',
    rating: 5,
    review:
      'Best investment we made! The fishing game they developed became our most popular title. Great attention to detail, responsive support, and they delivered exactly what was promised.',
    gameType: 'Fishing Games',
    location: 'Mexico City, Mexico',
    date: '2023-12-20',
  },
  {
    id: 6,
    name: 'James Wilson',
    role: 'Founder, PlayNow Gaming',
    avatar: '',
    rating: 5,
    review:
      'From initial consultation to final delivery, everything was perfect. They understood our requirements immediately and delivered a crash game that our users absolutely love. Exceeded all expectations!',
    gameType: 'Crash Games',
    location: 'Toronto, Canada',
    date: '2023-12-15',
  },
];

export default function Reviews() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-advance logic with responsive timer
  useEffect(() => {
    const isMobile = window.innerWidth < 640; // Tailwind sm breakpoint
    const intervalTime = isMobile ? 4000 : 5000;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === reviews.length - 1 ? 0 : prev + 1
      );
    }, intervalTime);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextReview = () => {
    setCurrentIndex(currentIndex === reviews.length - 1 ? 0 : currentIndex + 1);
  };

  const prevReview = () => {
    setCurrentIndex(currentIndex === 0 ? reviews.length - 1 : currentIndex - 1);
  };

  const goToReview = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <section className="py-12 bg-card/30" data-testid="reviews-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            Client Testimonials
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            What Our Clients Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Trusted by 100+ gaming entrepreneurs worldwide. Here's what they
            have to say about our services.
          </p>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {[
            { number: '500+', label: 'Games Delivered' },
            { number: '100+', label: 'Happy Clients' },
            { number: '5.0', label: 'Average Rating', icon: Star },
            { number: '3-4', label: 'Days Delivery' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="flex items-center justify-center mb-2">
                <span className="text-3xl font-bold text-primary">
                  {stat.number}
                </span>
                {stat.icon && (
                  <stat.icon className="h-6 w-6 text-yellow-400 fill-current ml-1" />
                )}
              </div>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Carousel */}
        <div className="flex items-center gap-6">
          {/* Left Arrow (hidden on mobile) */}
          <div className="hidden sm:block">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 bg-background shadow-lg hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-transform"
              onClick={prevReview}
              data-testid="button-prev-review"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          {/* Review Card */}
          <div className="flex-1">
            <Card className="overflow-hidden">
              <CardContent className="p-8 md:p-12">
                <div className="flex flex-col items-center text-center">
                  {/* Quote */}
                  <Quote className="h-12 w-12 text-primary/30 mb-6" />

                  {/* Review */}
                  <blockquote className="text-xl md:text-2xl leading-relaxed mb-8 text-foreground">
                    "{reviews[currentIndex].review}"
                  </blockquote>

                  {/* Stars */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>

                  {/* Reviewer */}
                  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={reviews[currentIndex].avatar} />
                      <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                        {reviews[currentIndex].name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="text-center sm:text-left">
                      <h4 className="font-bold text-lg">
                        {reviews[currentIndex].name}
                      </h4>
                      <p className="text-muted-foreground">
                        {reviews[currentIndex].role}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2">
                        <Badge variant="outline" className="mb-1 sm:mb-0">
                          {reviews[currentIndex].gameType}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {reviews[currentIndex].location}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? 'bg-primary scale-110'
                      : 'bg-muted hover:bg-muted-foreground/30'
                  }`}
                  onClick={() => goToReview(index)}
                  data-testid={`dot-review-${index}`}
                />
              ))}
            </div>
          </div>

          {/* Right Arrow (hidden on mobile) */}
          <div className="hidden sm:block">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 bg-background shadow-lg hover:bg-accent hover:text-accent-foreground hover:scale-105 transition-transform"
              onClick={nextReview}
              data-testid="button-next-review"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
              <div className="text-center sm:text-left">
                <h3 className="text-2xl font-bold mb-2">
                  Join 100+ Satisfied Clients
                </h3>
                <p className="text-muted-foreground">
                  Ready to build your dream casino game?
                </p>
              </div>
              <Button size="lg" data-testid="button-start-project">
                Start Your Project
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
