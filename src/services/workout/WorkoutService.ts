
import { toast } from "sonner";
import { 
  WorkoutDay, 
  WorkoutPlan,
  RpcResponse,
  RpcFunction,
  getCurrentUser
} from './types';
import { supabase } from "@/integrations/supabase/client";

export class WorkoutService {
  // Get the current workout plan for the user
  static async getCurrentPlan(): Promise<WorkoutPlan | null> {
    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return null;
      }
      
      // Get the plan with days using the RPC function
      const { data, error } = await supabase
        .rpc('get_current_workout_plan' as RpcFunction, {
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
  }
  
  // Mark a workout day as completed
  static async completeWorkoutDay(dayId: string, completed = true): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('complete_workout_day' as RpcFunction, {
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
  }
  
  // Get today's workout
  static async getTodaysWorkout(): Promise<WorkoutDay | null> {
    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return null;
      }
      
      // Get today's workout using RPC function
      const { data, error } = await supabase
        .rpc('get_todays_workout' as RpcFunction, {
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
}
