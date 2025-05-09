
import React from "react";
import { Activity, Heart, Dumbbell, CheckCircle2, User } from "lucide-react";
import { StepContentProps } from "../types";

const WelcomeStep: React.FC<StepContentProps> = () => {
  return (
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
  );
};

export default WelcomeStep;
