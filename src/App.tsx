
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import WorkoutPlanner from "@/components/WorkoutPlanner";
import ActivityTracker from "@/components/ActivityTracker";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Settings from "@/components/Settings";
import UserProfile from "@/components/UserProfile";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import GoogleFitCallback from "@/components/GoogleFitCallback";
import FitbitCallback from "@/components/FitbitCallback";
import FitnessDashboard from "@/components/dashboard/FitnessDashboard";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navigation />
          <main className="container mx-auto px-4 py-8 flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth/*" element={<AuthPage />} />
              <Route path="/onboarding/*" element={<OnboardingPage />} />
              
              {/* Protected routes */}
              <Route path="/workouts" element={<ProtectedRoute><WorkoutPlanner /></ProtectedRoute>} />
              <Route path="/activities" element={<ProtectedRoute><ActivityTracker /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
              <Route path="/fitness" element={<ProtectedRoute><FitnessDashboard /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              
              {/* OAuth callback routes */}
              <Route path="/auth/google-fit/callback" element={<GoogleFitCallback />} />
              <Route path="/auth/fitbit/callback" element={<FitbitCallback />} />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
