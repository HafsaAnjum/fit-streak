
import { supabase } from '@/integrations/supabase/client';
import { MilestoneService } from './MilestoneService';
import { StreakService } from './StreakService';
import { toast } from 'sonner';

export const FitnessSyncService = {
  // Process fitness data and update all related metrics
  processFitnessDataSync: async (fitnessData: any): Promise<void> => {
    try {
      if (!fitnessData || !fitnessData.steps || fitnessData.steps.length === 0) {
        return;
      }
      
      // 1. Update streaks based on activity
      await StreakService.checkAndUpdateStreak(fitnessData.steps);
      
      // 2. Check all milestones
      await MilestoneService.checkAllMilestones(fitnessData);
      
      console.log('Fitness data synced successfully');
    } catch (error) {
      console.error('Error in fitness data sync:', error);
    }
  },
  
  // Log activity for today
  logActivity: async (activityData: {
    steps?: number;
    calories?: number;
    distance?: number;
    duration?: number;
    heart_rate?: number;
    type: string;
  }): Promise<boolean> => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('You must be logged in to log activity');
        return false;
      }
      
      // Add activity to database
      const { error } = await supabase
        .from('activities')
        .insert({
          user_id: user.id,
          ...activityData,
          completed_at: new Date().toISOString()
        });
        
      if (error) {
        console.error('Error logging activity:', error);
        toast.error('Failed to log activity');
        return false;
      }
      
      // Update streak if activity is valid
      if ((activityData.steps && activityData.steps >= 500) || 
         (activityData.duration && activityData.duration >= 15)) {
        await StreakService.updateStreak();
      }
      
      // Check and update milestones
      if (activityData.steps) {
        await MilestoneService.updateMilestoneProgress('steps', activityData.steps);
      }
      
      if (activityData.calories) {
        await MilestoneService.updateMilestoneProgress('calories', activityData.calories);
      }
      
      toast.success('Activity logged successfully');
      return true;
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error('An error occurred while logging your activity');
      return false;
    }
  }
};
