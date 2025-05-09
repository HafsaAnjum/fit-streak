
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface WorkoutPreferencesProps {
  selectedLevel: string;
  selectedType: string;
  onPreferencesChange: (level: string, type: string) => void;
}

const WorkoutPreferences: React.FC<WorkoutPreferencesProps> = ({
  selectedLevel,
  selectedType,
  onPreferencesChange,
}) => {
  const handleLevelChange = (level: string) => {
    onPreferencesChange(level, selectedType);
  };

  const handleTypeChange = (type: string) => {
    onPreferencesChange(selectedLevel, type);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Workout Preferences</h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-3">Fitness Level</h3>
          <RadioGroup
            value={selectedLevel}
            onValueChange={handleLevelChange}
            className="grid gap-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
              <RadioGroupItem value="Beginner" id="beginner" />
              <div className="grid gap-0.5">
                <Label htmlFor="beginner" className="font-medium">Beginner</Label>
                <p className="text-sm text-muted-foreground">New to fitness or returning after a long break</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
              <RadioGroupItem value="Intermediate" id="intermediate" />
              <div className="grid gap-0.5">
                <Label htmlFor="intermediate" className="font-medium">Intermediate</Label>
                <p className="text-sm text-muted-foreground">Regularly active with some fitness experience</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
              <RadioGroupItem value="Advanced" id="advanced" />
              <div className="grid gap-0.5">
                <Label htmlFor="advanced" className="font-medium">Advanced</Label>
                <p className="text-sm text-muted-foreground">Very fit with significant workout experience</p>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Workout Type</h3>
          <RadioGroup
            value={selectedType}
            onValueChange={handleTypeChange}
            className="grid gap-3"
          >
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
              <RadioGroupItem value="Cardio" id="cardio" />
              <div className="grid gap-0.5">
                <Label htmlFor="cardio" className="font-medium">Cardio</Label>
                <p className="text-sm text-muted-foreground">Running, cycling, swimming, HIIT</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
              <RadioGroupItem value="Strength" id="strength" />
              <div className="grid gap-0.5">
                <Label htmlFor="strength" className="font-medium">Strength Training</Label>
                <p className="text-sm text-muted-foreground">Weightlifting, resistance training, bodyweight</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/30 cursor-pointer">
              <RadioGroupItem value="Mixed" id="mixed" />
              <div className="grid gap-0.5">
                <Label htmlFor="mixed" className="font-medium">Mixed</Label>
                <p className="text-sm text-muted-foreground">Balanced combination of cardio and strength</p>
              </div>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default WorkoutPreferences;
