
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cabinet from "./pages/Cabinet";
import FullResult from "./pages/FullResult";
import Compatibility from "./pages/Compatibility";
import ChildAnalysis from "./pages/ChildAnalysis";
import Balance from "./pages/Balance";
import Admin from "./pages/Admin";
import FamilyMatrix from "./pages/FamilyMatrix";
import DestinyMap from "./pages/DestinyMap";
import Catalog from "./pages/Catalog";
import History from "./pages/History";
import EmotionChain from "./pages/EmotionChain";
import EmotionChainResult from "./pages/EmotionChainResult";
import Barriers from "./pages/Barriers";
import LangRelations from "./pages/LangRelations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/result" element={<FullResult />} />
          <Route path="/compatibility" element={<Compatibility />} />
          <Route path="/child" element={<ChildAnalysis />} />
          <Route path="/balance" element={<Balance />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/family" element={<FamilyMatrix />} />
          <Route path="/destiny" element={<DestinyMap />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/history" element={<History />} />
          <Route path="/trainer/emotion-chain" element={<EmotionChain />} />
          <Route path="/trainer/emotion-chain/result" element={<EmotionChainResult />} />
          <Route path="/trainer/barriers" element={<Barriers />} />
          <Route path="/trainer/lang-relations" element={<LangRelations />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;