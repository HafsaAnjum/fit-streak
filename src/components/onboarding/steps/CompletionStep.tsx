
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { StepContentProps } from "../types";

const CompletionStep: React.FC<StepContentProps> = ({ formData, setFormData }) => {
  return (
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
  );
};

export default CompletionStep;
