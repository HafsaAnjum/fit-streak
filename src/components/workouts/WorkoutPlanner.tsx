
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Dumbbell, CheckCircle, RefreshCw, Sparkles } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { WorkoutPlannerService, WorkoutPlan, WorkoutDay } from "@/services/WorkoutPlannerService";

const WorkoutPlanner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const { profile } = useAuth();
  
  useEffect(() => {
    loadCurrentPlan();
  }, []);
  
  const loadCurrentPlan = async () => {
    setLoading(true);
    try {
      const currentPlan = await WorkoutPlannerService.getCurrentPlan();
      setPlan(currentPlan);
    } catch (error) {
      console.error("Error loading workout plan:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const generateNewPlan = async () => {
    setGenerating(true);
    try {
      // Use profile data if available, otherwise default values
      const fitnessLevel = profile?.fitness_level || 'beginner';
      const fitnessGoal = profile?.goal || 'general fitness';
      
      // Get preferred workout types based on profile or default to mix
      let preferredTypes = ['cardio', 'strength', 'flexibility', 'rest'];
      if (profile?.workout_type) {
        preferredTypes = [profile.workout_type, ...preferredTypes.filter(t => t !== profile.workout_type)];
      }
      
      const newPlan = await WorkoutPlannerService.generateWorkoutPlan(
        fitnessLevel,
        fitnessGoal,
        preferredTypes as any[]
      );
      
      if (newPlan) {
        setPlan(newPlan);
        toast.success("Your new workout plan has been created!");
      } else {
        toast.error("Failed to create workout plan. Please try again.");
      }
    } catch (error) {
      console.error("Error generating workout plan:", error);
      toast.error("An error occurred while creating your workout plan");
    } finally {
      setGenerating(false);
    }
  };
  
  const markWorkoutComplete = async (dayId: string, completed: boolean) => {
    try {
      const success = await WorkoutPlannerService.completeWorkoutDay(dayId, completed);
      
      if (success) {
        // Update local state
        setPlan(prevPlan => {
          if (!prevPlan || !prevPlan.days) return prevPlan;
          
          return {
            ...prevPlan,
            days: prevPlan.days.map(day => 
              day.id === dayId ? { ...day, completed } : day
            )
          };
        });
        
        toast.success(completed ? "Workout marked as complete!" : "Workout marked as incomplete");
      }
    } catch (error) {
      console.error("Error updating workout status:", error);
    }
  };
  
  const getToday = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };
  
  const formatDateDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const isToday = (dateString: string) => {
    return dateString.split('T')[0] === getToday();
  };
  
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 p-1.5 rounded-md bg-primary/10">
              <Dumbbell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium">Weekly Workout Plan</CardTitle>
              <CardDescription>
                AI-generated plan based on your fitness level and goals
              </CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={generateNewPlan} 
            disabled={generating}
            className="flex items-center gap-1"
          >
            {generating ? (
              "Generating..."
            ) : (
              <>
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{plan ? "Regenerate" : "Create"} Plan</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : plan && plan.days && plan.days.length > 0 ? (
          <div className="space-y-4">
            {/* Weekly View - Horizontal Scroll */}
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max">
                {plan.days.map((day, index) => (
                  <WorkoutDayCard 
                    key={day.id || index}
                    day={day}
                    isToday={isToday(day.day_date as string)}
                    dayName={getDayName(day.day_date as string)}
                    dateDisplay={formatDateDisplay(day.day_date as string)}
                    onComplete={(completed) => day.id && markWorkoutComplete(day.id, completed)}
                  />
                ))}
              </div>
            </div>
            
            {/* Today's Workout Detail Section */}
            {plan.days.find(day => isToday(day.day_date as string)) && (
              <TodaysWorkoutDetail 
                workout={plan.days.find(day => isToday(day.day_date as string))!}
                onComplete={(completed) => {
                  const today = plan.days.find(day => isToday(day.day_date as string));
                  if (today && today.id) {
                    markWorkoutComplete(today.id, completed);
                  }
                }}
              />
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Sparkles className="h-12 w-12 text-primary/40 mx-auto mb-3" />
            <h3 className="text-lg font-medium mb-2">No workout plan yet</h3>
            <p className="text-muted-foreground mb-4 max-w-md mx-auto">
              Generate your personalized workout plan based on your fitness level and goals
            </p>
            <Button onClick={generateNewPlan} disabled={generating}>
              {generating ? "Generating..." : "Generate My Plan"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface WorkoutDayCardProps {
  day: WorkoutDay;
  isToday: boolean;
  dayName: string;
  dateDisplay: string;
  onComplete: (completed: boolean) => void;
}

const WorkoutDayCard: React.FC<WorkoutDayCardProps> = ({ day, isToday, dayName, dateDisplay, onComplete }) => {
  // Get icon based on workout type
  const getWorkoutIcon = (type: string) => {
    switch(type) {
      case 'cardio': return <Calendar className="h-5 w-5 text-blue-500" />;
      case 'strength': return <Dumbbell className="h-5 w-5 text-purple-500" />;
      case 'rest': return <Calendar className="h-5 w-5 text-green-500" />;
      default: return <Calendar className="h-5 w-5 text-primary" />;
    }
  };
  
  // Get background color based on workout type
  const getCardClass = (type: string, isToday: boolean, completed?: boolean) => {
    let baseClass = "flex flex-col min-w-32 p-3 rounded-md border";
    
    if (completed) {
      return `${baseClass} bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900`;
    }
    
    if (isToday) {
      return `${baseClass} bg-primary/5 border-primary/20`;
    }
    
    if (type === 'rest') {
      return `${baseClass} bg-muted/50`;
    }
    
    return baseClass;
  };
  
  return (
    <motion.div 
      className={getCardClass(day.workout_type, isToday, day.completed)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center mb-1.5">
            <span className="text-sm font-medium">{dayName}</span>
            <span className="ml-1.5 text-xs text-muted-foreground">{dateDisplay}</span>
            {isToday && (
              <span className="ml-1.5 text-[10px] bg-primary text-primary-foreground rounded-sm px-1 py-0.5">
                Today
              </span>
            )}
          </div>
          <div className="flex items-center">
            {getWorkoutIcon(day.workout_type)}
            <h4 className="font-medium text-sm ml-1.5 capitalize">{day.workout_type}</h4>
          </div>
        </div>
        
        {day.workout_type !== 'rest' && (
          <Button 
            variant={day.completed ? "ghost" : "outline"} 
            size="icon" 
            className={`h-7 w-7 ${day.completed ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : ''}`}
            onClick={() => onComplete(!day.completed)}
          >
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {day.workout_type !== 'rest' && (
        <div className="mt-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Duration</span>
            <span className="font-medium text-foreground">{day.duration} min</span>
          </div>
          <div className="flex justify-between mt-1">
            <span>Difficulty</span>
            <span className="font-medium text-foreground capitalize">{day.difficulty}</span>
          </div>
        </div>
      )}
      
      <p className="mt-2 text-xs line-clamp-2">{day.description}</p>
    </motion.div>
  );
};

interface TodaysWorkoutDetailProps {
  workout: WorkoutDay;
  onComplete: (completed: boolean) => void;
}

const TodaysWorkoutDetail: React.FC<TodaysWorkoutDetailProps> = ({ workout, onComplete }) => {
  if (workout.workout_type === 'rest') {
    return (
      <div className="bg-muted/30 p-4 rounded-lg border border-muted mt-4">
        <h3 className="font-medium flex items-center">
          <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
          Rest Day
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{workout.description}</p>
      </div>
    );
  }
  
  return (
    <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
      <div className="flex justify-between items-start">
        <h3 className="font-medium text-lg flex items-center">
          <Calendar className="h-5 w-5 text-primary mr-2" />
          Today's Workout
        </h3>
        <Button
          variant={workout.completed ? "default" : "outline"}
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onComplete(!workout.completed)}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          <span>{workout.completed ? 'Completed' : 'Mark Complete'}</span>
        </Button>
      </div>
      
      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="bg-background rounded-md p-2 text-center">
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="font-medium capitalize">{workout.workout_type}</p>
        </div>
        <div className="bg-background rounded-md p-2 text-center">
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="font-medium">{workout.duration} min</p>
        </div>
        <div className="bg-background rounded-md p-2 text-center">
          <p className="text-xs text-muted-foreground">Difficulty</p>
          <p className="font-medium capitalize">{workout.difficulty}</p>
        </div>
      </div>
      
      <div className="mt-3">
        <h4 className="text-sm font-medium">Description</h4>
        <p className="mt-1 text-sm">{workout.description}</p>
      </div>
    </div>
  );
};

export default WorkoutPlanner;
