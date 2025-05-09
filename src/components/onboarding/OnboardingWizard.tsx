
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";

// Import step components
import WelcomeStep from "./steps/WelcomeStep";
import UserInfoStep from "./steps/UserInfoStep";
import CompletionStep from "./steps/CompletionStep";
import GoalSelection from "./GoalSelection";
import WorkoutPreferences from "./WorkoutPreferences";
import FitnessSourceConnector from "./FitnessSourceConnector";

// Import types
import { OnboardingProps, OnboardingFormData, UserInfoSchema, UserInfoValues } from "./types";

const OnboardingWizard: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: "",
    nickname: "",
    fitnessGoal: "",
    fitnessLevel: "",
    workoutType: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    workoutTime: "",
    dataSourceConnected: false,
    dataSourceType: "",
    goals: [],
    allowNotifications: false,
  });
  const { user, refreshProfile } = useAuth();
  
  const totalSteps = 6;
  
  const userInfoForm = useForm<UserInfoValues>({
    resolver: zodResolver(UserInfoSchema),
    defaultValues: {
      age: "",
      height: "",
      weight: "",
      gender: "",
      workoutTime: "",
    },
  });

  const handleNext = async () => {
    if (step === 1) {
      // Welcome step, no validation needed
      setStep(step + 1);
      return;
    }
    
    if (step === 2) {
      // Goal selection validation
      if (!formData.fitnessGoal) {
        toast.error("Please select a fitness goal");
        return;
      }
      setStep(step + 1);
      return;
    }
    
    if (step === 3) {
      // User Info validation using react-hook-form
      try {
        const result = await userInfoForm.trigger();
        if (!result) {
          return; // Form validation will show errors
        }
        
        const values = userInfoForm.getValues();
        setFormData(prev => ({
          ...prev,
          age: values.age,
          height: values.height,
          weight: values.weight,
          gender: values.gender,
          workoutTime: values.workoutTime,
        }));
        
        setStep(step + 1);
      } catch (error) {
        console.error("Error validating form:", error);
        toast.error("Please complete all required fields");
      }
      return;
    }
    
    if (step === 4) {
      // Data source connection, can skip
      setStep(step + 1);
      return;
    }
    
    if (step === 5) {
      // Workout preferences validation
      if (!formData.fitnessLevel || !formData.workoutType) {
        toast.error("Please select your fitness level and workout type");
        return;
      }
      setStep(step + 1);
      return;
    }
    
    if (step === totalSteps) {
      // Final step, submit everything
      handleSubmit();
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    // Ensure we correctly handle skipping onboarding
    toast.success("Onboarding skipped");
    toast.info("You can always update your profile later");
    
    // If the user is authenticated, update their profile with minimal data
    if (user) {
      // Fixed: Using Promise.resolve to ensure the .then chain can properly handle TypeScript PromiseLike
      Promise.resolve()
        .then(() => {
          return supabase
            .from('profiles')
            .update({
              fitness_level: 'beginner', // Default value
              username: user.email?.split('@')[0] || 'user' // Basic username from email
            })
            .eq('id', user.id);
        })
        .then(() => {
          // Refresh the profile data
          return refreshProfile();
        })
        .then(() => {
          // Complete onboarding
          onComplete();
        })
        .catch(error => {
          console.error('Error updating profile during skip:', error);
          // Still complete onboarding even if there's an error
          onComplete();
        });
    } else {
      // If somehow there's no user, just complete
      onComplete();
    }
  };
  
  const handleSourceConnect = (source: string, connected: boolean) => {
    setFormData(prev => ({
      ...prev,
      dataSourceConnected: connected,
      dataSourceType: source
    }));
    
    if (connected) {
      toast.success(`Successfully connected to ${source}!`);
    }
    
    // If skipped, continue to next step
    if (!connected) {
      setStep(5); // Move to workout preferences
    }
  };

  const handleGoalSelect = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      fitnessGoal: goal
    }));
  };
  
  const handleWorkoutPreferences = (level: string, type: string) => {
    setFormData(prev => ({
      ...prev,
      fitnessLevel: level,
      workoutType: type
    }));
  };

  const handleSubmit = () => {
    // Save user profile data to Supabase
    if (user) {
      // Fixed: Using Promise.resolve to ensure the .then chain can properly handle TypeScript PromiseLike
      Promise.resolve()
        .then(() => {
          return supabase
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
        })
        .then(() => {
          toast.success("Profile set up successfully!");
          return refreshProfile();
        })
        .then(() => {
          onComplete(); // This will trigger navigation to the home page
        })
        .catch(error => {
          console.error('Error in onboarding submission:', error);
          toast.error("Something went wrong. Please try again.");
        });
    } else {
      // No user, just complete onboarding
      toast.success("Setup completed!");
      onComplete();
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <WelcomeStep formData={formData} setFormData={setFormData} />;
        
      case 2:
        return (
          <GoalSelection 
            selectedGoal={formData.fitnessGoal}
            onSelectGoal={handleGoalSelect}
          />
        );
        
      case 3:
        return <UserInfoStep formData={formData} setFormData={setFormData} userInfoForm={userInfoForm} />;
        
      case 4:
        return (
          <FitnessSourceConnector
            onConnect={handleSourceConnect}
          />
        );
        
      case 5:
        return (
          <WorkoutPreferences
            selectedLevel={formData.fitnessLevel}
            selectedType={formData.workoutType}
            onPreferencesChange={handleWorkoutPreferences}
          />
        );
        
      case 6:
        return <CompletionStep formData={formData} setFormData={setFormData} />;
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10 text-center">
            <CardTitle className="text-xl font-bold">Welcome to FitStreak!</CardTitle>
            <div className="flex justify-center mt-2 gap-1">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-12 rounded-full transition-colors ${
                    i + 1 === step ? "bg-primary" : i + 1 < step ? "bg-primary/60" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={stepVariants}
              transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
            >
              <CardContent className="p-6">
                {renderStepContent()}
              </CardContent>
            </motion.div>
          </AnimatePresence>

          <CardFooter className="flex justify-between border-t p-4 bg-muted/20">
            <div>
              {step > 1 ? (
                <Button variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Setup
                </Button>
              )}
            </div>
            <Button onClick={handleNext}>
              {step === 1 ? "Let's Get Started" : step === totalSteps ? 'Complete' : 'Continue'}
              {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
