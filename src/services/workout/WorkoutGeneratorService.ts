import { toast } from "sonner";
import { 
  WorkoutPlan, 
  WorkoutDay, 
  WorkoutType, 
  getCurrentUser
} from './types';
import { workoutTemplates } from './WorkoutTemplates';
import { supabase } from "@/integrations/supabase/client";

export class WorkoutGeneratorService {
  // Generate a workout plan based on user's fitness level, goals, and preferences
  static async generateWorkoutPlan(
    fitnessLevel: string = 'beginner',
    fitnessGoal: string = 'general fitness',
    preferredTypes: WorkoutType[] = ['cardio', 'strength', 'flexibility', 'rest']
  ): Promise<WorkoutPlan | null> {
    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        toast.error('You must be logged in to generate a workout plan');
        return null;
      }

      // Plan configuration based on fitness level
      const planConfig = {
        beginner: {
          workoutDays: 3,
          restDays: 4,
          maxDuration: 30,
          difficultyDistribution: { easy: 0.7, medium: 0.3, hard: 0 }
        },
        intermediate: {
          workoutDays: 4,
          restDays: 3,
          maxDuration: 45,
          difficultyDistribution: { easy: 0.3, medium: 0.6, hard: 0.1 }
        },
        advanced: {
          workoutDays: 5,
          restDays: 2,
          maxDuration: 60,
          difficultyDistribution: { easy: 0.1, medium: 0.5, hard: 0.4 }
        }
      };
      
      // Choose the right config based on user's level
      const config = planConfig[fitnessLevel as keyof typeof planConfig] || planConfig.beginner;

      // Define the start and end date for the plan (1 week)
      const startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);
      
      // Generate workout days
      const workoutDays = this.generateWorkoutDaysForPlan(startDate, config, preferredTypes);
      
      // Create workout plan using the RPC function
      const { data: planId, error } = await supabase
        .rpc('create_workout_plan', {
          p_user_id: user.id,
          p_start_date: startDate.toISOString(),
          p_end_date: endDate.toISOString(),
          p_workout_days: workoutDays
        });
      
      if (error) {
        console.error('Error creating workout plan:', error);
        toast.error('Failed to create workout plan');
        return null;
      }
      
      // Get the complete plan with days
      const workoutPlannerService = await import('./index');
      const plan = await workoutPlannerService.WorkoutPlannerService.getCurrentPlan();
      return plan;
      
    } catch (error) {
      console.error('Error in generating workout plan:', error);
      toast.error('An error occurred when creating your workout plan');
      return null;
    }
  }

  // Helper method to generate workout days for a plan
  private static generateWorkoutDaysForPlan(
    startDate: Date, 
    config: any, 
    preferredTypes: WorkoutType[]
  ): WorkoutDay[] {
    const workoutDays: WorkoutDay[] = [];
    
    // Schedule workouts for each day of the week
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(dayDate.getDate() + i);
      
      // Decide if it's a workout day or rest day
      // For simplicity, let's say odd days are workout days and even days are rest days
      // In a production app, you'd have a more sophisticated algorithm
      const isWorkoutDay = i % 2 === 0 ? (i < config.workoutDays * 2) : false;
      
      let workoutType: WorkoutType = 'rest';
      let duration = 0;
      let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
      let description = "Rest and recovery day";
      
      if (isWorkoutDay) {
        // Select a workout type from preferred types (excluding rest)
        const activeTypes = preferredTypes.filter(t => t !== 'rest');
        workoutType = activeTypes[Math.floor(Math.random() * activeTypes.length)] || 'cardio';
        
        // Determine duration based on level
        duration = Math.floor(Math.random() * (config.maxDuration - 20)) + 20;
        
        // Determine difficulty based on distribution
        const diffValue = Math.random();
        if (diffValue < config.difficultyDistribution.easy) {
          difficulty = 'easy';
        } else if (diffValue < config.difficultyDistribution.easy + config.difficultyDistribution.medium) {
          difficulty = 'medium';
        } else {
          difficulty = 'hard';
        }
        
        // Pick a template for the workout type
        const templates = workoutTemplates[workoutType] || workoutTemplates.mixed;
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Create description
        description = `${template.name}: ${template.description}`;
      }
      
      // Create the workout day
      workoutDays.push({
        day_date: dayDate.toISOString(),
        workout_type: workoutType,
        duration: duration,
        difficulty: difficulty,
        description: description,
      });
    }
    
    return workoutDays;
  }
}
