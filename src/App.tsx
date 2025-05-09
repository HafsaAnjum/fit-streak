
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Navigation from "@/components/Navigation";
import ActivityTracker from "@/components/ActivityTracker";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import UserProfile from "@/components/UserProfile";
import AuthPage from "@/pages/AuthPage";
import OnboardingPage from "@/pages/OnboardingPage";
import NotFound from "@/pages/NotFound";
import Index from "@/pages/Index";
import GoogleFitCallback from "@/components/GoogleFitCallback";
import FitnessDashboard from "@/components/dashboard/FitnessDashboard";
import WorkoutSessionPage from "@/pages/WorkoutSessionPage";
import CommunityPage from "@/pages/CommunityPage";
import PublicProfilePage from "@/pages/PublicProfilePage";
import SettingsPage from "@/pages/SettingsPage";
import { Toaster } from "sonner";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="container mx-auto px-4 py-8 flex-1">
              <Routes>
                {/* Public routes */}
                <Route path="/auth/*" element={<AuthPage />} />
                <Route path="/onboarding/*" element={<OnboardingPage />} />
                <Route path="/u/:userId" element={<PublicProfilePage />} />
                
                {/* Auth callback routes */}
                <Route path="/auth/google-fit/callback" element={<GoogleFitCallback />} />
                
                {/* Protected routes */}
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<ProtectedRoute><Index /></ProtectedRoute>} />
                <Route path="/workout-session" element={<ProtectedRoute><WorkoutSessionPage /></ProtectedRoute>} />
                <Route path="/activities" element={<ProtectedRoute><ActivityTracker /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
                <Route path="/fitness" element={<ProtectedRoute><FitnessDashboard /></ProtectedRoute>} />
                <Route path="/community" element={<ProtectedRoute><CommunityPage /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                
                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster position="top-center" richColors />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
