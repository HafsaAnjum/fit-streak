
import { toast } from "sonner";
import { WorkoutSession, getCurrentUser } from './types';
import { supabase } from "@/integrations/supabase/client";
import { GoogleFitService } from "@/services/GoogleFitService";

export class WorkoutSessionService {
  // Start a new workout session
  static async startSession(activityType: string): Promise<WorkoutSession | null> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("You must be logged in to start a workout");
        return null;
      }
      
      const startTime = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: user.id,
          start_time: startTime,
          activity_type: activityType,
          steps: 0,
          calories_burned: 0,
          duration: 0,
          completed: false
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error starting workout session:', error);
        toast.error("Failed to start workout session");
        return null;
      }
      
      toast.success("Workout session started!");
      return data as WorkoutSession;
    } catch (error) {
      console.error('Error starting workout session:', error);
      toast.error("Failed to start workout session");
      return null;
    }
  }
  
  // End an active workout session
  static async endSession(
    sessionId: string, 
    metrics: { steps: number, calories: number, duration: number, heartRate?: number }
  ): Promise<WorkoutSession | null> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        toast.error("You must be logged in to end a workout");
        return null;
      }
      
      const endTime = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .update({
          end_time: endTime,
          steps: metrics.steps,
          calories_burned: metrics.calories,
          duration: metrics.duration,
          heart_rate: metrics.heartRate || null,
          completed: true
        })
        .eq('id', sessionId)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error ending workout session:', error);
        toast.error("Failed to save workout results");
        return null;
      }
      
      toast.success("Workout completed! Results saved.");
      return data as WorkoutSession;
    } catch (error) {
      console.error('Error ending workout session:', error);
      toast.error("Failed to save workout results");
      return null;
    }
  }
  
  // Get the last completed workout session
  static async getLastSession(): Promise<WorkoutSession | null> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return null;
      }
      
      const { data, error } = await supabase
        .from('workout_sessions')
        .select()
        .eq('user_id', user.id)
        .eq('completed', true)
        .order('end_time', { ascending: false })
        .limit(1)
        .maybeSingle();
        
      if (error || !data) {
        console.error('Error fetching last workout session:', error);
        return null;
      }
      
      return data as WorkoutSession;
    } catch (error) {
      console.error('Error fetching last workout session:', error);
      return null;
    }
  }
  
  // Get current fitness metrics from Google Fit
  static async getCurrentMetrics(): Promise<{ 
    steps: number; 
    calories: number;
    heartRate?: number;
  } | null> {
    try {
      // Check if connected to Google Fit
      const connected = await GoogleFitService.isConnected();
      
      if (!connected) {
        return {
          steps: 0,
          calories: 0
        };
      }
      
      // Get recent metrics from Google Fit (last hour)
      const fitnessData = await GoogleFitService.getFitnessData(1); // Get last day
      
      if (!fitnessData) {
        return {
          steps: 0,
          calories: 0
        };
      }
      
      // Get today's metrics
      const today = new Date().toISOString().split('T')[0];
      const todaySteps = fitnessData.steps.find(item => item.date === today)?.value || 0;
      const todayCalories = fitnessData.calories.find(item => item.date === today)?.value || 0;
      
      return {
        steps: todaySteps,
        calories: todayCalories
      };
    } catch (error) {
      console.error('Error getting current metrics:', error);
      return {
        steps: 0,
        calories: 0
      };
    }
  }
  
  // Get user's weekly workout goal progress
  static async getWeeklyGoalProgress(): Promise<{ 
    workouts: number; 
    goal: number; 
    percentage: number 
  }> {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return { workouts: 0, goal: 5, percentage: 0 };
      }
      
      // Get start and end date of current week
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as first day
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      // Get completed sessions for this week
      const { data, error } = await supabase
        .from('workout_sessions')
        .select('id')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('start_time', startOfWeek.toISOString())
        .lte('end_time', endOfWeek.toISOString());
        
      if (error) {
        console.error('Error fetching weekly workouts:', error);
        return { workouts: 0, goal: 5, percentage: 0 };
      }
      
      // Default goal is 5 workouts per week
      const goal = 5; 
      const workouts = data?.length || 0;
      const percentage = Math.min((workouts / goal) * 100, 100);
      
      return { workouts, goal, percentage };
    } catch (error) {
      console.error('Error getting weekly goal progress:', error);
      return { workouts: 0, goal: 5, percentage: 0 };
    }
  }
}
