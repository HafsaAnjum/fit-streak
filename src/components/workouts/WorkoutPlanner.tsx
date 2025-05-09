
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dumbbell, Brain, ChevronRight, Clock, Calendar, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const mockWorkouts = [
  {
    id: 1,
    name: "HIIT Cardio",
    duration: "25 min",
    difficulty: "Medium",
    equipment: "None",
    focus: "Cardio, Fat Loss",
    aiRecommended: true,
    scheduled: "Today, 6:30 PM",
  },
  {
    id: 2,
    name: "Upper Body Strength",
    duration: "40 min",
    difficulty: "Hard",
    equipment: "Dumbbells",
    focus: "Strength, Muscle",
    aiRecommended: true,
  },
  {
    id: 3,
    name: "Yoga Flow",
    duration: "30 min",
    difficulty: "Easy",
    equipment: "Mat",
    focus: "Flexibility, Recovery",
    aiRecommended: false,
  },
  {
    id: 4,
    name: "Core Blast",
    duration: "20 min",
    difficulty: "Medium",
    equipment: "None",
    focus: "Core, Strength",
    aiRecommended: false,
  },
];

interface WorkoutItemProps {
  workout: {
    id: number;
    name: string;
    duration: string;
    difficulty: string;
    equipment: string;
    focus: string;
    aiRecommended: boolean;
    scheduled?: string;
  };
}

const WorkoutItem = React.memo(({ workout }: WorkoutItemProps) => {
  return (
    <Card className="overflow-hidden border bg-card">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium truncate flex items-center">
              {workout.name}
              {workout.aiRecommended && (
                <Badge variant="secondary" className="ml-2 text-[10px] py-0 h-5">
                  <Sparkles className="h-3 w-3 mr-1" /> AI Pick
                </Badge>
              )}
            </h4>
            <div className="flex items-center mt-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              <span>{workout.duration}</span>
              <span className="mx-2">•</span>
              <span>{workout.difficulty}</span>
            </div>
          </div>
          <Link to="/workout-session">
            <Button size="icon" variant="ghost" className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          {workout.focus.split(", ").map((focus, idx) => (
            <Badge key={idx} variant="outline" className="text-[10px] bg-secondary/50">
              {focus}
            </Badge>
          ))}
        </div>
        
        {workout.scheduled && (
          <div className="mt-3 pt-3 border-t text-xs flex justify-between items-center">
            <span className="text-muted-foreground">Scheduled:</span>
            <span className="font-medium">{workout.scheduled}</span>
          </div>
        )}
      </div>
    </Card>
  );
});

WorkoutItem.displayName = 'WorkoutItem';

const WorkoutPlanner = () => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 p-1.5 rounded-md bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg font-medium">AI Workout Planner</CardTitle>
          </div>
          <Button size="sm">New Plan</Button>
        </div>
        <CardDescription>
          Smart workout recommendations based on your activity and goals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="font-medium flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> 
            Today's Recommended Workout
          </p>
        </div>
        
        <ScrollArea className="h-[280px] pr-4">
          <div className="space-y-3">
            {mockWorkouts.map((workout) => (
              <WorkoutItem key={workout.id} workout={workout} />
            ))}
          </div>
        </ScrollArea>
        
        <div className="mt-6 bg-muted/50 rounded-lg p-4 flex items-center">
          <div className="bg-primary/10 p-2 rounded-full mr-3">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Connect your health data</p>
            <p className="text-xs text-muted-foreground">
              For personalized AI workout recommendations
            </p>
          </div>
          <Link to="/fitness">
            <Button variant="ghost" size="sm" className="shrink-0">
              Connect
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(WorkoutPlanner);
