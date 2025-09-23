import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, ChevronDown, Gamepad2, Mail, Play, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [location] = useLocation();
  const { user, logoutMutation } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manage demo menu state based on current location
  useEffect(() => {
    const isDemoPage = location === '/games' || location === '/admin-demo';
    setIsDemoOpen(isDemoPage);
  }, [location]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { 
      name: 'View Demo', 
      href: '#',
      dropdown: [
        { name: 'App Demo', href: '/games' },
        { name: 'Admin Demo', href: '/admin-demo' },
      ]
    },
    { name: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border' 
          : 'bg-transparent'
      }`}
      data-testid="navigation-header"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" data-testid="link-home">
            <div className="flex items-center space-x-2 hover-elevate rounded-lg px-3 py-2">
              <Gamepad2 className="h-8 w-8 text-primary" />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  A2Z Game Developer
                </span>
                <p className="text-xs text-muted-foreground">Yono Slot Games Development</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => (
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="flex items-center space-x-1"
                      data-testid={`dropdown-${item.name.toLowerCase()}`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {item.dropdown.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href} data-testid={`link-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}>
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.name} href={item.href} data-testid={`link-${item.name.toLowerCase()}`}>
                  <Button 
                    variant={location === item.href ? "secondary" : "ghost"}
                    className="transition-colors"
                  >
                    {item.name}
                  </Button>
                </Link>
              )
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-1">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" data-testid="button-user-menu">
                    <User className="h-4 w-4 mr-2" />
                    {user.fullName || user.username}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onClick={() => logoutMutation.mutate()}
                    data-testid="button-logout"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button  size="sm" data-testid="button-login">
                  <User className="h-4 w-4 mr-2" />
                  Login / Register
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              data-testid="button-mobile-menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-border animate-in slide-in-from-top">
            <div className="px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
              {navigation.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.dropdown ? (
                    <div>
                      <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-primary/10"
                        onClick={() => setIsDemoOpen(!isDemoOpen)}
                      >
                        <div className="flex items-center">
                          <Play className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <ChevronDown 
                          className={`h-4 w-4 text-muted-foreground transition-transform ${
                            isDemoOpen ? 'rotate-180' : ''
                          }`} 
                        />
                      </Button>
                      {isDemoOpen && (
                        <div className="mt-1 ml-4 pl-4 border-l-2 border-primary/20 space-y-1">
                          {item.dropdown.map((subItem) => (
                            <Link 
                              key={subItem.name} 
                              href={subItem.href} 
                              data-testid={`mobile-link-${subItem.name.toLowerCase().replace(/\s+/g, '-')}`}
                            >
                              <Button 
                                variant={location === subItem.href ? "secondary" : "ghost"}
                                size="sm" 
                                className={`w-full justify-start ${
                                  location === subItem.href
                                    ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                                    : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                <Play className={`h-3 w-3 mr-2 ${
                                  location === subItem.href ? "text-primary" : ""
                                }`} />
                                {subItem.name}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link 
                      href={item.href} 
                      data-testid={`mobile-link-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Button 
                        variant={location === item.href ? "secondary" : "ghost"}
                        className="w-full justify-start group hover:bg-primary/10"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.name === 'Home' && <Gamepad2 className="h-4 w-4 mr-2 group-hover:text-primary" />}
                        {item.name === 'About Us' && <User className="h-4 w-4 mr-2 group-hover:text-primary" />}
                        {item.name === 'Contact Us' && <Mail className="h-4 w-4 mr-2 group-hover:text-primary" />}
                        <span className="group-hover:text-primary">{item.name}</span>
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
              
              {/* Auth Section with Divider */}
              <div className="pt-4 mt-4 border-t border-border">
                <div className="px-3 py-2 flex items-center">
                  <div className="h-8 w-1 bg-accent/80 rounded-full mr-3" />
                  <div>
                    <div className="text-sm font-semibold text-accent/80 uppercase tracking-wider">
                      Account Access
                    </div>
                    <div className="text-xs text-white/80">
                      {user ? 'Manage your account' : 'Sign in to get started'}
                    </div>
                  </div>
                </div>
                <div className="px-3 pt-3">
                  {user ? (
                    <div className="space-y-3">
                      <div className="p-3 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{user.fullName || user.username}</div>
                            <div className="text-sm text-muted-foreground">Signed In</div>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" 
                        data-testid="mobile-button-logout"
                        onClick={() => {
                          logoutMutation.mutate();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Link href="/auth">
                      <Button 
                        className="w-full h-12 shadow-lg bg-primary hover:bg-primary/90" 
                        data-testid="mobile-button-login"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="h-5 w-5 mr-2" />
                        <span className="font-medium">Login / Register</span>
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}