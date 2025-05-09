
import { WorkoutType } from './types';

// Exercise templates for different workout types
export const workoutTemplates: Record<WorkoutType, Array<{ name: string, description: string }>> = {
  cardio: [
    { name: "Running", description: "Steady pace running outdoors or on treadmill" },
    { name: "Cycling", description: "Indoor cycling or outdoor biking" },
    { name: "Swimming", description: "Full body cardio workout" },
    { name: "Jump Rope", description: "High intensity cardio" },
    { name: "Rowing", description: "Full body cardio with resistance" }
  ],
  strength: [
    { name: "Upper Body", description: "Focus on chest, shoulders, back, and arms" },
    { name: "Lower Body", description: "Focus on legs, glutes, and core" },
    { name: "Full Body", description: "Compound exercises targeting multiple muscle groups" },
    { name: "Core Focus", description: "Abdominals and lower back exercises" },
    { name: "Functional Strength", description: "Movement patterns that translate to daily activities" }
  ],
  flexibility: [
    { name: "Dynamic Stretching", description: "Active movements that stretch muscles" },
    { name: "Static Stretching", description: "Holding stretches for increased flexibility" },
    { name: "Yoga Flow", description: "Flowing movements combined with breathing" },
    { name: "Pilates", description: "Core strengthening and flexibility work" },
    { name: "Mobility Routine", description: "Joint mobility and range of motion exercises" }
  ],
  hiit: [
    { name: "Tabata", description: "20 seconds work, 10 seconds rest intervals" },
    { name: "Circuit Training", description: "Rotating through different exercise stations" },
    { name: "EMOM", description: "Every Minute On the Minute intervals" },
    { name: "AMRAP", description: "As Many Rounds As Possible in set time" },
    { name: "Pyramid", description: "Increasing then decreasing reps of exercises" }
  ],
  yoga: [
    { name: "Vinyasa Flow", description: "Flowing sequence of poses linked with breath" },
    { name: "Power Yoga", description: "Strength-focused yoga practice" },
    { name: "Restorative Yoga", description: "Gentle practice with longer held poses" },
    { name: "Yin Yoga", description: "Deep stretching with long-held poses" },
    { name: "Hatha Yoga", description: "Traditional practice focusing on alignment" }
  ],
  mixed: [
    { name: "Cardio + Strength", description: "Combination of cardio and strength exercises" },
    { name: "Movement + Recovery", description: "Active movements followed by recovery work" },
    { name: "Cross-Training", description: "Variety of exercise modalities" },
    { name: "Interval + Flexibility", description: "Intervals with flexibility work" },
    { name: "Strength + Mobility", description: "Strength exercises with mobility work" }
  ],
  rest: [
    { name: "Active Recovery", description: "Light movement like walking or gentle yoga" },
    { name: "Complete Rest", description: "Focus on recuperation and sleep" },
    { name: "Stretching Session", description: "Full body flexibility work" },
    { name: "Foam Rolling", description: "Self-myofascial release for recovery" },
    { name: "Light Mobility", description: "Joint mobility exercises without intensity" }
  ]
};
