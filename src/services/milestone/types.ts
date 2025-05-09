
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
