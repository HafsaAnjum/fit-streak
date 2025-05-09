import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { ArrowRight, ArrowLeft, CheckCircle2, Activity, Dumbbell, User, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import FitnessSourceConnector from "./FitnessSourceConnector";
import GoalSelection from "./GoalSelection";
import WorkoutPreferences from "./WorkoutPreferences";

interface OnboardingProps {
  onComplete: () => void;
}

const UserInfoSchema = z.object({
  age: z.string().min(1, "Age is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  gender: z.string().min(1, "Gender is required"),
  workoutTime: z.string().min(1, "Preferred workout time is required"),
});

type UserInfoValues = z.infer<typeof UserInfoSchema>;

const OnboardingWizard: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
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
    goals: [] as string[],
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
      try {
        await handleSubmit();
      } catch (error) {
        console.error('Error during submission:', error);
        toast.error("Failed to complete onboarding. Please try again.");
      }
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
      // Fix the Promise handling with proper chaining
      supabase
        .from('profiles')
        .update({
          fitness_level: 'beginner', // Default value
          username: user.email?.split('@')[0] || 'user' // Basic username from email
        })
        .eq('id', user.id)
        .then(() => {
          // Refresh the profile data using proper promise chaining
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

  const handleSubmit = async () => {
    try {
      // Save user profile data to Supabase
      if (user) {
        const { error } = await supabase
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
          
        if (error) {
          console.error('Error saving profile:', error);
          toast.error("Failed to save your profile");
          return;
        }
      }
      
      toast.success("Profile set up successfully!");
      
      // Fixed promise handling using proper async/await pattern
      try {
        await refreshProfile();
        onComplete(); // This will trigger navigation to the home page
      } catch (refreshError) {
        console.error('Error refreshing profile:', refreshError);
        // Even if refreshing fails, still complete onboarding
        onComplete();
      }
    } catch (error) {
      console.error('Error in onboarding submission:', error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
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
                {step === 1 && (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto bg-primary/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                      <Activity className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h2 className="text-xl font-semibold">Start Your Fitness Journey</h2>
                    
                    <p className="text-muted-foreground">
                      FitStreak helps you track workouts, set goals, and stay motivated with personalized insights.
                    </p>
                    
                    <div className="py-4 grid grid-cols-2 gap-4">
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <Heart className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm font-medium">Health Tracking</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <Dumbbell className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm font-medium">Workout Plans</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <CheckCircle2 className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm font-medium">Goal Setting</span>
                      </div>
                      <div className="flex flex-col items-center p-3 bg-secondary/30 rounded-lg">
                        <User className="h-6 w-6 text-primary mb-2" />
                        <span className="text-sm font-medium">Personal Stats</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      Let's create your personalized fitness profile in a few simple steps.
                    </p>
                  </div>
                )}

                {step === 2 && (
                  <GoalSelection 
                    selectedGoal={formData.fitnessGoal}
                    onSelectGoal={handleGoalSelect}
                  />
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Tell Us About Yourself</h2>
                    
                    <Form {...userInfoForm}>
                      <form className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={userInfoForm.control}
                            name="age"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Age</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="Years" 
                                    {...field} 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userInfoForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender</FormLabel>
                                <Select 
                                  onValueChange={field.onChange} 
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={userInfoForm.control}
                            name="height"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Height (cm)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="cm" 
                                    {...field} 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={userInfoForm.control}
                            name="weight"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Weight (kg)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="kg" 
                                    {...field} 
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={userInfoForm.control}
                          name="workoutTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Workout Time</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="early_morning">Early Morning (5am-8am)</SelectItem>
                                  <SelectItem value="morning">Morning (8am-11am)</SelectItem>
                                  <SelectItem value="afternoon">Afternoon (11am-4pm)</SelectItem>
                                  <SelectItem value="evening">Evening (4pm-8pm)</SelectItem>
                                  <SelectItem value="night">Night (8pm-12am)</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  </div>
                )}
                
                {step === 4 && (
                  <FitnessSourceConnector
                    onConnect={handleSourceConnect}
                  />
                )}
                
                {step === 5 && (
                  <WorkoutPreferences
                    selectedLevel={formData.fitnessLevel}
                    selectedType={formData.workoutType}
                    onPreferencesChange={handleWorkoutPreferences}
                  />
                )}

                {step === 6 && (
                  <div className="space-y-4 text-center">
                    <div className="mx-auto bg-green-500/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4">
                      <CheckCircle2 className="h-10 w-10 text-green-500" />
                    </div>
                    
                    <h2 className="text-xl font-semibold">You're All Set!</h2>
                    
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h3 className="font-medium">Your Fitness Profile</h3>
                      <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                        {formData.fitnessGoal && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Goal:</span>
                            <span className="font-medium">{formData.fitnessGoal}</span>
                          </div>
                        )}
                        {formData.fitnessLevel && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Level:</span>
                            <span className="font-medium">{formData.fitnessLevel}</span>
                          </div>
                        )}
                        {formData.workoutType && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Workout:</span>
                            <span className="font-medium">{formData.workoutType}</span>
                          </div>
                        )}
                        {formData.dataSourceType && (
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Connected:</span>
                            <span className="font-medium">{formData.dataSourceType}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm">
                      Your personalized dashboard is ready. You can update your preferences anytime from your profile settings.
                    </p>
                    
                    <div className="flex items-center space-x-2 text-sm justify-center mt-2">
                      <Checkbox 
                        id="notifications" 
                        checked={formData.allowNotifications}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, allowNotifications: !!checked })
                        }
                      />
                      <Label htmlFor="notifications">Send me workout reminders and tips</Label>
                    </div>
                  </div>
                )}
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
