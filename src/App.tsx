import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PartsDistribution from "./pages/PartsDistribution";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Placeholder component for modules not yet built
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex min-h-screen">
    <div className="flex-1 ml-64 p-12 flex flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">{title}</h1>
      <p className="text-muted-foreground">This enterprise module is currently under development.</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Main Modules */}
          <Route path="/parts" element={<PartsDistribution />} />
          <Route path="/services" element={<PlaceholderPage title="Services & Aftersales" />} />
          <Route path="/showroom" element={<PlaceholderPage title="Showroom & Sales" />} />
          <Route path="/accounting" element={<PlaceholderPage title="Accounting & Finance" />} />
          <Route path="/crm" element={<PlaceholderPage title="Customer Relations" />} />
          <Route path="/favorites" element={<PlaceholderPage title="Favorites" />} />
          <Route path="/tools" element={<PlaceholderPage title="Tools & Utilities" />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;