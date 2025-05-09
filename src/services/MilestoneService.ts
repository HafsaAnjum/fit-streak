
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
interface RpcResponse<T> {
  data: T | null;
  error: any;
}

// Define valid RPC function name type
type RpcFunction = string;

export const MilestoneService = {
  // Get all available milestones
  getAllMilestones: async (): Promise<Milestone[]> => {
    try {
      // Use RPC function instead of direct table access
      const { data, error } = await supabase
        .rpc('get_all_milestones' as RpcFunction) as unknown as RpcResponse<Milestone[]>;
      
      if (error) {
        console.error('Error fetching milestones:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getAllMilestones:', error);
      return [];
    }
  },
  
  // Get all user milestones with their progress
  getUserMilestones: async (): Promise<UserMilestone[]> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return [];
      }
      
      // Get user milestones with milestone details using RPC function
      const { data, error } = await supabase
        .rpc('get_user_milestones' as RpcFunction, {
          p_user_id: user.id
        }) as unknown as RpcResponse<UserMilestone[]>;
      
      if (error) {
        console.error('Error fetching user milestones:', error);
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getUserMilestones:', error);
      return [];
    }
  },
  
  // Update milestone progress for a specific milestone type
  updateMilestoneProgress: async (type: string, value: number): Promise<void> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      
      // Call the stored procedure to update milestone progress
      const { error } = await supabase
        .rpc('update_milestone_progress' as RpcFunction, {
          p_user_id: user.id,
          p_type: type,
          p_value: value
        }) as unknown as RpcResponse<null>;
      
      if (error) {
        console.error('Error updating milestone progress:', error);
      }
      
      // Check for newly achieved milestones
      const { data: newlyAchieved } = await supabase
        .rpc('get_newly_achieved_milestones' as RpcFunction, {
          p_user_id: user.id
        }) as unknown as RpcResponse<Milestone[]>;
      
      // Show achievement notifications
      if (newlyAchieved && newlyAchieved.length > 0) {
        for (const milestone of newlyAchieved) {
          toast.success(`Achievement Unlocked: ${milestone.title}`, {
            description: milestone.description,
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error updating milestone progress:', error);
    }
  },
  
  // Check for workout-related milestones
  checkWorkoutMilestones: async (): Promise<void> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return;
      }
      
      // Count completed workouts using the RPC function
      const { data, error } = await supabase
        .rpc('count_completed_workouts' as RpcFunction, {
          p_user_id: user.id
        }) as unknown as RpcResponse<number>;
        
      if (error) {
        console.error('Error counting workouts:', error);
        return;
      }
      
      // Update workouts milestone progress
      if (data !== null) {
        await MilestoneService.updateMilestoneProgress('workouts', data);
      }
    } catch (error) {
      console.error('Error in checkWorkoutMilestones:', error);
    }
  },
  
  // Check for streak-related milestones
  checkStreakMilestones: async (): Promise<void> => {
    try {
      // Get current user streak
      const streak = await MilestoneService.getUserStreak();
      if (!streak) return;
      
      // Update streak milestone progress
      await MilestoneService.updateMilestoneProgress('streak', streak.current_streak);
    } catch (error) {
      console.error('Error in checkStreakMilestones:', error);
    }
  },
  
  // Helper to get user streak
  getUserStreak: async (): Promise<{ current_streak: number, longest_streak: number } | null> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      
      // Get streak data
      const { data, error } = await supabase
        .from('streaks')
        .select('current_streak, longest_streak')
        .eq('user_id', user.id)
        .maybeSingle() as {
          data: { current_streak: number, longest_streak: number } | null;
          error: any;
        };
        
      if (error || !data) {
        console.error('Error fetching user streak:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error getting user streak:', error);
      return null;
    }
  },
  
  // Check all milestone types when fitness data is updated
  checkAllMilestones: async (fitnessData: any): Promise<void> => {
    try {
      if (!fitnessData) return;
      
      // Calculate total steps
      const totalSteps = fitnessData.steps?.reduce((sum: number, day: any) => sum + day.value, 0) || 0;
      
      // Calculate total calories
      const totalCalories = fitnessData.calories?.reduce((sum: number, day: any) => sum + day.value, 0) || 0;
      
      // Update step milestones
      await MilestoneService.updateMilestoneProgress('steps', totalSteps);
      
      // Update calorie milestones
      await MilestoneService.updateMilestoneProgress('calories', totalCalories);
      
      // Check workout milestones
      await MilestoneService.checkWorkoutMilestones();
      
      // Check streak milestones
      await MilestoneService.checkStreakMilestones();
    } catch (error) {
      console.error('Error checking all milestones:', error);
    }
  }
};
