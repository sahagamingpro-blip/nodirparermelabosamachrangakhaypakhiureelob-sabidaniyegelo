import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
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
  Eye,
  LogOut,
  UserCheck,
  Upload,
  Copy,
  CheckCircle,
  Download
} from 'lucide-react';
import { useLocation } from 'wouter';

const steps = [
  { id: 1, title: 'Verify Details', icon: UserCheck },
  { id: 2, title: 'YONO SLOT Package', icon: Gamepad },
  { id: 3, title: 'Game Details', icon: Gamepad },
  { id: 4, title: 'Purchase Summary', icon: CreditCard },
  { id: 5, title: 'Payment', icon: CreditCard }
];

const PRODUCT = {
  id: 'yono-slot',
  name: 'YONO SLOT Casino Game',
  priceINR: 130000,
  features: [
    'Complete slot machine game with source code',
    'Admin panel for game management',
    'Payment gateway integration',
    'Mobile-responsive design',
    'Authentic game interface as shown in screenshots',
    'Technical support and documentation',
    'Free updates for 6 months',
    'Installation and setup assistance'
  ]
};

export default function OrderPage() {
  const { user, logoutMutation, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Dynamic settings from database
  const [usdtSettings, setUsdtSettings] = useState({
    usdt_rate: 89,
    usdt_address: "test-usdt-key-2025",
    usdt_qr_code_path: "/assets/usdt_qr.png",
    game_price: 130000
  });
  const [formData, setFormData] = useState(() => ({
    // Step 1: User contact details
    name: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: '',
    country: '',
    
    // Step 2: Product & Requirements
    productId: PRODUCT.id,
    gameType: 'YONO SLOT',
    targetPlatform: 'Web & Mobile',
    budget: '1,30,000 INR',
    timeline: '30-45 days',
    
    // Step 3: Game Details
    gameName: '',
    gameLogo: null as File | null,
    gameSupportEmail: '',
    telegramId: '',
    whatsappNumber: '',
    
    // Step 4: Purchase Details
    termsAccepted: false,
    additionalRequirements: '',
    
    // Step 5: Payment
    transactionId: '',
    transactionScreenshot: null as File | null
  }));

  // Form data is initialized empty for manual entry

  const progress = (currentStep / steps.length) * 100;
  const usdtAmount = (usdtSettings.game_price / usdtSettings.usdt_rate).toFixed(2);
  
  // Indian number formatting function
  const formatIndianCurrency = (amount: number) => {
    return amount.toLocaleString('en-IN');
  };
  
  // State for copy notification
  const [showCopyAlert, setShowCopyAlert] = useState(false);

  // Fetch USDT settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/public-settings', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const settings = await response.json();
          console.log('🔧 Fetched USDT settings:', settings);
          
          setUsdtSettings({
            usdt_rate: parseFloat(settings.usdt_rate_inr) || 89,
            usdt_address: settings.usdt_address || "test-usdt-key-2025",
            usdt_qr_code_path: settings.usdt_qr_code_path || "/assets/usdt_qr.png",
            game_price: parseFloat(settings.game_price_inr) || 130000
          });
        }
      } catch (error) {
        console.error('❌ Error fetching USDT settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  // Validation functions for each step
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Contact Information
        return !!(formData.name && formData.email && formData.phone && formData.country);
      case 2: // Requirements - Package details only, always allow to proceed
        return true;
      case 3: // Game Details
        return !!(formData.gameName && formData.gameSupportEmail && formData.termsAccepted);
      case 4: // Purchase Summary - always valid as it's just a review
        return true;
      case 5: // Payment
        return !!(formData.transactionId && formData.transactionScreenshot && formData.termsAccepted);
      default:
        return false;
    }
  };

  const getStepErrors = (step: number): string[] => {
    const errors: string[] = [];
    switch (step) {
      case 1:
        if (!formData.name) errors.push('Full Name is required');
        if (!formData.email) errors.push('Email is required');
        if (!formData.phone) errors.push('Phone number is required');
        if (!formData.country) errors.push('Country is required');
        break;
      case 2:
        // Package details only - no validation needed
        break;
      case 3:
        if (!formData.gameName) errors.push('Game name is required');
        if (!formData.gameSupportEmail) errors.push('Game support email is required');
        if (!formData.termsAccepted) errors.push('You must accept the terms of service');
        break;
      case 5:
        if (!formData.transactionId) errors.push('Transaction ID is required');
        if (!formData.transactionScreenshot) errors.push('Transaction screenshot is required');
        if (!formData.termsAccepted) errors.push('You must accept the terms of service');
        break;
    }
    return errors;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setShowCopyAlert(true);
      setTimeout(() => setShowCopyAlert(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const saveQRCode = () => {
    const qrImage = document.querySelector('#usdt-qr-image') as HTMLImageElement;
    if (qrImage) {
      const link = document.createElement('a');
      link.href = qrImage.src;
      link.download = 'usdt-payment-qr.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('YONO SLOT purchase form submitted:', { 
      ...formData, 
      product: PRODUCT,
      user: {
        id: user?.id,
        username: user?.username,
        email: user?.email
      }
    });
    
    // Submit order to backend
    try {
      const formDataToSend = new FormData();
      
      // Add all form data as JSON
      const orderData = {
        ...formData,
        amount: PRODUCT.priceINR,
        usdtAmount: parseFloat(usdtAmount)
      };
      
      // Remove file objects from orderData and add them separately
      const { gameLogo, transactionScreenshot, ...orderDataWithoutFiles } = orderData;
      formDataToSend.append('orderData', JSON.stringify(orderDataWithoutFiles));
      
      // Add files if they exist
      if (formData.gameLogo) {
        formDataToSend.append('gameLogo', formData.gameLogo);
      }
      if (formData.transactionScreenshot) {
        formDataToSend.append('transactionScreenshot', formData.transactionScreenshot);
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        credentials: 'include',
        body: formDataToSend, // Don't set Content-Type header for FormData
      });

        if (response.ok) {
          const result = await response.json();
          // Show success popup
          alert('🎉 Order Submitted Successfully!\n\nThank you for your purchase!\nOrder ID: ' + result.orderId + '\n\nYou will be redirected to the Order Status page to track your order progress.');
          // Redirect to order status page
          setTimeout(() => {
            setLocation('/order-status');
          }, 1000);
        } else {
          const error = await response.text();
          alert('❌ Failed to submit order: ' + error);
        }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  // Handle redirect for unauthenticated users
  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/auth');
    }
  }, [user, isLoading, setLocation]);

  // Render loading state
  const renderLoadingState = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    </div>
  );

  // Render redirect state
  const renderRedirectState = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting to login...</p>
      </div>
    </div>
  );

  // Render main order page content
  const renderOrderPage = () => {
    if (!user) return null; // This should never happen due to the conditional rendering, but satisfies TypeScript
    
    return (
      <section className="py-24 bg-background" data-testid="order-page-section">
      {/* Copy Alert Popup */}
      {showCopyAlert && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right-2">
          ✅ Copied!
        </div>
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with User Info */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-accent" />
                <span className="text-sm text-muted-foreground">Welcome, {user.fullName}</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
            </Button>
          </div>
          
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-accent mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Purchase YONO SLOT
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-4">
            Complete casino slot game package for <strong className="text-accent flex items-center justify-center"><IndianRupee className="h-5 w-5 mr-1" />{formatIndianCurrency(PRODUCT.priceINR)}</strong>
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="/app-demo" target="_blank" rel="noopener">
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
              {/* Step 1: Verify Contact Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-accent">Account Information</h4>
                    <p className="text-sm text-muted-foreground">
                      Please enter your contact details below.
                    </p>
                  </div>
                  
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
                          placeholder="+91 9800100100"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          required
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name (Optional)</Label>
                      <Input
                        id="company"
                        placeholder="Your company name (optional)"
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
                          <SelectItem value="bangladesh">Bangladesh</SelectItem>
                          <SelectItem value="pakistan">Pakistan</SelectItem>
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
                              <span className="text-3xl font-bold text-accent">{formatIndianCurrency(PRODUCT.priceINR)}</span>
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
                          <a href="/portfolio" target="_blank" rel="noopener">
                            <Button 
                              type="button"
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
                              <li>• 6 months free updates</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Game Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-4 bg-accent/10 border border-accent/20 rounded-lg">
                    <h4 className="font-semibold mb-2 text-accent">Game Customization</h4>
                    <p className="text-sm text-muted-foreground">
                      Provide your game details and contact information for customization.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="gameName">Game Name *</Label>
                      <Input
                        id="gameName"
                        placeholder="Enter your game name"
                        value={formData.gameName}
                        onChange={(e) => handleInputChange('gameName', e.target.value)}
                        required
                        data-testid="input-game-name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="gameLogo">Game Logo (Optional)</Label>
                      <div className="relative">
                        <Input
                          id="gameLogo"
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange('gameLogo', e.target.files?.[0] || null)}
                          className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
                          data-testid="input-game-logo"
                        />
                        <Upload className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="gameSupportEmail">Game Support Email *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="gameSupportEmail"
                        type="email"
                        className="pl-10"
                        placeholder="support@yourgame.com"
                        value={formData.gameSupportEmail}
                        onChange={(e) => handleInputChange('gameSupportEmail', e.target.value)}
                        required
                        data-testid="input-support-email"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="telegramId">Telegram ID (Optional)</Label>
                      <Input
                        id="telegramId"
                        placeholder="@yourtelegram"
                        value={formData.telegramId}
                        onChange={(e) => handleInputChange('telegramId', e.target.value)}
                        data-testid="input-telegram"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsappNumber">WhatsApp Number (Optional)</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="whatsappNumber"
                          className="pl-10"
                          placeholder="+91 9800100100"
                          value={formData.whatsappNumber}
                          onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                          data-testid="input-whatsapp"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="additionalRequirements">Customisation Message to A2Z Team (Optional)</Label>
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
                      I agree to purchase the YONO SLOT package for ₹{formatIndianCurrency(PRODUCT.priceINR)} and accept the{' '}
                      <a 
                        href="/terms" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent/80 underline font-medium"
                      >
                        terms of service
                      </a>
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 4: Purchase Summary */}
              {currentStep === 4 && (
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
                            <span className="font-bold">{formatIndianCurrency(PRODUCT.priceINR)}</span>
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex items-center justify-between text-lg font-bold">
                            <span>Total Amount</span>
                            <div className="flex items-center text-accent">
                              <IndianRupee className="h-5 w-5 mr-1" />
                              <span>{formatIndianCurrency(usdtSettings.game_price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Order Summary:</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Game Name:</span>
                        <span className="font-medium">{formData.gameName || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Support Email:</span>
                        <span className="font-medium">{formData.gameSupportEmail || 'Not specified'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Terms Accepted:</span>
                        <span className="font-medium">{formData.termsAccepted ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Payment */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-4">
                      <CreditCard className="h-8 w-8 text-accent mr-3" />
                      <h3 className="text-2xl font-bold">Payment</h3>
                    </div>
                  </div>

                  {/* Amount Display */}
                  <Card className="p-6 bg-gradient-to-r from-accent/10 to-primary/10 border-accent/20">
                    <div className="space-y-4">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-4">Total Amount</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-center text-2xl font-bold">
                            <IndianRupee className="h-6 w-6 mr-2" />
                            <span>{formatIndianCurrency(usdtSettings.game_price)}</span>
                          </div>
                          <div className="text-muted-foreground">
                            ≈ {usdtAmount} USDT (Rate: ₹{usdtSettings.usdt_rate}/USDT)
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* USDT Payment Section */}
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h4 className="text-lg font-semibold mb-4">Pay with USDT (TRC20)</h4>
                        
                        {/* QR Code */}
                        <div className="flex flex-col items-center mb-4">
                          <div className="p-4 bg-white rounded-lg shadow-md mb-3">
                            <img 
                              id="usdt-qr-image"
                              src={usdtSettings.usdt_qr_code_path} 
                              alt="USDT Payment QR Code" 
                              className="w-48 h-48 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            <div className="hidden w-48 h-48 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                              QR Code Not Available
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={saveQRCode}
                            className="flex items-center space-x-2"
                          >
                            <Download className="h-4 w-4" />
                            <span>Save QR Code</span>
                          </Button>
                        </div>

                        {/* USDT Address */}
                        <div className="space-y-2">
                          <Label className="text-sm font-medium">USDT TRC20 Address:</Label>
                          <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                            <code className="flex-1 text-sm font-mono break-all">{usdtSettings.usdt_address}</code>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(usdtSettings.usdt_address)}
                              className="flex-shrink-0"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Amount to Send */}
                        <div className="mt-4 p-4 bg-accent/10 rounded-lg border border-accent/20">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground mb-1">Amount to Send:</p>
                            <p className="text-2xl font-bold text-accent">{usdtAmount} USDT</p>
                          </div>
                        </div>
                      </div>

                      {/* Transaction Details Form */}
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="transactionId">Transaction ID *</Label>
                          <Input
                            id="transactionId"
                            placeholder="Enter your transaction ID"
                            value={formData.transactionId}
                            onChange={(e) => handleInputChange('transactionId', e.target.value)}
                            required
                            data-testid="input-transaction-id"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Copy the transaction hash from your wallet after sending USDT
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="transactionScreenshot">Transaction Screenshot Proof *</Label>
                          <div className="relative">
                            <Input
                              id="transactionScreenshot"
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFileChange('transactionScreenshot', e.target.files?.[0] || null)}
                              className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
                              required
                              data-testid="input-transaction-screenshot"
                            />
                            <Upload className="absolute right-3 top-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Upload a screenshot of your transaction from your wallet (PNG, JPG up to 10MB)
                          </p>
                        </div>
                      </div>

                      {/* Payment Instructions */}
                      <div className="p-4 bg-muted rounded-lg">
                        <h5 className="font-semibold mb-2">Payment Instructions:</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          <li>Send exactly <strong>{usdtAmount} USDT</strong> to the address above</li>
                          <li>Use TRC20 network only (Tron network)</li>
                          <li>Copy and paste the transaction ID in the field above</li>
                          <li>Upload a screenshot of the transaction as proof</li>
                          <li>Click submit to complete your order</li>
                          <li>Payment verification takes up to 24 hours. Track your order status and development progress on the "Order Status" page.</li>
                        </ol>
                      </div>
                    </div>
                  </Card>
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
                    disabled={!validateStep(currentStep)}
                    data-testid="button-submit"
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Pay
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    onClick={nextStep} 
                    data-testid="button-next"
                    disabled={!validateStep(currentStep)}
                  >
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
  };

  // Always render based on state, no early returns
  if (isLoading) {
    return renderLoadingState();
  }

  if (!user) {
    return renderRedirectState();
  }

  return renderOrderPage();
}
