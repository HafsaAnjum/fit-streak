
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
  milestone?: Milestone;
}

export const MilestoneService = {
  // Get all available milestones
  getAllMilestones: async (): Promise<Milestone[]> => {
    try {
      // Use raw SQL query instead of the typed client
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .order('target_value', { ascending: true }) as { data: Milestone[], error: any };
        
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
      
      // Get all milestones
      const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .order('target_value', { ascending: true }) as { data: Milestone[], error: any };
        
      if (!milestones) {
        return [];
      }
      
      // Get user's milestone progress
      const { data: userMilestones, error } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', user.id) as { data: UserMilestone[], error: any };
        
      if (error) {
        console.error('Error fetching user milestones:', error);
        return [];
      }
      
      // Map user progress to milestones or create new entries
      const result: UserMilestone[] = milestones.map(milestone => {
        const userMilestone = userMilestones?.find(um => um.milestone_id === milestone.id);
        
        if (userMilestone) {
          return {
            ...userMilestone,
            milestone
          };
        } else {
          // Create new milestone progress entry
          return {
            user_id: user.id,
            milestone_id: milestone.id,
            achieved: false,
            progress: 0,
            milestone
          };
        }
      });
      
      return result;
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
      
      // Get milestones of this type
      const { data: milestones } = await supabase
        .from('milestones')
        .select('*')
        .eq('type', type) as { data: Milestone[], error: any };
        
      if (!milestones || milestones.length === 0) {
        return;
      }
      
      // Get current user progress for these milestones
      const { data: userMilestones } = await supabase
        .from('user_milestones')
        .select('*')
        .eq('user_id', user.id)
        .in('milestone_id', milestones.map(m => m.id)) as { data: UserMilestone[], error: any };
        
      // Process each milestone
      for (const milestone of milestones) {
        const userMilestone = userMilestones?.find(um => um.milestone_id === milestone.id);
        
        if (userMilestone) {
          // If already achieved, skip
          if (userMilestone.achieved) {
            continue;
          }
          
          // Update progress
          const newProgress = Math.min(value, milestone.target_value);
          const achieved = newProgress >= milestone.target_value;
          
          await supabase
            .from('user_milestones')
            .update({
              progress: newProgress,
              achieved: achieved,
              achieved_at: achieved ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            })
            .eq('id', userMilestone.id);
            
          // Show achievement notification
          if (achieved && !userMilestone.achieved) {
            toast.success(`Achievement Unlocked: ${milestone.title}`, {
              description: milestone.description,
              duration: 5000,
            });
          }
        } else {
          // Create new user milestone
          const achieved = value >= milestone.target_value;
          await supabase
            .from('user_milestones')
            .insert({
              user_id: user.id,
              milestone_id: milestone.id,
              progress: Math.min(value, milestone.target_value),
              achieved: achieved,
              achieved_at: achieved ? new Date().toISOString() : null
            });
            
          // Show achievement notification if achieved immediately
          if (achieved) {
            toast.success(`Achievement Unlocked: ${milestone.title}`, {
              description: milestone.description,
              duration: 5000,
            });
          }
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
      
      // Count completed workouts
      const { count, error } = await supabase
        .from('workout_days')
        .select('*', { count: 'exact', head: true })
        .eq('completed', true)
        .filter('plan_id.workout_plans.user_id', 'eq', user.id);
        
      if (error) {
        console.error('Error counting workouts:', error);
        return;
      }
      
      // Update workouts milestone progress
      if (count !== null) {
        await MilestoneService.updateMilestoneProgress('workouts', count);
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
        .maybeSingle();
        
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
