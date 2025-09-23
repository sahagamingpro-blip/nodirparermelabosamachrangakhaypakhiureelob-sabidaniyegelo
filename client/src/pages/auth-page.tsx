import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Crown,
  User,
  Mail,
  Phone,
  Calendar,
  Lock,
  UserPlus,
  ArrowLeft,
  Gamepad2
} from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertUserSchema, type InsertUser } from '@shared/schema';
import { z } from 'zod';

// Login form schema
const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
const registerSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState('login');

  // Redirect if user is already logged in
  if (user) {
    setLocation('/');
    return null;
  }

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
      dateOfBirth: new Date(),
    },
  });

  const handleLogin = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const handleRegister = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-4rem)]">
          {/* Left Column - Auth Forms */}
          <div className="flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Header */}
              <div className="text-center mb-8">
                <Link href="/">
                  <Button variant="ghost" className="mb-4" data-testid="button-back-home">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
                
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
                          <Label htmlFor="login-username">Username</Label>
                          <Input
                            id="login-username"
                            data-testid="input-login-username"
                            {...loginForm.register('username')}
                            placeholder="Enter your username"
                          />
                          {loginForm.formState.errors.username && (
                            <p className="text-sm text-red-500 mt-1">
                              {loginForm.formState.errors.username.message}
                            </p>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="login-password">Password</Label>
                          <Input
                            id="login-password"
                            type="password"
                            data-testid="input-login-password"
                            {...loginForm.register('password')}
                            placeholder="Enter your password"
                          />
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
                              placeholder="+91 98765 43210"
                            />
                            {registerForm.formState.errors.phone && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.phone.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="register-dob">Date of Birth</Label>
                            <Input
                              id="register-dob"
                              type="date"
                              data-testid="input-register-dob"
                              {...registerForm.register('dateOfBirth')}
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
                            <Input
                              id="register-password"
                              type="password"
                              data-testid="input-register-password"
                              {...registerForm.register('password')}
                              placeholder="Create password"
                            />
                            {registerForm.formState.errors.password && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label htmlFor="register-confirm">Confirm Password</Label>
                            <Input
                              id="register-confirm"
                              type="password"
                              data-testid="input-register-confirm"
                              {...registerForm.register('confirmPassword')}
                              placeholder="Confirm password"
                            />
                            {registerForm.formState.errors.confirmPassword && (
                              <p className="text-sm text-red-500 mt-1">
                                {registerForm.formState.errors.confirmPassword.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full" 
                          disabled={registerMutation.isPending}
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

          {/* Right Column - Hero Section */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="mb-8">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <Gamepad2 className="h-12 w-12 text-primary mr-3" />
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  A2Z Game Developer
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                www.a2z.dog (.dog = Development of Games)
              </p>
            </div>

            <h2 className="text-4xl font-bold mb-6">
              YONO SLOT Game Development
            </h2>
            
            <p className="text-xl text-muted-foreground mb-8">
              Get access to our complete YONO SLOT Game package for ₹1,30,000. 
              Includes API-based slot games, Indian rummy, teen patti, crash games, and fishing games.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-center lg:justify-start">
                <Crown className="h-5 w-5 text-accent mr-3" />
                <span>Complete Source Code Included</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <Lock className="h-5 w-5 text-accent mr-3" />
                <span>Admin Panel & Payment Integration</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <Mail className="h-5 w-5 text-accent mr-3" />
                <span>30 Days Technical Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}