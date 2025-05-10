
import { z } from "zod";

// Zod schema for user info form
export const UserInfoSchema = z.object({
  age: z.string().min(1, "Age is required"),
  height: z.string().min(1, "Height is required"),
  weight: z.string().min(1, "Weight is required"),
  gender: z.string().min(1, "Gender is required"),
  workoutTime: z.string().min(1, "Preferred workout time is required"),
});

export type UserInfoValues = z.infer<typeof UserInfoSchema>;

// Onboarding form data type
export interface OnboardingFormData {
  fullName: string;
  nickname: string;
  fitnessGoal: string;
  fitnessLevel: string;
  workoutType: string;
  gender: string;
  age: string;
  height: string;
  weight: string;
  workoutTime: string;
  dataSourceConnected: boolean;
  dataSourceType: string;
  goals: string[];
  allowNotifications: boolean;
}

// Props for onboarding components
export interface OnboardingProps {
  onComplete: () => void;
}

export interface StepContentProps {
  formData?: OnboardingFormData;
  setFormData?: React.Dispatch<React.SetStateAction<OnboardingFormData>>;
  userInfoForm?: any; // For the form that uses react-hook-form
  onSourceConnect?: (source: string, connected: boolean) => void;
  onGoalSelect?: (goal: string) => void;
  onWorkoutPreferences?: (level: string, type: string) => void;
}
