
import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingProps {
  onComplete: () => void;
}

const OnboardingWizard: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    nickname: "",
    gender: "",
    age: "",
    fitnessLevel: "",
    goals: [] as string[],
    allowNotifications: false,
  });
  const { toast } = useToast();
  const { refreshProfile } = useAuth();

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 1 && !formData.fullName) {
      toast({
        title: "Please enter your name",
        description: "We need your name to proceed",
        variant: "destructive",
      });
      return;
    }
    
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit data and complete onboarding
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    toast({
      title: "Onboarding skipped",
      description: "You can always update your profile later",
    });
    onComplete();
  };

  const handleSubmit = async () => {
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated!",
    });
    await refreshProfile();
    onComplete();
  };

  const handleGoalToggle = (goal: string) => {
    setFormData(prev => {
      const currentGoals = prev.goals || [];
      if (currentGoals.includes(goal)) {
        return { ...prev, goals: currentGoals.filter(g => g !== goal) };
      } else {
        return { ...prev, goals: [...currentGoals, goal] };
      }
    });
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
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nickname">Nickname (displayed publicly)</Label>
                        <Input
                          id="nickname"
                          value={formData.nickname}
                          onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                          placeholder="Choose a nickname"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">About You</h2>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                          placeholder="Enter your age"
                        />
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <RadioGroup
                          value={formData.gender}
                          onValueChange={(value) => setFormData({ ...formData, gender: value })}
                          className="flex space-x-2 mt-2"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Male</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Female</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Fitness Profile</h2>
                    <div className="space-y-3">
                      <div>
                        <Label>Fitness Level</Label>
                        <Select 
                          value={formData.fitnessLevel}
                          onValueChange={(value) => setFormData({ ...formData, fitnessLevel: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select your fitness level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="advanced">Advanced</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label className="mb-2 block">Your Fitness Goals</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {["Lose Weight", "Build Muscle", "Improve Health", "Increase Endurance", "Reduce Stress", "Sports Performance"].map((goal) => (
                            <div key={goal} className="flex items-center space-x-2">
                              <Checkbox 
                                id={goal.replace(/\s+/g, '-').toLowerCase()} 
                                checked={formData.goals.includes(goal)}
                                onCheckedChange={() => handleGoalToggle(goal)}
                              />
                              <Label htmlFor={goal.replace(/\s+/g, '-').toLowerCase()}>{goal}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Final Steps</h2>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3 p-3 bg-muted/40 rounded-lg">
                        <Checkbox 
                          id="notifications" 
                          checked={formData.allowNotifications}
                          onCheckedChange={(checked) => 
                            setFormData({ ...formData, allowNotifications: checked as boolean })
                          }
                        />
                        <div>
                          <Label htmlFor="notifications" className="font-medium">Enable Notifications</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            Receive reminders about your workouts, achievements and tips to stay on track
                          </p>
                        </div>
                      </div>

                      <div className="bg-green-500/10 p-4 rounded-lg text-center">
                        <CheckCircle2 className="mx-auto h-10 w-10 text-green-500 mb-2" />
                        <h3 className="font-medium text-green-700">You're all set!</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Click 'Complete' to start your fitness journey
                        </p>
                      </div>
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
              {step === totalSteps ? 'Complete' : 'Continue'}
              {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
