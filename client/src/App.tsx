import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { ScrollToTop } from "@/components/ScrollToTop";

// Import components
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import GameShowcase from "@/components/GameShowcase";
import Pricing from "@/components/Pricing";
import Reviews from "@/components/Reviews";
import About from "@/components/About";
import Contact from "@/components/Contact";
import OrderForm from "@/components/OrderForm";
import AdminDemo from "@/components/AdminDemo";
import Footer from "@/components/Footer";
import FloatingButtons from "@/components/FloatingButtons";
import NotFound from "@/pages/not-found";
import PrivacyPolicy from "@/pages/privacy";
import TermsOfService from "@/pages/terms";
import AuthPage from "@/pages/auth-page";

// Home Page Component
function HomePage() {
  return (
    <div>
      <Hero />
      <Services />
      <GameShowcase />
      <Reviews />
    </div>
  );
}

// Router Component
function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/games" component={GameShowcase} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/contact" component={Contact} />
      <Route path="/order" component={OrderForm} />
      <Route path="/admin-demo" component={AdminDemo} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="pt-16">
              <ScrollToTop />
              <Router />
            </main>
            <Footer />
            <FloatingButtons />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;