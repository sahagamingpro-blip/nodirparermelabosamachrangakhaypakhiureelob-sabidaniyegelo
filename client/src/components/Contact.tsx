import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  CheckCircle,
  Crown,
  IndianRupee,
  MessageCircle
} from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'YONO SLOT Game Purchase Inquiry',
    message: 'I am interested in purchasing the YONO SLOT game for ₹1,30,000. Please provide more details about the package and next steps.'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email Support', details: 'support@a2z.dog', subtitle: 'For YONO SLOT purchase inquiries', color: 'text-accent' },
    { icon: MessageCircle, title: 'Telegram Chat', details: '@yt_dvx', subtitle: 'Direct telegram contact for instant support', color: 'text-blue-500' }
  ];

  const faqs = [
    { question: 'What is included in the YONO SLOT Game package for ₹1,30,000?', answer: 'Complete slot machine game with source code, admin panel, payment integration, mobile compatibility, and all features shown in the screenshots.' },
    { question: 'How do I purchase the YONO SLOT game?', answer: 'Contact us at support@a2z.dog. We will provide payment details and delivery timeline after confirmation.' },
    { question: 'Do you provide support after purchase?', answer: 'Yes! We provide technical support and documentation to help you deploy and customize the YONO SLOT game successfully.' },
    { question: 'Can I see a demo before purchasing?', answer: 'The authentic screenshots show the actual game interface. For additional demos, contact support@a2z.dog.' }
  ];

  return (
    <div className="py-16 sm:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <Badge className="mb-3 sm:mb-4 bg-accent/20 text-accent border-accent text-[0.875rem] sm:text-base">
            Purchase YONO SLOT Game
          </Badge>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent leading-snug">
            Get Your YONO SLOT Game Today
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Ready to purchase the complete YONO SLOT game package for <strong className="text-accent">₹1,30,000</strong>? 
            Contact A2Z and get your casino game with full source code and professional support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-12 mb-16">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
                  <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                  <span>Contact for YONO SLOT Game Purchase</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8 sm:py-12">
                    <CheckCircle className="h-12 w-12 sm:h-16 sm:w-16 text-green-500 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Purchase Inquiry Sent!</h3>
                    <p className="text-sm sm:text-base text-muted-foreground">
                      Thank you for your interest in YONO SLOT Game. We'll contact you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <Label htmlFor="contact-name">Full Name *</Label>
                        <Input id="contact-name" placeholder="Your full name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                      </div>
                      <div>
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <Input id="contact-email" type="email" placeholder="your@email.com" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} required />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="contact-subject">Subject *</Label>
                      <Input id="contact-subject" placeholder="YONO SLOT Game Purchase Inquiry" value={formData.subject} onChange={(e) => handleInputChange('subject', e.target.value)} required />
                    </div>
                    <div>
                      <Label htmlFor="contact-message">Message *</Label>
                      <Textarea id="contact-message" placeholder={formData.message} rows={6} value={formData.message} onChange={(e) => handleInputChange('message', e.target.value)} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full sm:w-auto">
                      <Crown className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Send Purchase Inquiry
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-4 sm:space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-4 sm:p-6">
                  <a href={info.title === 'Telegram Chat' ? "https://t.me/yt_dvx" : "#"} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="flex items-start space-x-3 sm:space-x-4">
                      <div className={`p-2 sm:p-3 rounded-lg bg-primary/10 ${info.color}`}>
                        <info.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-sm sm:text-base">{info.title}</h3>
                        <p className="text-sm sm:text-lg font-medium mb-1">{info.details}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{info.subtitle}</p>
                      </div>
                    </div>
                  </a>
                </CardContent>
              </Card>
            ))}

            {/* Purchase Info */}
            <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-accent/20 text-center">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-center mb-2 sm:mb-4">
                  <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-accent mr-1 sm:mr-2" />
                  <span className="text-lg sm:text-2xl font-bold text-accent">1,30,000</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">Complete YONO SLOT Game Package</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">Full source code, admin panel, payment integration, and professional support included.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12 sm:mb-16 px-2 sm:px-0">
          <h2 className="text-2xl sm:text-3xl md:text-3xl font-bold text-center mb-6 sm:mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover-elevate">
                <CardContent className="p-4 sm:p-6">
                  <h3 className="font-bold mb-2 sm:mb-3 text-sm sm:text-base">{faq.question}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center px-2 sm:px-0">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-accent/20">
            <CardContent className="p-6 sm:p-12">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6 space-y-2 sm:space-y-0 sm:space-x-3">
                <Crown className="h-6 w-6 sm:h-8 sm:w-8 text-accent" />
                <h2 className="text-xl sm:text-3xl font-bold">Ready to Purchase YONO SLOT Game?</h2>
              </div>
              <p className="text-sm sm:text-xl text-muted-foreground mb-4 sm:mb-8 max-w-full sm:max-w-2xl mx-auto leading-relaxed">
                Get the complete YONO SLOT casino game package for ₹1,30,000. Email us directly for immediate assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center">
                <a href="mailto:support@a2z.dog?subject=YONO SLOT Purchase Inquiry&body=Hi, I am interested in purchasing the YONO SLOT game for ₹1,30,000. Please send me the payment details and delivery timeline.">
                  <Button size="lg">
                    <Mail className="h-4 w-4 sm:h-5 sm:w-5 mr-2" /> Email: support@a2z.dog
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
