
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, isNewUser, setIsNewUser } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(isNewUser);
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <LoadingSpinner size={40} />
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    setIsNewUser(false);
  };
  
  return (
    <>
      {children}
      {showOnboarding && <OnboardingWizard onComplete={handleOnboardingComplete} />}
    </>
  );
}
