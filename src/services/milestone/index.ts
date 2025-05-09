
import { supabase } from '@/integrations/supabase/client';
import { Milestone, UserMilestone } from './types';
import { MilestoneBaseService } from './MilestoneBaseService';
import { WorkoutMilestoneService } from './WorkoutMilestoneService';
import { StreakMilestoneService } from './StreakMilestoneService';
import { FitnessMilestoneService } from './FitnessMilestoneService';

// Main service facade that brings together all milestone functionality
export const MilestoneService = {
  // Base milestone operations
  getAllMilestones: MilestoneBaseService.getAllMilestones,
  getUserMilestones: MilestoneBaseService.getUserMilestones,
  updateMilestoneProgress: MilestoneBaseService.updateMilestoneProgress,
  getUserStreak: MilestoneBaseService.getUserStreak,
  
  // Specialized milestone checks
  checkWorkoutMilestones: WorkoutMilestoneService.checkWorkoutMilestones,
  checkStreakMilestones: StreakMilestoneService.checkStreakMilestones,
  
  // Check all milestone types when fitness data is updated
  checkAllMilestones: async (fitnessData: any): Promise<void> => {
    try {
      if (!fitnessData) return;
      
      // Update step milestones
      await FitnessMilestoneService.updateStepsMilestones(fitnessData.steps);
      
      // Update calorie milestones
      await FitnessMilestoneService.updateCaloriesMilestones(fitnessData.calories);
      
      // Check workout milestones
      await WorkoutMilestoneService.checkWorkoutMilestones();
      
      // Check streak milestones
      await StreakMilestoneService.checkStreakMilestones();
    } catch (error) {
      console.error('Error checking all milestones:', error);
    }
  }
};

// Re-export the types for use in other files
export type { Milestone, UserMilestone };
