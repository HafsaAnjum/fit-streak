
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'rest' | 'hiit' | 'yoga' | 'mixed';
export type WorkoutDifficulty = 'easy' | 'medium' | 'hard';

export interface WorkoutDay {
  id?: string;
  plan_id?: string;
  day_date: Date | string;
  workout_type: WorkoutType;
  duration: number; // in minutes
  difficulty: WorkoutDifficulty;
  description: string;
  completed?: boolean;
}

export interface WorkoutPlan {
  id?: string;
  user_id?: string;
  start_date: Date | string;
  end_date: Date | string;
  days?: WorkoutDay[];
}

// Define proper types for RPC function responses
interface RpcResponse<T> {
  data: T | null;
  error: any;
}

// Exercise templates for different workout types
const workoutTemplates = {
  cardio: [
    { name: "Running", description: "Steady pace running outdoors or on treadmill" },
    { name: "Cycling", description: "Indoor cycling or outdoor biking" },
    { name: "Swimming", description: "Full body cardio workout" },
    { name: "Jump Rope", description: "High intensity cardio" },
    { name: "Rowing", description: "Full body cardio with resistance" }
  ],
  strength: [
    { name: "Upper Body", description: "Focus on chest, shoulders, back, and arms" },
    { name: "Lower Body", description: "Focus on legs, glutes, and core" },
    { name: "Full Body", description: "Compound exercises targeting multiple muscle groups" },
    { name: "Core Focus", description: "Abdominals and lower back exercises" },
    { name: "Functional Strength", description: "Movement patterns that translate to daily activities" }
  ],
  flexibility: [
    { name: "Dynamic Stretching", description: "Active movements that stretch muscles" },
    { name: "Static Stretching", description: "Holding stretches for increased flexibility" },
    { name: "Yoga Flow", description: "Flowing movements combined with breathing" },
    { name: "Pilates", description: "Core strengthening and flexibility work" },
    { name: "Mobility Routine", description: "Joint mobility and range of motion exercises" }
  ],
  hiit: [
    { name: "Tabata", description: "20 seconds work, 10 seconds rest intervals" },
    { name: "Circuit Training", description: "Rotating through different exercise stations" },
    { name: "EMOM", description: "Every Minute On the Minute intervals" },
    { name: "AMRAP", description: "As Many Rounds As Possible in set time" },
    { name: "Pyramid", description: "Increasing then decreasing reps of exercises" }
  ],
  yoga: [
    { name: "Vinyasa Flow", description: "Flowing sequence of poses linked with breath" },
    { name: "Power Yoga", description: "Strength-focused yoga practice" },
    { name: "Restorative Yoga", description: "Gentle practice with longer held poses" },
    { name: "Yin Yoga", description: "Deep stretching with long-held poses" },
    { name: "Hatha Yoga", description: "Traditional practice focusing on alignment" }
  ],
  mixed: [
    { name: "Cardio + Strength", description: "Combination of cardio and strength exercises" },
    { name: "Movement + Recovery", description: "Active movements followed by recovery work" },
    { name: "Cross-Training", description: "Variety of exercise modalities" },
    { name: "Interval + Flexibility", description: "Intervals with flexibility work" },
    { name: "Strength + Mobility", description: "Strength exercises with mobility work" }
  ],
  rest: [
    { name: "Active Recovery", description: "Light movement like walking or gentle yoga" },
    { name: "Complete Rest", description: "Focus on recuperation and sleep" },
    { name: "Stretching Session", description: "Full body flexibility work" },
    { name: "Foam Rolling", description: "Self-myofascial release for recovery" },
    { name: "Light Mobility", description: "Joint mobility exercises without intensity" }
  ]
};

export const WorkoutPlannerService = {
  // Generate a workout plan based on user's fitness level, goals, and preferences
  generateWorkoutPlan: async (
    fitnessLevel: string = 'beginner',
    fitnessGoal: string = 'general fitness',
    preferredTypes: WorkoutType[] = ['cardio', 'strength', 'flexibility', 'rest']
  ): Promise<WorkoutPlan | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
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
        let difficulty: WorkoutDifficulty = 'easy';
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
      
      // Create workout plan using the RPC function
      const { data: planId, error } = await supabase.rpc('create_workout_plan' as string, {
        p_user_id: user.id,
        p_start_date: startDate.toISOString(),
        p_end_date: endDate.toISOString(),
        p_workout_days: workoutDays
      }) as unknown as RpcResponse<string>;
      
      if (error) {
        console.error('Error creating workout plan:', error);
        toast.error('Failed to create workout plan');
        return null;
      }
      
      // Get the complete plan with days
      const plan = await WorkoutPlannerService.getCurrentPlan();
      return plan;
      
    } catch (error) {
      console.error('Error in generating workout plan:', error);
      toast.error('An error occurred when creating your workout plan');
      return null;
    }
  },
  
  // Get the current workout plan for the user
  getCurrentPlan: async (): Promise<WorkoutPlan | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      
      // Get the plan with days using the RPC function
      const { data, error } = await supabase.rpc('get_current_workout_plan' as string, {
        p_user_id: user.id
      }) as unknown as RpcResponse<any[]>;
      
      if (error) {
        console.error('Error fetching workout plan:', error);
        return null;
      }
      
      if (!data || data.length === 0) {
        return null;
      }
      
      // Process the returned data
      const planData = data[0];
      
      // Return the plan with parsed data
      return {
        id: planData.id,
        user_id: planData.user_id,
        start_date: planData.start_date,
        end_date: planData.end_date,
        days: planData.days || []
      };
    } catch (error) {
      console.error('Error getting current workout plan:', error);
      return null;
    }
  },
  
  // Mark a workout day as completed
  completeWorkoutDay: async (dayId: string, completed = true): Promise<boolean> => {
    try {
      const { data, error } = await supabase.rpc('complete_workout_day' as string, {
        p_day_id: dayId,
        p_completed: completed
      }) as unknown as RpcResponse<boolean>;
        
      if (error) {
        console.error('Error completing workout day:', error);
        toast.error('Failed to update workout status');
        return false;
      }
      
      return data || false;
    } catch (error) {
      console.error('Error completing workout day:', error);
      return false;
    }
  },
  
  // Get today's workout
  getTodaysWorkout: async (): Promise<WorkoutDay | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      
      // Get today's workout using RPC function
      const { data, error } = await supabase.rpc('get_todays_workout' as string, {
        p_user_id: user.id
      }) as unknown as RpcResponse<WorkoutDay>;
      
      if (error || !data) {
        console.error('Error fetching today\'s workout:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting today\'s workout:', error);
      return null;
    }
  }
};
