
import { supabase } from "@/integrations/supabase/client";

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
export interface RpcResponse<T> {
  data: T | null;
  error: any;
}

// Define RpcFunction type as string to match supabase.rpc functionality
export type RpcFunction = string;

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper function to call RPC safely with proper typing
export async function callRpc<T>(
  functionName: RpcFunction, 
  params?: Record<string, any>
): Promise<T[]> {
  try {
    const query = params 
      ? supabase.rpc(functionName, params)
      : supabase.rpc(functionName);
    
    const { data, error } = await query as unknown as RpcResponse<T[]>;
    
    if (error) {
      console.error(`Error calling RPC ${functionName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Exception in RPC ${functionName}:`, error);
    return [];
  }
}
