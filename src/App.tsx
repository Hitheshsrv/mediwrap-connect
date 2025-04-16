import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";

// Pages
import Index from "./pages/Index";
import Consultation from "./pages/Consultation";
import Pharmacy from "./pages/Pharmacy";
import BloodDonation from "./pages/BloodDonation";
import Community from "./pages/Community";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import DoctorRegistration from "./pages/DoctorRegistration";
import DoctorPanel from "./pages/DoctorPanel";
import NotFound from "./pages/NotFound";
import { useAuth } from "@/hooks/useAuth";

// Protected Route for Doctor
const DoctorRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'doctor') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/pharmacy" element={<Pharmacy />} />
              <Route path="/blood-donation" element={<BloodDonation />} />
              <Route path="/community" element={<Community />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/doctor-registration" element={<DoctorRegistration />} />

              {/* Protected Doctor Routes */}
              <Route path="/doctor/*" element={
                <DoctorRoute>
                  <Routes>
                    <Route path="/" element={<DoctorPanel />} />
                    <Route path="*" element={<Navigate to="/doctor" />} />
                  </Routes>
                </DoctorRoute>
              } />

              {/* Protected Admin Routes */}
              <Route path="/admin" element={<Admin />} />

              {/* Catch-all Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
