
import React from "react";
import { Dumbbell, TrendingDown, Heart, Activity } from "lucide-react";

interface GoalSelectionProps {
  selectedGoal: string;
  onSelectGoal: (goal: string) => void;
}

const GoalSelection: React.FC<GoalSelectionProps> = ({ selectedGoal, onSelectGoal }) => {
  const goals = [
    {
      id: "lose_weight",
      title: "Lose Weight",
      description: "Burn calories and shed pounds with cardio and HIIT workouts",
      icon: <TrendingDown className="h-8 w-8 text-primary" />
    },
    {
      id: "build_muscle", 
      title: "Build Muscle",
      description: "Gain strength and muscle mass with resistance training",
      icon: <Dumbbell className="h-8 w-8 text-primary" />
    },
    {
      id: "maintain_fitness",
      title: "Maintain Fitness",
      description: "Stay active and healthy with balanced workout routines",
      icon: <Heart className="h-8 w-8 text-primary" />
    },
    {
      id: "other",
      title: "Other",
      description: "Custom fitness goals for your specific needs",
      icon: <Activity className="h-8 w-8 text-primary" />
    }
  ];
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">What's your primary fitness goal?</h2>
      
      <div className="grid gap-4">
        {goals.map((goal) => (
          <div 
            key={goal.id}
            className={`
              flex items-start p-4 rounded-lg cursor-pointer transition-all
              ${selectedGoal === goal.title ? 
                'border-2 border-primary bg-primary/5' : 
                'border border-border hover:border-primary/50 hover:bg-muted/30'}
            `}
            onClick={() => onSelectGoal(goal.title)}
          >
            <div className="mr-4">
              {goal.icon}
            </div>
            <div>
              <h3 className="font-medium">{goal.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoalSelection;
