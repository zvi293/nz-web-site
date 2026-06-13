import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./components/auth/AuthProvider";
import AdminRouteGuard from "./components/auth/AdminRouteGuard";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CustomCursor from "./components/CustomCursor";
import ScrollToTop from "./components/ScrollToTop";
import Analytics from "./components/Analytics";
import CookieConsent from "./components/CookieConsent";
import ScrollProgressBar from "./components/ScrollProgressBar";
import PageTransition from "./components/PageTransition";

const queryClient = new QueryClient();

const About = lazy(() => import("./pages/About"));
const AllProjects = lazy(() => import("./pages/AllProjects"));
const Accessibility = lazy(() => import("./pages/Accessibility"));
const Privacy = lazy(() => import("./pages/Privacy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Terms = lazy(() => import("./pages/Terms"));
const Contact = lazy(() => import("./pages/Contact"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const ServicesIndex = lazy(() => import("./pages/services/ServicesIndex"));
const WebDevelopment = lazy(() => import("./pages/services/WebDevelopment"));
const ReactDevelopment = lazy(() => import("./pages/services/ReactDevelopment"));
const LandingPages = lazy(() => import("./pages/services/LandingPages"));
const WebsitePerformance = lazy(() => import("./pages/services/WebsitePerformance"));
const WebsiteDevelopment = lazy(() => import("./pages/services/WebsiteDevelopment"));
const BusinessWebsite = lazy(() => import("./pages/services/BusinessWebsite"));
const AppointmentSystem = lazy(() => import("./pages/services/AppointmentSystem"));
const LandingPageDevelopment = lazy(() => import("./pages/services/LandingPageDevelopment"));
const VerticalBusinessWebsite = lazy(() => import("./pages/services/VerticalBusinessWebsite"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminPortfolio = lazy(() => import("./pages/AdminPortfolio"));

const RouteFallback = () => (
  <div className="min-h-screen bg-background" aria-hidden="true" />
);

const wrap = (node: ReactNode) => (
  <Suspense fallback={<RouteFallback />}>
    <PageTransition>{node}</PageTransition>
  </Suspense>
);

/* ── Animated routes — must live inside BrowserRouter to use useLocation ── */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <>
      <ScrollProgressBar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><Index /></PageTransition>} />
          <Route path="/about" element={wrap(<About />)} />
          <Route path="/projects" element={wrap(<AllProjects />)} />
          <Route path="/accessibility" element={wrap(<Accessibility />)} />
          <Route path="/privacy" element={wrap(<Privacy />)} />
          <Route path="/faq" element={wrap(<FAQ />)} />
          <Route path="/terms" element={wrap(<Terms />)} />
          <Route path="/contact" element={wrap(<Contact />)} />
          <Route path="/thank-you" element={wrap(<ThankYou />)} />
          <Route path="/blog" element={wrap(<Blog />)} />
          <Route path="/blog/:slug" element={wrap(<BlogPost />)} />
          <Route path="/services" element={wrap(<ServicesIndex />)} />
          <Route path="/services/web-development" element={wrap(<WebDevelopment />)} />
          <Route path="/services/react-development" element={wrap(<ReactDevelopment />)} />
          <Route path="/services/landing-pages" element={wrap(<LandingPages />)} />
          <Route path="/services/website-performance" element={wrap(<WebsitePerformance />)} />
          <Route path="/services/website-development" element={wrap(<WebsiteDevelopment />)} />
          <Route path="/services/business-website" element={wrap(<BusinessWebsite />)} />
          <Route path="/services/business-website/:vertical" element={wrap(<VerticalBusinessWebsite />)} />
          <Route path="/services/appointment-system" element={wrap(<AppointmentSystem />)} />
          <Route path="/services/landing-page-development" element={wrap(<LandingPageDevelopment />)} />
          <Route path="/admin/login" element={wrap(<AdminLogin />)} />
          <Route element={<AdminRouteGuard />}>
            <Route path="/admin/portfolio" element={wrap(<AdminPortfolio />)} />
          </Route>
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CustomCursor />
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <Analytics />
          {/* Skip-to-content link — WCAG 2.4.1 "Bypass Blocks". Hidden until focused via keyboard. */}
          <a
            href="#main-content"
            onClick={(e) => {
              e.preventDefault();
              const main = document.getElementById("main-content");
              if (main) {
                main.setAttribute("tabindex", "-1");
                main.focus();
                main.scrollIntoView();
              }
            }}
            className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[10050] focus:rounded-lg focus:bg-primary focus:px-5 focus:py-2.5 focus:text-sm focus:font-bold focus:text-primary-foreground focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            דלג לתוכן הראשי
          </a>
          <div id="main-content">
            <AnimatedRoutes />
          </div>
          <CookieConsent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
