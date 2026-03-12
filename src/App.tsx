import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/auth/AuthProvider";
import AdminRouteGuard from "./components/auth/AdminRouteGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import CookieConsent from "./components/CookieConsent";

const queryClient = new QueryClient();
const About = lazy(() => import("./pages/About"));
const AllProjects = lazy(() => import("./pages/AllProjects"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const WebDevelopment = lazy(() => import("./pages/services/WebDevelopment"));
const ReactDevelopment = lazy(() => import("./pages/services/ReactDevelopment"));
const LandingPages = lazy(() => import("./pages/services/LandingPages"));
const WebsitePerformance = lazy(() => import("./pages/services/WebsitePerformance"));
const WebsiteDevelopment = lazy(() => import("./pages/services/WebsiteDevelopment"));
const BusinessWebsite = lazy(() => import("./pages/services/BusinessWebsite"));
const AppointmentSystem = lazy(() => import("./pages/services/AppointmentSystem"));
const LandingPageDevelopment = lazy(() => import("./pages/services/LandingPageDevelopment"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPortfolio = lazy(() => import("./pages/AdminPortfolio"));

const RouteFallback = () => <div className="min-h-screen bg-background" aria-hidden="true" />;

const withRouteSuspense = (node: ReactNode) => <Suspense fallback={<RouteFallback />}>{node}</Suspense>;

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
            <Route path="/about" element={withRouteSuspense(<About />)} />
            <Route path="/projects" element={withRouteSuspense(<AllProjects />)} />
            <Route path="/accessibility" element={withRouteSuspense(<Accessibility />)} />
            <Route path="/privacy" element={withRouteSuspense(<Privacy />)} />
            <Route path="/faq" element={withRouteSuspense(<FAQ />)} />
            <Route path="/terms" element={withRouteSuspense(<Terms />)} />
            <Route path="/contact" element={withRouteSuspense(<Contact />)} />
            <Route path="/services/web-development" element={withRouteSuspense(<WebDevelopment />)} />
            <Route path="/services/react-development" element={withRouteSuspense(<ReactDevelopment />)} />
            <Route path="/services/landing-pages" element={withRouteSuspense(<LandingPages />)} />
            <Route path="/services/website-performance" element={withRouteSuspense(<WebsitePerformance />)} />
            <Route path="/services/website-development" element={withRouteSuspense(<WebsiteDevelopment />)} />
            <Route path="/services/business-website" element={withRouteSuspense(<BusinessWebsite />)} />
            <Route path="/services/appointment-system" element={withRouteSuspense(<AppointmentSystem />)} />
            <Route path="/services/landing-page-development" element={withRouteSuspense(<LandingPageDevelopment />)} />
            <Route path="/admin/login" element={withRouteSuspense(<AdminLogin />)} />
            <Route element={<AdminRouteGuard />}>
              <Route path="/admin/portfolio" element={withRouteSuspense(<AdminPortfolio />)} />
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
