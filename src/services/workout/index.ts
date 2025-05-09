
import { WorkoutGeneratorService } from './WorkoutGeneratorService';
import { WorkoutService } from './WorkoutService';
import { WorkoutType, WorkoutDay, WorkoutPlan } from './types';

// Main service facade that brings together all workout functionality
export const WorkoutPlannerService = {
  // Plan generation
  generateWorkoutPlan: WorkoutGeneratorService.generateWorkoutPlan,
  
  // Plan retrieval and management
  getCurrentPlan: WorkoutService.getCurrentPlan,
  completeWorkoutDay: WorkoutService.completeWorkoutDay,
  getTodaysWorkout: WorkoutService.getTodaysWorkout
};

// Re-export types for use in other files
export type { WorkoutType, WorkoutDay, WorkoutPlan };
