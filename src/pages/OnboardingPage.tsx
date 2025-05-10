
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OnboardingPage = () => {
  const [isCompleting, setIsCompleting] = useState(false);
  const navigate = useNavigate();
  const { user, refreshProfile, setIsNewUser } = useAuth();
  
  useEffect(() => {
    // Redirect if user is not logged in
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);
  
  const handleOnboardingComplete = async (formData: any) => {
    setIsCompleting(true);
    
    try {
      // Update the user's onboarding status
      if (user) {
        await supabase
          .from('profiles')
          .update({ 
            username: formData.nickname || user.email?.split('@')[0],
            full_name: formData.fullName,
            fitness_level: formData.fitnessLevel || 'beginner', // Ensure a default value
            fitness_goal: formData.fitnessGoal || 'general fitness',
            workout_type: formData.workoutType || 'mixed',
            age: formData.age ? parseInt(formData.age) : null,
            height: formData.height ? parseFloat(formData.height) : null,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            gender: formData.gender || 'prefer_not_to_say',
            preferred_workout_time: formData.workoutTime || 'anytime',
            data_source: formData.dataSourceType || 'none',
            allow_notifications: formData.allowNotifications
          })
          .eq('id', user.id);
        
        // Refresh user profile data after onboarding
        await refreshProfile();
        setIsNewUser(false);
      }
      
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
