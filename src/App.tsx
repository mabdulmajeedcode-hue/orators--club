import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SitePopup from "@/components/SitePopup";
import ScrollToTop from "@/components/ScrollToTop";
import { VantaBackground } from "@/components/ui/vanta-background";
import { CustomCursor } from "@/components/ui/custom-cursor";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy-loaded heavier pages — keep Home eager for fastest first paint
const About = lazy(() => import("./pages/About"));
const Events = lazy(() => import("./pages/Events"));
const Podcasts = lazy(() => import("./pages/Podcasts"));
const Gallery = lazy(() => import("./pages/Gallery"));
const GalleryDetail = lazy(() => import("./pages/GalleryDetail"));
const Team = lazy(() => import("./pages/Team"));
const Contact = lazy(() => import("./pages/Contact"));
const Join = lazy(() => import("./pages/Join"));
const Admin = lazy(() => import("./pages/Admin"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader2 className="h-10 w-10 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <VantaBackground />
        <CustomCursor />
        <div className="relative z-10">
          <Navbar />
          <SitePopup />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/podcasts" element={<Podcasts />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/gallery/:id" element={<GalleryDetail />} />
              <Route path="/team" element={<Team />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/join" element={<Join />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
