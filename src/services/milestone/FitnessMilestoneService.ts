
import { MilestoneBaseService } from './MilestoneBaseService';

export class FitnessMilestoneService {
  // Helper method to calculate total from a fitness metric array
  private static calculateTotal(data: any[] | undefined): number {
    return data?.reduce((sum: number, day: any) => sum + day.value, 0) || 0;
  }
  
  // Update step-related milestones
  static async updateStepsMilestones(stepsData: any[]): Promise<void> {
    if (!stepsData) return;
    
    const totalSteps = this.calculateTotal(stepsData);
    await MilestoneBaseService.updateMilestoneProgress('steps', totalSteps);
  }
  
  // Update calorie-related milestones
  static async updateCaloriesMilestones(caloriesData: any[]): Promise<void> {
    if (!caloriesData) return;
    
    const totalCalories = this.calculateTotal(caloriesData);
    await MilestoneBaseService.updateMilestoneProgress('calories', totalCalories);
  }
}
