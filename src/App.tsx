
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import ActivityTracker from "@/components/ActivityTracker";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Settings from "@/components/Settings";
import UserProfile from "@/components/UserProfile";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import GoogleFitCallback from "@/components/GoogleFitCallback";
import FitnessDashboard from "@/components/dashboard/FitnessDashboard";
import WorkoutSessionPage from "@/pages/WorkoutSessionPage"; // Added new workout session page
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-8 flex-1">
            <Routes>
              {/* Redirect root to auth if not authenticated */}
              <Route path="/" element={<Navigate to="/auth" replace />} />
              <Route path="/auth/*" element={<AuthPage />} />
              <Route path="/onboarding/*" element={<OnboardingPage />} />
              <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              
              {/* Protected routes */}
              <Route path="/workout-session" element={<ProtectedRoute><WorkoutSessionPage /></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute><ActivityTracker /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/fitness" element={<ProtectedRoute><FitnessDashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              
              {/* OAuth callback route */}
              <Route path="/auth/google-fit/callback" element={<GoogleFitCallback />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Toaster position="top-center" />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
