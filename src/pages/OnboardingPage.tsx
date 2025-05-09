
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { toast } from "sonner";

const OnboardingPage = () => {
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleOnboardingComplete = async () => {
    setIsCompleting(true);
    
    try {
      // Simulated delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast.error("Failed to complete onboarding");
    } finally {
      setIsCompleting(false);
    }
  };
  
  if (isCompleting) {
    return <FullPageLoader />;
  }
  
  if (!user) {
    // If not logged in, redirect to auth page
    navigate("/auth");
    return <FullPageLoader />;
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-background to-secondary/20"
    >
      <div className="container max-w-7xl mx-auto py-6 px-4">
        <OnboardingWizard onComplete={handleOnboardingComplete} />
      </div>
    </motion.div>
  );
};

export default OnboardingPage;
