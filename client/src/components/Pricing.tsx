import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Zap, Star, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';

const pricingPlans = [
  {
    name: 'Starter',
    price: '$2,999',
    originalPrice: '$3,999',
    description: 'Perfect for new entrepreneurs entering the gaming market',
    popular: false,
    features: [
      '1 Game (Rummy/Teen Patti/Ludo)',
      'Basic Admin Panel',
      'Android + iOS Apps',
      'Payment Gateway Integration',
      '3 Months Free Support',
      'Source Code Included',
      'Basic Customization',
      'API Integration (2 Providers)'
    ],
    delivery: '3-4 Days',
    icon: Zap,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Professional',
    price: '$5,999',
    originalPrice: '$7,999',
    description: 'Best value for serious gaming businesses',
    popular: true,
    features: [
      '3 Games of Your Choice',
      'Advanced Admin Dashboard',
      'Android + iOS + Web Platform',
      'Multiple Payment Gateways',
      '6 Months Free Support',
      'Complete Source Code',
      'Full UI/UX Customization',
      'API Integration (5 Providers)',
      'Tournament System',
      'Referral Program',
      'Multi-language Support',
      'White-label Solution'
    ],
    delivery: '5-7 Days',
    icon: Crown,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Enterprise',
    price: '$12,999',
    originalPrice: '$15,999',
    description: 'Complete solution for large-scale operations',
    popular: false,
    features: [
      'Unlimited Games',
      'Enterprise Admin Panel',
      'All Platforms + PWA',
      'Custom Payment Solutions',
      '12 Months Free Support',
      'Complete Source Code',
      'Custom Design & Branding',
      'All API Integrations',
      'Advanced Tournament System',
      'Affiliate Management',
      'Multi-currency Support',
      'Custom Features Development',
      'Dedicated Project Manager',
      'Priority Support',
      'Server Setup Assistance'
    ],
    delivery: '7-10 Days',
    icon: Star,
    gradient: 'from-orange-500 to-red-500'
  }
];

export default function Pricing() {
  return (
    <section className="py-24 bg-background" data-testid="pricing-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-accent/20 text-accent border-accent">
            Transparent Pricing
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No hidden fees, no surprises. Get your casino games developed with full transparency 
            and professional support from day one.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {pricingPlans.map((plan, index) => (
            <Card 
              key={plan.name} 
              className={`relative overflow-hidden hover-elevate transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-primary scale-105 lg:scale-110' 
                  : 'hover:scale-105'
              }`}
              data-testid={`card-pricing-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-accent text-primary-foreground text-center py-2 text-sm font-semibold">
                  🔥 Most Popular Choice
                </div>
              )}

              <CardHeader className={`relative ${plan.popular ? 'pt-12' : 'pt-6'}`}>
                {/* Plan Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                  <plan.icon className="h-8 w-8 text-white" />
                </div>

                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{plan.description}</p>

                {/* Pricing */}
                <div className="flex items-baseline space-x-2 mt-4">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-lg text-muted-foreground line-through">{plan.originalPrice}</span>
                </div>

                {/* Delivery Time */}
                <Badge variant="outline" className="w-fit mt-2">
                  ⚡ Ready in {plan.delivery}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features List */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link href="/order" className="block">
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90' 
                        : ''
                    }`}
                    size="lg"
                    data-testid={`button-order-${plan.name.toLowerCase()}`}
                  >
                    {plan.popular ? 'Get Started Now' : 'Order Now'}
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>

                {/* Additional Info */}
                <p className="text-xs text-muted-foreground text-center">
                  No setup fees • Money-back guarantee
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-card/50 rounded-2xl p-8 md:p-12 border">
          <h3 className="text-2xl font-bold text-center mb-8">
            All Plans Include These Essentials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔒', title: 'Secure & Reliable', desc: 'Bank-grade security' },
              { icon: '📱', title: 'Mobile Optimized', desc: 'iOS & Android ready' },
              { icon: '🎨', title: 'Custom Branding', desc: 'Your logo & colors' },
              { icon: '⚡', title: 'Fast Delivery', desc: 'Quick turnaround' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 md:p-12 border border-primary/20">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Have specific requirements? Let's discuss a tailored package that fits your exact needs and budget.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" data-testid="button-contact-sales">
                Contact Sales Team
              </Button>
              <Button size="lg" data-testid="button-schedule-call">
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}