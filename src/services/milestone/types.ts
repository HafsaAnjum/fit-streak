
import { supabase } from '@/integrations/supabase/client';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  type: string;
  target_value: number;
  icon?: string;
}

export interface UserMilestone {
  id?: string;
  user_id?: string;
  milestone_id: string;
  achieved: boolean;
  achieved_at?: string | null;
  progress: number;
  milestone_title?: string;
  milestone_description?: string;
  milestone_type?: string;
  milestone_target_value?: number;
  milestone_icon?: string;
}

// Helper function to get current user
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Helper function to call RPC safely with proper typing
export async function callRpc<T = any>(
  functionName: "get_all_milestones" | "get_user_milestones" | "update_milestone_progress" | 
                "get_newly_achieved_milestones" | "count_completed_workouts" | "get_user_fitness_stats", 
  params?: Record<string, any>
): Promise<T[]> {
  try {
    const { data, error } = await supabase.rpc(functionName, params || {});
    
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
