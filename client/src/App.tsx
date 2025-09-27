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
import HomepageScreenshots from "@/components/HomepageScreenshots";
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
import OrderPage from "@/pages/order-page";
import OrderStatusPage from "@/pages/order-status";
import AdminPanel from "@/pages/admin-panel";
import AdminLogin from "@/pages/admin-login";
import ApiPartners from "@/components/ApiPartners"; // ✅ Import ApiPartners page
import Portfolio from "@/components/Portfolio";
import StatusPage from "@/pages/status";
import { ProtectedRoute } from "@/lib/protected-route";

// Home Page Component
function HomePage() {
  return (
    <div>
      <Hero />
      <Services />
      <HomepageScreenshots />
      <Portfolio />
      <ApiPartners />
      <Reviews />
    </div>
  );
}

// Router Component
function Router() {
  return (
    <Switch>
      <Route path="/admin-rs" component={AdminPanel} />
      <Route path="/admin-rs/login" component={AdminPanel} />
      <Route path="/" component={HomePage} />
      <Route path="/about" component={About} />
      <Route path="/services" component={Services} />
      <Route path="/app-demo" component={GameShowcase} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/contact" component={Contact} />
      <Route path="/order-old" component={OrderForm} />
      <ProtectedRoute path="/order" component={OrderPage} />
      <ProtectedRoute path="/order-status" component={OrderStatusPage} />
      <Route path="/admin-demo" component={AdminDemo} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/api-partners" component={ApiPartners} /> {/* ✅ New route */}
      <Route path="/portfolio" component={Portfolio} /> {/* ✅ Portfolio route */}
      <Route path="/status" component={StatusPage} /> {/* ✅ Status page route */}
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
