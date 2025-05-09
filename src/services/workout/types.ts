
import { supabase } from "@/integrations/supabase/client";

export type WorkoutType = 'cardio' | 'strength' | 'flexibility' | 'rest' | 'hiit' | 'yoga' | 'mixed';
export type WorkoutDifficulty = 'easy' | 'medium' | 'hard';

export interface WorkoutSession {
  id?: string;
  user_id?: string;
  start_time: string;
  end_time?: string;
  activity_type: WorkoutType;
  steps: number;
  calories_burned: number;
  duration: number; // in seconds
  heart_rate?: number;
  completed: boolean;
}

export interface WorkoutExercise {
  name: string;
  sets?: number;
  reps?: number;
  duration?: number; // in seconds
  completed: boolean;
}

export interface LiveWorkoutState {
  isActive: boolean;
  startTime: string;
  elapsedTime: number; // in seconds
  currentExercise?: WorkoutExercise;
  exercisesList: WorkoutExercise[];
  currentExerciseIndex: number;
  pausedAt?: string;
  metrics: {
    steps: number;
    calories: number;
    heartRate?: number;
  };
}

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Define specific parameter types for each RPC function
type RPCParamTypes = {
  "get_all_milestones": Record<string, never>;
  "get_user_milestones": { p_user_id: string };
  "update_milestone_progress": { p_user_id: string; p_type: string; p_value: number };
  "get_newly_achieved_milestones": { p_user_id: string };
  "count_completed_workouts": { p_user_id: string };
  "get_user_fitness_stats": { user_id_param: string };
}

// Helper function to call RPC safely with proper typing
export async function callRpc<T = any, F extends keyof RPCParamTypes = keyof RPCParamTypes>(
  functionName: F,
  params?: Partial<RPCParamTypes[F]>
): Promise<T[]> {
  try {
    const { data, error } = await supabase.rpc(functionName as string, params || {});
    
    if (error) {
      console.error(`Error calling RPC ${functionName}:`, error);
      return [] as T[];
    }
    
    return (data || []) as T[];
  } catch (error) {
    console.error(`Exception in RPC ${functionName}:`, error);
    return [] as T[];
  }
}
