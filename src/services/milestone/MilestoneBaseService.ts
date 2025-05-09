
import { toast } from 'sonner';
import { callRpc, getCurrentUser, Milestone, UserMilestone } from './types';

export class MilestoneBaseService {
  // Get all available milestones
  static async getAllMilestones(): Promise<Milestone[]> {
    return callRpc<Milestone>('get_all_milestones');
  }
  
  // Get all user milestones with their progress
  static async getUserMilestones(): Promise<UserMilestone[]> {
    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return [];
      }
      
      return callRpc<UserMilestone>('get_user_milestones', {
        p_user_id: user.id
      });
      
    } catch (error) {
      console.error('Error in getUserMilestones:', error);
      return [];
    }
  }
  
  // Update milestone progress for a specific milestone type
  static async updateMilestoneProgress(type: string, value: number): Promise<void> {
    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return;
      }
      
      // Call the stored procedure to update milestone progress
      const { error } = await callRpc<null>('update_milestone_progress', {
        p_user_id: user.id,
        p_type: type,
        p_value: value
      });
      
      if (error) {
        console.error('Error updating milestone progress:', error);
        return;
      }
      
      // Check for newly achieved milestones
      const newlyAchieved = await callRpc<Milestone>('get_newly_achieved_milestones', {
        p_user_id: user.id
      });
      
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
  }
  
  // Helper to get user streak
  static async getUserStreak(): Promise<{ current_streak: number, longest_streak: number } | null> {
    try {
      // Get current user
      const user = await getCurrentUser();
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
  }
}
