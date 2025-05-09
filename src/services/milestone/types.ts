
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

// Define specific parameter types for each RPC function
type RPCParamTypes = {
  "get_all_milestones": Record<string, never>;
  "get_user_milestones": { p_user_id: string };
  "update_milestone_progress": { p_user_id: string; p_type: string; p_value: number };
  "get_newly_achieved_milestones": { p_user_id: string };
  "count_completed_workouts": { p_user_id: string };
  "get_user_fitness_stats": { user_id_param: string };
}

// Define valid function name type
type RpcFunctionName = keyof RPCParamTypes;

// Helper function to call RPC safely with proper typing
export async function callRpc<T = any, F extends RpcFunctionName = RpcFunctionName>(
  functionName: F,
  params?: Partial<RPCParamTypes[F]>
): Promise<T[]> {
  try {
    // Cast the params to any to avoid TypeScript errors with the Supabase RPC function
    const { data, error } = await supabase.rpc(functionName, (params || {}) as any);
    
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
