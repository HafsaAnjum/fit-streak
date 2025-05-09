
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Brain } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WorkoutExercise {
  name: string;
  desc: string;
}

interface WorkoutDay {
  day: number;
  exercises: WorkoutExercise[];
}

const AIWorkoutPlanner = () => {
  const [goal, setGoal] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [days, setDays] = useState<string>("");
  const [plan, setPlan] = useState<WorkoutDay[]>([]);
  const { toast } = useToast();

  const exercises = {
    weight_loss: [
      {name:"Jumping Jacks",desc:"3 sets of 30 seconds"},
      {name:"Burpees",desc:"3 sets of 10 reps"},
      {name:"Mountain Climbers",desc:"3 sets of 30 seconds"},
      {name:"High Knees",desc:"3 sets of 30 seconds"},
      {name:"Bodyweight Squats",desc:"3 sets of 15 reps"},
      {name:"Plank",desc:"3 sets of 30 seconds"},
      {name:"Lunges",desc:"3 sets of 12 reps each leg"}
    ],
    muscle_gain: [
      {name:"Push-ups",desc:"4 sets of 10-15 reps"},
      {name:"Pull-ups / Rows",desc:"4 sets of 6-10 reps"},
      {name:"Squats",desc:"4 sets of 12 reps"},
      {name:"Overhead Press",desc:"4 sets of 8-12 reps"},
      {name:"Deadlifts",desc:"4 sets of 6-10 reps"},
      {name:"Bench Press",desc:"4 sets of 8-12 reps"},
      {name:"Plank",desc:"3 sets of 30-45 seconds"}
    ],
    endurance: [
      {name:"Running",desc:"20-30 minutes"},
      {name:"Cycling",desc:"30 minutes"},
      {name:"Jump Rope",desc:"5 sets of 1 minute"},
      {name:"Rowing",desc:"15-20 minutes"},
      {name:"Circuit Training",desc:"3 rounds"},
      {name:"Bodyweight Exercises",desc:"3 sets each"},
      {name:"Plank",desc:"3 sets of 1 minute"}
    ],
    flexibility: [
      {name:"Dynamic Stretching",desc:"10 minutes"},
      {name:"Yoga Flow",desc:"20-30 minutes"},
      {name:"Hamstring Stretch",desc:"3×30s each leg"},
      {name:"Shoulder Stretch",desc:"3×30s each arm"},
      {name:"Cat-Cow Pose",desc:"3 sets of 10 reps"},
      {name:"Child's Pose",desc:"Hold 1-2 minutes"},
      {name:"Seated Forward Bend",desc:"Hold 1-2 minutes"}
    ]
  };

  const expMul = { beginner: 1, intermediate: 1.5, advanced: 2 };

  const scale = (desc: string, m: number) => {
    let r = desc.match(/(\d+)-(\d+)/);
    if (r) return desc.replace(/\d+-\d+/, `${Math.round(Number(r[1])*m)}-${Math.round(Number(r[2])*m)}`);
    let s = desc.match(/(\d+)/);
    return s ? desc.replace(/\d+/, `${Math.round(Number(s[1])*m)}`) : desc;
  };

  const generatePlan = () => {
    if (!goal || !experience || !days) {
      toast({
        title: "Missing information",
        description: "Please fill all fields to generate a plan",
        variant: "destructive"
      });
      return;
    }

    const daysNum = parseInt(days, 10);
    if (isNaN(daysNum) || daysNum < 1 || daysNum > 7) {
      toast({
        title: "Invalid input",
        description: "Days must be between 1 and 7",
        variant: "destructive"
      });
      return;
    }
    
    const list = exercises[goal as keyof typeof exercises];
    const m = expMul[experience as keyof typeof expMul];
    const perDay = Math.min(5, Math.max(2, Math.floor(list.length / daysNum)));
    
    let newPlan: WorkoutDay[] = [];
    for (let d = 1; d <= daysNum; d++) {
      let today: WorkoutExercise[] = [];
      for (let i = 0; i < perDay; i++) {
        let ex = list[(d - 1 + i) % list.length];
        today.push({ name: ex.name, desc: scale(ex.desc, m) });
      }
      newPlan.push({ day: d, exercises: today });
    }
    
    setPlan(newPlan);
    toast({
      title: "Plan Generated!",
      description: `${daysNum}-day workout plan ready for you.`,
    });
  };

  return (
    <Card className="shadow-md border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-md">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>AI Workout Planner</CardTitle>
            <CardDescription>Generate your personalized workout plan</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="goal">Select your Fitness Goal</Label>
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger id="goal">
              <SelectValue placeholder="Choose a goal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight_loss">Weight Loss</SelectItem>
              <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
              <SelectItem value="endurance">Endurance</SelectItem>
              <SelectItem value="flexibility">Flexibility</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="experience">Select your Experience Level</Label>
          <Select value={experience} onValueChange={setExperience}>
            <SelectTrigger id="experience">
              <SelectValue placeholder="Choose experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="days">How many days per week can you train?</Label>
          <Input
            id="days"
            type="number"
            min={1}
            max={7}
            value={days}
            onChange={(e) => setDays(e.target.value)}
            placeholder="e.g. 3"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={generatePlan}>Generate Plan</Button>
      </CardFooter>
      
      {plan.length > 0 && (
        <CardContent>
          <div className="space-y-4 mt-4" role="region" aria-live="polite">
            {plan.map((day) => (
              <div key={day.day} className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Day {day.day}</h3>
                <ul className="space-y-2 pl-2">
                  {day.exercises.map((exercise, idx) => (
                    <li key={idx} className="grid grid-cols-[1fr_auto] gap-2">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-sm text-muted-foreground">{exercise.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default AIWorkoutPlanner;
