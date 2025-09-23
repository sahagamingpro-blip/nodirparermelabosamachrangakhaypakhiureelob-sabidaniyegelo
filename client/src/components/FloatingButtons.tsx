import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { 
  Mail, 
  ChevronUp,
  MessageCircle
} from 'lucide-react';

export default function FloatingButtons() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Floating Contact Buttons */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex flex-col items-start space-y-3">
          {/* Scroll to Top Button */}
          {showScrollTop && (
            <Button
              size="icon"
              variant="outline"
              className="h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={scrollToTop}
              data-testid="button-scroll-top"
            >
              <ChevronUp className="h-5 w-5" />
            </Button>
          )}

          {/* Email Support */}
          <a href="mailto:support@a2z.dog?subject=YONO SLOT Purchase Inquiry&body=Hi, I am interested in purchasing the YONO SLOT game for ₹1,30,000. Please send me the payment details and delivery timeline.">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-email-support"
            >
              <Mail className="h-5 w-5" />
            </Button>
          </a>

          {/* Telegram Contact */}
          <a href="https://t.me/yt_dvx" target="_blank" rel="noopener noreferrer">
            <Button
              size="icon"
              className="h-12 w-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              data-testid="button-telegram-contact"
            >
              <MessageCircle className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>
    </>
  );
}