import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import AdminRouteGuard from "./components/auth/AdminRouteGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminPortfolio from "./pages/AdminPortfolio";
import AdminLogin from "./pages/AdminLogin";
import AllProjects from "./pages/AllProjects";
import About from "./pages/About";
import Accessibility from "./pages/Accessibility";
import Privacy from "./pages/Privacy";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import WebDevelopment from "./pages/services/WebDevelopment";
import ReactDevelopment from "./pages/services/ReactDevelopment";
import LandingPages from "./pages/services/LandingPages";
import WebsitePerformance from "./pages/services/WebsitePerformance";
import WebsiteDevelopment from "./pages/services/WebsiteDevelopment";
import BusinessWebsite from "./pages/services/BusinessWebsite";
import AppointmentSystem from "./pages/services/AppointmentSystem";
import LandingPageDevelopment from "./pages/services/LandingPageDevelopment";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/accessibility" element={<Accessibility />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services/web-development" element={<WebDevelopment />} />
            <Route path="/services/react-development" element={<ReactDevelopment />} />
            <Route path="/services/landing-pages" element={<LandingPages />} />
            <Route path="/services/website-performance" element={<WebsitePerformance />} />
            <Route path="/services/website-development" element={<WebsiteDevelopment />} />
            <Route path="/services/business-website" element={<BusinessWebsite />} />
            <Route path="/services/appointment-system" element={<AppointmentSystem />} />
            <Route path="/services/landing-page-development" element={<LandingPageDevelopment />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminRouteGuard />}>
              <Route path="/admin/portfolio" element={<AdminPortfolio />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieConsent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
