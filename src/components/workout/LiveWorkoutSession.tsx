
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { WorkoutSessionService } from "@/services/workout/WorkoutSessionService";
import { LiveWorkoutState, WorkoutExercise, WorkoutSession } from "@/services/workout/types";
import { Timer, Heart, Activity, Play, Pause, SkipForward, StopCircle, Clock } from "lucide-react";

const DEFAULT_EXERCISES: WorkoutExercise[] = [
  { name: "Warm up", sets: 1, duration: 180, completed: false },
  { name: "Push-ups", sets: 3, reps: 12, completed: false },
  { name: "Rest", duration: 60, completed: false },
  { name: "Squats", sets: 3, reps: 15, completed: false },
  { name: "Rest", duration: 60, completed: false },
  { name: "Plank", duration: 60, completed: false },
  { name: "Cool down", sets: 1, duration: 120, completed: false }
];

const MOTIVATIONAL_MESSAGES = [
  "Great job! Keep pushing!",
  "You're doing awesome! Keep it up!",
  "Stay strong, you're making progress!",
  "Looking good! You're crushing this workout!",
  "Almost there! Finish strong!",
  "Remember why you started. Keep going!",
  "Every rep counts! You got this!"
];

const LiveWorkoutSession = () => {
  const [workoutState, setWorkoutState] = useState<LiveWorkoutState>({
    isActive: false,
    startTime: "",
    elapsedTime: 0,
    exercisesList: DEFAULT_EXERCISES,
    currentExerciseIndex: 0,
    metrics: { steps: 0, calories: 0 }
  });
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<number | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [summaryData, setSummaryData] = useState<{
    current: WorkoutSession | null;
    previous: WorkoutSession | null;
    weeklyProgress: { workouts: number; goal: number; percentage: number };
  }>({
    current: null,
    previous: null,
    weeklyProgress: { workouts: 0, goal: 5, percentage: 0 }
  });

  const currentExercise = workoutState.exercisesList[workoutState.currentExerciseIndex];
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };
  
  // Start workout session
  const startWorkout = async () => {
    try {
      const session = await WorkoutSessionService.startSession("mixed");
      
      if (!session) {
        toast.error("Failed to start workout session");
        return;
      }
      
      setSessionId(session.id!);
      
      const now = new Date().toISOString();
      setWorkoutState(prev => ({
        ...prev,
        isActive: true,
        startTime: now,
        currentExerciseIndex: 0,
        exercisesList: DEFAULT_EXERCISES.map(ex => ({ ...ex, completed: false }))
      }));
      
      // Start the timer
      const timerId = window.setInterval(() => {
        setWorkoutState(prevState => ({
          ...prevState,
          elapsedTime: prevState.elapsedTime + 1
        }));
        
        // Get new metrics every 10 seconds
        if ((workoutState.elapsedTime + 1) % 10 === 0) {
          fetchCurrentMetrics();
        }
        
        // Show motivational message every 30 seconds
        if ((workoutState.elapsedTime + 1) % 30 === 0) {
          showMotivationalMessage();
        }
      }, 1000);
      
      setIntervalId(timerId);
      fetchCurrentMetrics();
      
    } catch (error) {
      console.error("Error starting workout:", error);
      toast.error("Failed to start workout");
    }
  };
  
  // Pause workout
  const pauseWorkout = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
      
      setWorkoutState(prev => ({
        ...prev,
        isActive: false,
        pausedAt: new Date().toISOString()
      }));
      
      toast("Workout paused", {
        description: `Time elapsed: ${formatTime(workoutState.elapsedTime)}`,
      });
    }
  };
  
  // Resume workout
  const resumeWorkout = () => {
    const timerId = window.setInterval(() => {
      setWorkoutState(prevState => ({
        ...prevState,
        elapsedTime: prevState.elapsedTime + 1
      }));
      
      // Get new metrics every 10 seconds
      if ((workoutState.elapsedTime + 1) % 10 === 0) {
        fetchCurrentMetrics();
      }
    }, 1000);
    
    setIntervalId(timerId);
    setWorkoutState(prev => ({
      ...prev,
      isActive: true,
      pausedAt: undefined
    }));
    
    toast("Workout resumed", { description: "Keep going strong!" });
  };
  
  // End workout
  const endWorkout = async () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
    
    if (!sessionId) {
      return;
    }
    
    try {
      const session = await WorkoutSessionService.endSession(sessionId, {
        steps: workoutState.metrics.steps,
        calories: workoutState.metrics.calories,
        duration: workoutState.elapsedTime,
        heartRate: workoutState.metrics.heartRate
      });
      
      if (session) {
        // Get last session for comparison
        const previousSession = await WorkoutSessionService.getLastSession();
        
        // Get weekly progress
        const weeklyProgress = await WorkoutSessionService.getWeeklyGoalProgress();
        
        setSummaryData({
          current: session,
          previous: previousSession,
          weeklyProgress: weeklyProgress
        });
        
        setShowSummary(true);
        
        // Reset workout state
        setWorkoutState({
          isActive: false,
          startTime: "",
          elapsedTime: 0,
          exercisesList: DEFAULT_EXERCISES,
          currentExerciseIndex: 0,
          metrics: { steps: 0, calories: 0 }
        });
        
        setSessionId(null);
      }
    } catch (error) {
      console.error("Error ending workout:", error);
      toast.error("Failed to save workout data");
    }
  };
  
  // Move to next exercise
  const nextExercise = () => {
    if (workoutState.currentExerciseIndex < workoutState.exercisesList.length - 1) {
      // Mark current exercise as completed
      const updatedExercises = [...workoutState.exercisesList];
      updatedExercises[workoutState.currentExerciseIndex].completed = true;
      
      setWorkoutState(prev => ({
        ...prev,
        currentExerciseIndex: prev.currentExerciseIndex + 1,
        exercisesList: updatedExercises
      }));
      
      toast.success("Great job! Moving to next exercise");
      showMotivationalMessage();
    } else {
      toast("Workout complete!", {
        description: "You've completed all exercises!",
      });
      endWorkout();
    }
  };
  
  // Fetch current metrics from Google Fit
  const fetchCurrentMetrics = async () => {
    const metrics = await WorkoutSessionService.getCurrentMetrics();
    if (metrics) {
      setWorkoutState(prev => ({
        ...prev,
        metrics: {
          steps: metrics.steps,
          calories: metrics.calories,
          heartRate: metrics.heartRate
        }
      }));
    }
  };
  
  // Show random motivational message
  const showMotivationalMessage = () => {
    const randomIndex = Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length);
    setMotivationalMessage(MOTIVATIONAL_MESSAGES[randomIndex]);
    
    // Clear message after 5 seconds
    setTimeout(() => {
      setMotivationalMessage("");
    }, 5000);
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);
  
  return (
    <div className="container max-w-xl mx-auto py-6">
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Live Workout Session</span>
            <Badge variant={workoutState.isActive ? "default" : "secondary"}>
              {workoutState.isActive ? "Active" : "Ready"}
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {/* Timer and Metrics */}
          <div className="grid grid-cols-4 gap-4 mb-6 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-3 rounded-full mb-2">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">{formatTime(workoutState.elapsedTime)}</div>
              <div className="text-xs text-muted-foreground">Time</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-green-100 p-3 rounded-full mb-2">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{workoutState.metrics.steps}</div>
              <div className="text-xs text-muted-foreground">Steps</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 p-3 rounded-full mb-2">
                <Timer className="h-6 w-6 text-orange-500" />
              </div>
              <div className="text-2xl font-bold">{workoutState.metrics.calories}</div>
              <div className="text-xs text-muted-foreground">Calories</div>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-red-100 p-3 rounded-full mb-2">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold">
                {workoutState.metrics.heartRate || "--"}
              </div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </div>
          </div>
          
          {/* Current Exercise */}
          {currentExercise && (
            <div className="bg-secondary/20 p-4 rounded-lg mb-4">
              <h3 className="text-lg font-semibold mb-1">{currentExercise.name}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {currentExercise.sets && currentExercise.reps 
                  ? `${currentExercise.sets} sets × ${currentExercise.reps} reps` 
                  : currentExercise.duration 
                    ? `Duration: ${formatTime(currentExercise.duration)}` 
                    : "Complete exercise"}
              </p>
              
              {/* Progress through workout */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>
                    {workoutState.currentExerciseIndex + 1}/{workoutState.exercisesList.length}
                  </span>
                </div>
                <Progress 
                  value={((workoutState.currentExerciseIndex + 1) / workoutState.exercisesList.length) * 100} 
                  className="h-2" 
                />
              </div>
            </div>
          )}
          
          {/* Motivational Message */}
          {motivationalMessage && (
            <div className="bg-primary/10 p-3 rounded-lg text-center mb-4 animate-pulse">
              <p className="font-medium text-primary">{motivationalMessage}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-wrap gap-2">
          {!workoutState.isActive && sessionId === null && (
            <Button 
              onClick={startWorkout} 
              className="w-full"
              size="lg"
            >
              <Play className="mr-2 h-4 w-4" /> Start Workout
            </Button>
          )}
          
          {workoutState.isActive && (
            <>
              <Button 
                onClick={pauseWorkout} 
                variant="outline" 
                className="flex-1"
              >
                <Pause className="mr-2 h-4 w-4" /> Pause
              </Button>
              <Button 
                onClick={nextExercise} 
                className="flex-1"
              >
                <SkipForward className="mr-2 h-4 w-4" /> Next Exercise
              </Button>
            </>
          )}
          
          {!workoutState.isActive && sessionId !== null && (
            <>
              <Button 
                onClick={resumeWorkout} 
                className="flex-1"
              >
                <Play className="mr-2 h-4 w-4" /> Resume
              </Button>
              <Button 
                onClick={endWorkout} 
                variant="destructive" 
                className="flex-1"
              >
                <StopCircle className="mr-2 h-4 w-4" /> End Workout
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
      
      {/* Workout Summary Dialog */}
      <Dialog open={showSummary} onOpenChange={setShowSummary}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Workout Complete! 🎉</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            {summaryData.current && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <div className="text-xl font-bold">
                      {formatTime(summaryData.current.duration)}
                    </div>
                    <div className="text-xs text-muted-foreground">Duration</div>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <div className="text-xl font-bold">{summaryData.current.steps}</div>
                    <div className="text-xs text-muted-foreground">Steps</div>
                  </div>
                  <div className="bg-secondary/10 rounded-lg p-3">
                    <div className="text-xl font-bold">{summaryData.current.calories_burned}</div>
                    <div className="text-xs text-muted-foreground">Calories</div>
                  </div>
                </div>
                
                {summaryData.previous && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="text-sm font-medium mb-2">Compared to Last Workout:</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            summaryData.current.duration > summaryData.previous.duration 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {summaryData.current.duration > summaryData.previous.duration ? "+" : ""}
                            {(((summaryData.current.duration - summaryData.previous.duration) / 
                              summaryData.previous.duration) * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Time</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            summaryData.current.steps > summaryData.previous.steps 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {summaryData.current.steps > summaryData.previous.steps ? "+" : ""}
                            {(((summaryData.current.steps - summaryData.previous.steps) / 
                              summaryData.previous.steps) * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Steps</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm font-medium ${
                            summaryData.current.calories_burned > summaryData.previous.calories_burned 
                              ? "text-green-600" 
                              : "text-red-600"
                          }`}>
                            {summaryData.current.calories_burned > summaryData.previous.calories_burned ? "+" : ""}
                            {(((summaryData.current.calories_burned - summaryData.previous.calories_burned) / 
                              summaryData.previous.calories_burned) * 100).toFixed(0)}%
                          </div>
                          <div className="text-xs text-muted-foreground">Calories</div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                
                <Separator />
                
                {/* Weekly Progress */}
                <div>
                  <h4 className="text-sm font-medium mb-2">
                    Weekly Progress: {summaryData.weeklyProgress.workouts}/{summaryData.weeklyProgress.goal} Workouts
                  </h4>
                  <Progress value={summaryData.weeklyProgress.percentage} className="h-2" />
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button onClick={() => setShowSummary(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveWorkoutSession;
