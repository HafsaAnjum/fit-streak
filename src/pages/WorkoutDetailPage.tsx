
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Calendar, Dumbbell, Flame, Activity, ChevronRight, Play, List } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

// Sample workout details
const workoutDetails = {
  "1": {
    id: 1,
    name: "Full Body HIIT",
    duration: "30 min",
    type: "HIIT",
    difficulty: "Medium",
    aiRecommended: true,
    description: "This high-intensity interval training workout targets your entire body with quick bursts of activity followed by short rest periods.",
    calories: "250-350",
    equipment: "No equipment needed",
    exercises: [
      { name: "Jump Squats", duration: "45 seconds", rest: "15 seconds", sets: 3 },
      { name: "Push-ups", duration: "45 seconds", rest: "15 seconds", sets: 3 },
      { name: "Mountain Climbers", duration: "45 seconds", rest: "15 seconds", sets: 3 },
      { name: "Burpees", duration: "45 seconds", rest: "15 seconds", sets: 3 },
      { name: "Plank Jacks", duration: "45 seconds", rest: "15 seconds", sets: 3 },
    ]
  },
  "2": {
    id: 2,
    name: "Upper Body Strength",
    duration: "45 min",
    type: "Strength",
    difficulty: "Hard",
    aiRecommended: false,
    description: "Build strength and definition in your upper body with this comprehensive weight training workout.",
    calories: "300-400",
    equipment: "Dumbbells, Resistance bands",
    exercises: [
      { name: "Dumbbell Bench Press", duration: "12 reps", rest: "60 seconds", sets: 4 },
      { name: "Bent Over Rows", duration: "12 reps", rest: "60 seconds", sets: 4 },
      { name: "Shoulder Press", duration: "12 reps", rest: "60 seconds", sets: 4 },
      { name: "Bicep Curls", duration: "12 reps", rest: "60 seconds", sets: 4 },
      { name: "Tricep Dips", duration: "12 reps", rest: "60 seconds", sets: 4 },
    ]
  }
};

const WorkoutDetailPage = () => {
  const { workoutId } = useParams<{ workoutId: string }>();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      if (workoutId && workoutDetails[workoutId]) {
        setWorkout(workoutDetails[workoutId]);
      }
      setLoading(false);
    }, 800);
  }, [workoutId]);
  
  const handleStartWorkout = () => {
    navigate(`/workout-session`, { state: { workout } });
  };
  
  if (loading) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-t-primary border-primary/20 rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading workout details...</p>
      </div>
    );
  }
  
  if (!workout) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold">Workout Not Found</h2>
        <p className="text-muted-foreground mb-4">The workout you're looking for doesn't exist</p>
        <Button onClick={() => navigate('/workouts')}>Back to Workouts</Button>
      </div>
    );
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-4 pb-24 md:pb-6 space-y-6"
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="mb-2" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Header Section */}
        <div className="h-48 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-6">
          <div className="text-center">
            <Dumbbell className="h-16 w-16 mx-auto mb-2 text-primary/70" />
            <h1 className="text-3xl font-bold">{workout.name}</h1>
            <div className="flex items-center justify-center mt-2 space-x-4">
              <Badge className="text-xs bg-primary/10 text-primary">
                {workout.type}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {workout.difficulty}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Details Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-4">{workout.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{workout.duration}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Flame className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="font-medium">{workout.calories}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Equipment</p>
                  <p className="font-medium">{workout.equipment}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Exercises List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Workout Plan</CardTitle>
            <CardDescription>Follow the exercise sequence below</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workout.exercises.map((exercise: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <Card className="overflow-hidden border border-muted">
                    <div className="p-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <span className="font-medium text-sm text-primary">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{exercise.name}</h3>
                          <div className="flex text-xs text-muted-foreground">
                            <span>{exercise.duration}</span>
                            <span className="mx-1">•</span>
                            <span>{exercise.sets} sets</span>
                            <span className="mx-1">•</span>
                            <span>{exercise.rest} rest</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button 
            className="flex-1 h-12"
            onClick={handleStartWorkout}
          >
            <Play className="mr-2 h-5 w-5" />
            Start Workout
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 h-12"
            onClick={() => {
              toast.success("Workout added to your schedule");
              setTimeout(() => navigate(-1), 1500);
            }}
          >
            <Calendar className="mr-2 h-5 w-5" />
            Schedule for Later
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WorkoutDetailPage;
