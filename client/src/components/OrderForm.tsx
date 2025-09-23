import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  User, 
  Gamepad, 
  CreditCard,
  Phone,
  Mail,
  MapPin,
  Crown,
  IndianRupee,
  ExternalLink,
  Eye
} from 'lucide-react';

const steps = [
  { id: 1, title: 'Contact Details', icon: User },
  { id: 2, title: 'YONO SLOT Package', icon: Gamepad },
  { id: 3, title: 'Purchase Summary', icon: CreditCard }
];

const PRODUCT = {
  id: 'ind-slot',
  name: 'YONO SLOT Casino Game',
  priceINR: 130000,
  features: [
    'Complete slot machine game with source code',
    'Admin panel for game management',
    'Payment gateway integration',
    'Mobile-responsive design',
    'Authentic game interface as shown in screenshots',
    'Technical support and documentation'
  ]
};

export default function OrderForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Contact Details
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    
    // Step 2: Product
    productId: PRODUCT.id,
    
    // Step 3: Purchase Details
    termsAccepted: false,
    additionalRequirements: 'I want to purchase the YONO SLOT game package for ₹1,30,000.'
  });

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    console.log('Form updated:', field, value); // TODO: Remove mock functionality
  };


  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('YONO SLOT purchase form submitted:', { ...formData, product: PRODUCT });
    alert(`YONO SLOT purchase request submitted successfully! We will contact you at ${formData.email} within 24 hours with payment details for ₹${PRODUCT.priceINR.toLocaleString()}.`);
  };

  return (
    <section className="py-24 bg-background" data-testid="order-form-section">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-accent mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Purchase YONO SLOT
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            Complete casino slot game package for <strong className="text-accent flex items-center justify-center"><IndianRupee className="h-5 w-5 mr-1" />{PRODUCT.priceINR.toLocaleString()}</strong>
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/admin-demo" target="_blank" rel="noopener">
              <Button 
                variant="outline" 
                size="sm"
                className="bg-primary/10 text-primary border-primary"
                data-testid="button-header-demo"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Demo
              </Button>
            </a>
            <span className="text-sm text-muted-foreground">Authentic game interface included</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className={`flex flex-col items-center ${
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs font-medium text-center hidden sm:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Steps */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              {(() => {
                const IconComponent = steps[currentStep - 1].icon;
                return <IconComponent className="h-6 w-6 text-primary" />;
              })()}
              <span>Step {currentStep}: {steps[currentStep - 1].title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Contact Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="name"
                          className="pl-10"
                          placeholder="Your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          required
                          data-testid="input-name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          className="pl-10"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          required
                          data-testid="input-email"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          className="pl-10"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        placeholder="Your company name"
                        value={formData.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        data-testid="input-company"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Select onValueChange={(value) => handleInputChange('country', value)}>
                        <SelectTrigger className="pl-10" data-testid="select-country">
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="india">India</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                          <SelectItem value="singapore">Singapore</SelectItem>
                          <SelectItem value="uae">UAE</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: YONO SLOT Package */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-accent/20">
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="flex items-center justify-center mb-4">
                          <Crown className="h-12 w-12 text-accent mr-3" />
                          <div>
                            <h3 className="text-2xl font-bold">{PRODUCT.name}</h3>
                            <div className="flex items-center justify-center mt-2">
                              <IndianRupee className="h-6 w-6 text-accent mr-1" />
                              <span className="text-3xl font-bold text-accent">{PRODUCT.priceINR.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-muted-foreground">Complete casino slot game package with full source code</p>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Package Includes:</h4>
                          <ul className="space-y-2">
                            {PRODUCT.features.map((feature, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="space-y-4">
                          <a href="/admin-demo" target="_blank" rel="noopener">
                            <Button 
                              variant="outline" 
                              className="w-full border-accent text-accent hover:bg-accent/10"
                              data-testid="button-demo"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Live Demo
                            </Button>
                          </a>
                          
                          <div className="p-4 bg-muted rounded-lg">
                            <h5 className="font-medium mb-2">What you get:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• Complete source code</li>
                              <li>• Admin dashboard</li>
                              <li>• Payment integration</li>
                              <li>• Mobile responsive</li>
                              <li>• Professional support</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Purchase Summary */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <Crown className="h-8 w-8 text-accent mr-3" />
                      <h3 className="text-2xl font-bold">Purchase Summary</h3>
                    </div>
                    <Card className="p-6 bg-accent/5 border-accent/20">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">YONO SLOT Casino Game Package</span>
                          <div className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            <span className="font-bold">{PRODUCT.priceINR.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <div className="flex items-center text-accent">
                              <IndianRupee className="h-5 w-5 mr-1" />
                              <span>{PRODUCT.priceINR.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <Label htmlFor="additionalRequirements">Message to A2Z Team</Label>
                    <Textarea
                      id="additionalRequirements"
                      placeholder="Any specific requirements, questions, or notes for the A2Z development team..."
                      value={formData.additionalRequirements}
                      onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                      data-testid="textarea-requirements"
                      rows={4}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="termsAccepted"
                      checked={formData.termsAccepted}
                      onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
                      data-testid="checkbox-terms"
                    />
                    <Label htmlFor="termsAccepted" className="text-sm">
                      I agree to purchase the YONO SLOT package for ₹{PRODUCT.priceINR.toLocaleString()} and accept the terms of service
                    </Label>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Next Steps:</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                      <li>Submit your purchase request</li>
                      <li>We'll email you payment details within 24 hours at {formData.email || 'your email'}</li>
                      <li>Make payment to confirm your order</li>
                      <li>Receive your YONO SLOT game package with full source code</li>
                    </ol>
                  </div>
                </div>
              )}


              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  data-testid="button-previous"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep === steps.length ? (
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="bg-accent hover:bg-accent/90 text-accent-foreground" 
                    disabled={!formData.termsAccepted}
                    data-testid="button-submit"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Purchase YONO SLOT
                  </Button>
                ) : (
                  <Button type="button" onClick={nextStep} data-testid="button-next">
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}