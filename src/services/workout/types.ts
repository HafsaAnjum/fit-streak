
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

// Helper function to call RPC safely with proper typing
export async function callRpc<T = any>(
  functionName: string, 
  params: Record<string, any> = {}
): Promise<T[]> {
  try {
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Error calling RPC ${functionName}:`, error);
      return [] as T[];
    }
    
    return (data as T[]) || [];
  } catch (error) {
    console.error(`Exception in RPC ${functionName}:`, error);
    return [] as T[];
  }
}
