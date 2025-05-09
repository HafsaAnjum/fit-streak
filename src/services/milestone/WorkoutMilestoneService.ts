
import { callRpc, getCurrentUser } from './types';
import { MilestoneBaseService } from './MilestoneBaseService';

export class WorkoutMilestoneService {
  // Check for workout-related milestones
  static async checkWorkoutMilestones(): Promise<void> {
    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return;
      }
      
      // Count completed workouts using the RPC function
      const workoutCount = await callRpc<number>('count_completed_workouts', {
        p_user_id: user.id
      });
      
      // Update workouts milestone progress
      if (workoutCount.length > 0 && workoutCount[0] !== null) {
        await MilestoneBaseService.updateMilestoneProgress('workouts', workoutCount[0]);
      }
    } catch (error) {
      console.error('Error in checkWorkoutMilestones:', error);
    }
  }
}
