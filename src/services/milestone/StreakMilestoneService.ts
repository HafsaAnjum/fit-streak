
import { MilestoneBaseService } from './MilestoneBaseService';

export class StreakMilestoneService {
  // Check for streak-related milestones
  static async checkStreakMilestones(): Promise<void> {
    try {
      // Get current user streak
      const streak = await MilestoneBaseService.getUserStreak();
      if (!streak) return;
      
      // Update streak milestone progress
      await MilestoneBaseService.updateMilestoneProgress('streak', streak.current_streak);
    } catch (error) {
      console.error('Error in checkStreakMilestones:', error);
    }
  }
}
