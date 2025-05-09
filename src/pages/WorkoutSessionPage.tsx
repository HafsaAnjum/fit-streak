
import React, { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Play, Pause, ChevronRight, ChevronLeft, CheckCircle, Clock, Flame, Activity } from "lucide-react";
import { toast } from "sonner";

const mockExercises = [
  { name: "Jump Squats", duration: 45, rest: 15, sets: 3 },
  { name: "Push-ups", duration: 45, rest: 15, sets: 3 },
  { name: "Mountain Climbers", duration: 45, rest: 15, sets: 3 },
  { name: "Burpees", duration: 45, rest: 15, sets: 3 },
  { name: "Plank Jacks", duration: 45, rest: 15, sets: 3 },
];

// Mock workout stats
const mockWorkoutStats = {
  duration: 0,
  calories: 0,
  steps: 0,
};

enum SessionState {
  Ready,
  Active,
  Rest,
  Completed
}

const WorkoutSessionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<any>(location.state?.workout || null);
  
  // Session state
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.Ready);
  const [isRunning, setIsRunning] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [timer, setTimer] = useState(0);
  const [restTimer, setRestTimer] = useState(0);
  const [stats, setStats] = useState(mockWorkoutStats);
  
  // Calculate total workout progress
  const totalExercises = useMemo(() => {
    if (!workout?.exercises) return 1;
    return workout.exercises.reduce((total: number, exercise: any) => total + exercise.sets, 0);
  }, [workout]);
  
  const completedSets = useMemo(() => {
    let completed = 0;
    for (let i = 0; i < currentExerciseIndex; i++) {
      completed += (workout?.exercises[i]?.sets || 0);
    }
    return completed + currentSetIndex;
  }, [currentExerciseIndex, currentSetIndex, workout]);
  
  const progress = Math.floor((completedSets / totalExercises) * 100);
  
  // Use sample exercises if no workout provided
  useEffect(() => {
    if (!workout) {
      setWorkout({
        name: "Quick Workout",
        duration: "25 min",
        exercises: mockExercises
      });
    }
  }, []);
  
  // Handle timer for active exercise
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && sessionState === SessionState.Active) {
      const currentExercise = workout?.exercises[currentExerciseIndex];
      if (!currentExercise) return;
      
      const exerciseDuration = typeof currentExercise.duration === 'string' 
        ? parseInt(currentExercise.duration) 
        : currentExercise.duration || 45;
      
      interval = setInterval(() => {
        setTimer(prev => {
          const newTime = prev + 1;
          
          // Update workout stats
          setStats(prev => ({
            ...prev,
            duration: prev.duration + 1,
            calories: Math.floor(prev.calories + 0.1),
            steps: prev.steps + Math.floor(Math.random() * 3),
          }));
          
          // Check if exercise is complete
          if (newTime >= exerciseDuration) {
            clearInterval(interval);
            
            const isLastSet = currentSetIndex + 1 >= (currentExercise.sets || 3);
            const isLastExercise = currentExerciseIndex + 1 >= (workout?.exercises?.length || 0);
            
            if (isLastSet && isLastExercise) {
              setSessionState(SessionState.Completed);
              setIsRunning(false);
              toast.success("Workout completed! Great job!");
            } else if (isLastSet) {
              setCurrentExerciseIndex(prev => prev + 1);
              setCurrentSetIndex(0);
              setSessionState(SessionState.Rest);
              setRestTimer(currentExercise.rest || 15);
            } else {
              setCurrentSetIndex(prev => prev + 1);
              setSessionState(SessionState.Rest);
              setRestTimer(currentExercise.rest || 15);
            }
            
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, sessionState, currentExerciseIndex, currentSetIndex, workout]);
  
  // Handle rest timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning && sessionState === SessionState.Rest && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          const newTime = prev - 1;
          
          if (newTime <= 0) {
            clearInterval(interval);
            setSessionState(SessionState.Active);
            return 0;
          }
          
          return newTime;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning, sessionState, restTimer]);
  
  const startWorkout = () => {
    setSessionState(SessionState.Active);
    setIsRunning(true);
    toast.success("Workout started!");
  };
  
  const togglePause = () => {
    setIsRunning(prev => !prev);
    toast(isRunning ? "Workout paused" : "Workout resumed");
  };
  
  const finishWorkout = () => {
    toast.success("Workout saved! Great job!", {
      description: `You burned ${stats.calories} calories in ${Math.floor(stats.duration / 60)} minutes`
    });
    navigate('/workout-summary', { state: { stats } });
  };
  
  const getCurrentExercise = () => {
    return workout?.exercises[currentExerciseIndex];
  };
  
  if (!workout) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-t-primary border-primary/20 rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading workout session...</p>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 pb-24 md:pb-6">
      {/* Header with back button */}
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          className="mr-2" 
          onClick={() => {
            if (sessionState !== SessionState.Ready && sessionState !== SessionState.Completed) {
              if (confirm("Are you sure you want to exit this workout? Progress will be lost.")) {
                navigate(-1);
              }
            } else {
              navigate(-1);
            }
          }}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {sessionState === SessionState.Completed ? "Workout Complete" : workout.name}
        </h1>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2 text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Main content based on session state */}
      <AnimatePresence mode="wait">
        {sessionState === SessionState.Ready && (
          <motion.div 
            key="ready"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="mb-6">
              <CardHeader className="pb-0">
                <CardTitle>Ready to Begin</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-lg mb-6 text-center">Get ready for {workout.name}</p>
                <div className="mb-8">
                  <h3 className="font-medium text-center mb-4">Workout Overview</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                        <Clock className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="font-medium">{workout.duration}</p>
                    </div>
                    <div>
                      <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Exercises</p>
                      <p className="font-medium">{workout.exercises?.length || 0}</p>
                    </div>
                    <div>
                      <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                        <Flame className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Est. Calories</p>
                      <p className="font-medium">300-400</p>
                    </div>
                  </div>
                </div>
                <Button className="w-full h-12" onClick={startWorkout}>
                  <Play className="mr-2 h-5 w-5" />
                  Start Workout
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {sessionState === SessionState.Active && (
          <motion.div 
            key="active"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="space-y-6"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{getCurrentExercise()?.name}</h2>
                  <div className="bg-primary/10 px-3 py-1 rounded-full">
                    <span className="text-primary font-medium">Set {currentSetIndex + 1}/{getCurrentExercise()?.sets || 3}</span>
                  </div>
                </div>
                
                {/* Timer display */}
                <div className="flex flex-col items-center justify-center my-8">
                  <div className="relative mb-4">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-muted/20"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-primary"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                        strokeDasharray="364.4"
                        strokeDashoffset={364.4 * (1 - timer / (typeof getCurrentExercise()?.duration === 'string' 
                          ? parseInt(getCurrentExercise()?.duration) 
                          : getCurrentExercise()?.duration || 45))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{timer}s</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">Keep pushing!</p>
                </div>
                
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12"
                    onClick={togglePause}
                  >
                    {isRunning ? (
                      <><Pause className="mr-2 h-5 w-5" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-5 w-5" /> Resume</>
                    )}
                  </Button>
                  <Button 
                    className="flex-1 h-12"
                    onClick={() => {
                      setTimer(0);
                      setSessionState(SessionState.Rest);
                      setRestTimer(getCurrentExercise()?.rest || 15);
                    }}
                  >
                    <ChevronRight className="mr-2 h-5 w-5" /> Skip
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Stats card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Workout Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-bold">{Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-bold">{stats.calories}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Steps</p>
                    <p className="font-bold">{stats.steps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {sessionState === SessionState.Rest && (
          <motion.div 
            key="rest"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6 text-center">
                <h2 className="text-xl font-bold mb-8">Rest Time</h2>
                
                {/* Rest timer display */}
                <div className="flex flex-col items-center justify-center my-8">
                  <div className="relative mb-4">
                    <svg className="w-32 h-32">
                      <circle
                        className="text-muted/20"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                      />
                      <circle
                        className="text-blue-500"
                        strokeWidth="6"
                        stroke="currentColor"
                        fill="transparent"
                        r="58"
                        cx="64"
                        cy="64"
                        strokeDasharray="364.4"
                        strokeDashoffset={364.4 * (1 - restTimer / (getCurrentExercise()?.rest || 15))}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">{restTimer}s</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground">Take a short break</p>
                </div>
                
                <p className="mb-4 text-lg">
                  Coming up next: <span className="font-bold">{getCurrentExercise()?.name}</span>
                </p>
                <p className="mb-8 text-sm text-muted-foreground">
                  Set {currentSetIndex + 1}/{getCurrentExercise()?.sets || 3}
                </p>
                
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    className="flex-1 h-12"
                    onClick={togglePause}
                  >
                    {isRunning ? (
                      <><Pause className="mr-2 h-5 w-5" /> Pause</>
                    ) : (
                      <><Play className="mr-2 h-5 w-5" /> Resume</>
                    )}
                  </Button>
                  <Button 
                    className="flex-1 h-12"
                    onClick={() => {
                      setRestTimer(0);
                      setSessionState(SessionState.Active);
                    }}
                  >
                    Skip Rest <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        {sessionState === SessionState.Completed && (
          <motion.div 
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-br from-primary/20 via-purple-500/20 to-blue-500/20 p-8 text-center">
                <div className="bg-primary/20 h-20 w-20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Workout Complete!</h2>
                <p className="text-muted-foreground">Great job on finishing your workout!</p>
              </div>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Duration</p>
                    <p className="font-bold">{Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                      <Flame className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-bold">{stats.calories}</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-primary/10 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-2">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-xs text-muted-foreground">Steps</p>
                    <p className="font-bold">{stats.steps}</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full h-12 mb-4"
                  onClick={finishWorkout}
                >
                  Save and Continue
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/workouts')}
                >
                  Back to Workouts
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkoutSessionPage;
