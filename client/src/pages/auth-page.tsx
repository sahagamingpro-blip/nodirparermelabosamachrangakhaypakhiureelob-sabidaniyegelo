import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DatePicker } from '@/components/ui/date-picker';
import { Captcha } from '@/components/ui/captcha';
import { 
  Crown,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  UserPlus,
  ArrowLeft,
  Gamepad2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema, type InsertUser } from '@shared/schema';
import { z } from 'zod';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username/Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string()
    .min(1, 'Phone number is required')
    .regex(/^(\+91[\s-]?)?[6-9]\d{9}$/, 'Please enter a valid Indian phone number (10 digits starting with 6-9, optionally with +91)'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaSessionId, setCaptchaSessionId] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      setLocation('/order');
    }
  }, [user, setLocation]);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    },
  });

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate({
      ...registerData,
      captchaSessionId,
      captchaCode
    });
  };

  const handleCaptchaChange = (sessionId: string, code: string) => {
    setCaptchaSessionId(sessionId);
    setCaptchaCode(code);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-1 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left Column - Auth Forms */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8">
                
                <Badge className="mb-4 bg-accent/20 text-accent border-accent">
                  <Crown className="h-3 w-3 mr-1" />
                  A2Z Game Developer
                </Badge>
                
                <h1 className="text-3xl font-bold mb-2">
                  Welcome to A2Z
                </h1>
                <p className="text-muted-foreground">
                  Access your account to purchase YONO SLOT Game
                </p>
              </div>

              {/* Auth Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login" data-testid="tab-login">Login</TabsTrigger>
                  <TabsTrigger value="register" data-testid="tab-register">Register</TabsTrigger>
                </TabsList>

                {/* Login Form */}
                <TabsContent value="login">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-accent" />
                        Login to Your Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <div>
                          <Label htmlFor="login-username">Username/Email</Label>
                          <Input
                            id="login-username"
                            data-testid="input-login-username"
                            {...loginForm.register('username')}
                            placeholder="Enter your username/email"
                          />
                          {loginForm.formState.errors.username && (
                            <p className="text-sm text-red-500 mt-1">
                              {loginForm.formState.errors.username.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="login-password">Password</Label>
                          <div className="relative">
                            <Input
                              id="login-password"
                              type={showLoginPassword ? "text" : "password"}
                              data-testid="input-login-password"
                              {...loginForm.register('password')}
                              placeholder="Enter your password"
                              className="pr-10"
                            />
                            <button
                              type="button"
                              className="absolute inset-y-0 right-0 pr-3 flex items-center"
                              onClick={() => setShowLoginPassword(!showLoginPassword)}
                            >
                              {showLoginPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                              )}
                            </button>
                          </div>
                          {loginForm.formState.errors.password && (
                            <p className="text-sm text-red-500 mt-1">
                              {loginForm.formState.errors.password.message}
                            </p>
                          )}
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={loginMutation.isPending}
                          data-testid="button-login-submit"
                        >
                          {loginMutation.isPending ? 'Logging in...' : 'Login'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-accent" />
                        Create New Account
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={registerForm.handleSubmit(handleRegister as any)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="register-fullname">Full Name</Label>
                            <Input
                              id="register-fullname"
                              data-testid="input-register-fullname"
                              {...registerForm.register('fullName')}
                              placeholder="Your full name"
                            />
                            {registerForm.formState.errors.fullName && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.fullName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="register-username">Username</Label>
                            <Input
                              id="register-username"
                              data-testid="input-register-username"
                              {...registerForm.register('username')}
                              placeholder="Choose username"
                            />
                            {registerForm.formState.errors.username && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.username.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="register-email">Email Address</Label>
                          <Input
                            id="register-email"
                            type="email"
                            data-testid="input-register-email"
                            {...registerForm.register('email')}
                            placeholder="your.email@example.com"
                          />
                          {registerForm.formState.errors.email && (
                            <p className="text-sm text-red-500 mt-1">
                              {registerForm.formState.errors.email.message}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="register-phone">Phone Number</Label>
                            <Input
                              id="register-phone"
                              data-testid="input-register-phone"
                              {...registerForm.register('phone')}
                              placeholder="+91 9800100100 or 9800100100"
                            />
                            {registerForm.formState.errors.phone && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="register-dob">Date of Birth</Label>
                            <DatePicker
                              date={registerForm.watch('dateOfBirth') ? new Date(registerForm.watch('dateOfBirth').split('-').reverse().join('-')) : undefined}
                              onDateChange={(date) => {
                                if (date) {
                                  const day = date.getDate().toString().padStart(2, '0');
                                  const month = (date.getMonth() + 1).toString().padStart(2, '0');
                                  const year = date.getFullYear();
                                  registerForm.setValue('dateOfBirth', `${day}-${month}-${year}`);
                                } else {
                                  registerForm.setValue('dateOfBirth', '');
                                }
                              }}
                              placeholder="Select Date of Birth"
                              className="w-full"
                            />
                            {registerForm.formState.errors.dateOfBirth && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.dateOfBirth.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="register-password">Password</Label>
                            <div className="relative">
                              <Input
                                id="register-password"
                                type={showRegisterPassword ? "text" : "password"}
                                data-testid="input-register-password"
                                {...registerForm.register('password')}
                                placeholder="Create password"
                                className="pr-10"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                              >
                                {showRegisterPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                )}
                              </button>
                            </div>
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="register-confirm">Confirm Password</Label>
                            <div className="relative">
                              <Input
                                id="register-confirm"
                                type={showConfirmPassword ? "text" : "password"}
                                data-testid="input-register-confirm"
                                {...registerForm.register('confirmPassword')}
                                placeholder="Confirm password"
                                className="pr-10"
                              />
                              <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                )}
                              </button>
                            </div>
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Captcha Verification */}
                        <Captcha 
                          onCaptchaChange={handleCaptchaChange}
                          error={registerMutation.error?.message.includes('captcha') ? registerMutation.error.message : undefined}
                        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={registerMutation.isPending || !captchaCode || captchaCode.length !== 6}
          data-testid="button-register-submit"
        >
          {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}