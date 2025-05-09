
import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Heart, Footprints, Activity, Clock, Weight, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const fitnessEntrySchema = z.object({
  date: z.date(),
  steps: z.number().min(0).max(100000).optional(),
  weight: z.number().min(20).max(500).optional(),
  workoutDuration: z.number().min(0).max(1440).optional(),
  heartRate: z.number().min(30).max(220).optional(),
  caloriesBurned: z.number().min(0).max(10000).optional(),
  sleepDuration: z.number().min(0).max(24).optional(),
});

type FitnessEntryValues = z.infer<typeof fitnessEntrySchema>;

const ManualFitnessEntry: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FitnessEntryValues>({
    resolver: zodResolver(fitnessEntrySchema),
    defaultValues: {
      date: new Date(),
      steps: undefined,
      weight: undefined,
      workoutDuration: undefined,
      heartRate: undefined,
      caloriesBurned: undefined,
      sleepDuration: undefined,
    },
  });

  const onSubmit = async (values: FitnessEntryValues) => {
    if (!user) {
      toast.error("You must be logged in to save fitness data");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert sleep hours to minutes for storage
      const sleepMinutes = values.sleepDuration ? values.sleepDuration * 60 : undefined;
      
      const { error } = await supabase
        .from("fitness_entries")
        .insert({
          user_id: user.id,
          entry_date: format(values.date, "yyyy-MM-dd"),
          steps: values.steps || null,
          weight: values.weight || null,
          workout_duration: values.workoutDuration || null,
          heart_rate: values.heartRate || null,
          calories_burned: values.caloriesBurned || null,
          sleep_duration: sleepMinutes || null,
        });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Fitness data saved successfully");
      form.reset({
        date: new Date(),
        steps: undefined,
        weight: undefined,
        workoutDuration: undefined,
        heartRate: undefined,
        caloriesBurned: undefined,
        sleepDuration: undefined,
      });
    } catch (error) {
      console.error("Error saving fitness data:", error);
      toast.error("Failed to save fitness data");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Fitness Data Entry</CardTitle>
        <CardDescription>Record your fitness data manually when not using a connected device</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Picker */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : "Select date"}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Steps Input */}
              <FormField
                control={form.control}
                name="steps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Steps</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Footprints className="mr-2 h-4 w-4 text-blue-500" />
                        <Input 
                          type="number" 
                          placeholder="10000" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Daily step count</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Weight Input */}
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Weight className="mr-2 h-4 w-4 text-green-500" />
                        <Input 
                          type="number" 
                          placeholder="150" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Your current weight</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Workout Duration Input */}
              <FormField
                control={form.control}
                name="workoutDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workout Duration (minutes)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-indigo-500" />
                        <Input 
                          type="number" 
                          placeholder="60" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>How long you exercised</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Heart Rate Input */}
              <FormField
                control={form.control}
                name="heartRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resting Heart Rate (bpm)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Heart className="mr-2 h-4 w-4 text-red-500" />
                        <Input 
                          type="number" 
                          placeholder="68" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Your resting heart rate</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Calories Burned Input */}
              <FormField
                control={form.control}
                name="caloriesBurned"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Calories Burned</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <Activity className="mr-2 h-4 w-4 text-orange-500" />
                        <Input 
                          type="number" 
                          placeholder="500" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>Estimated calories burned</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sleep Duration Input */}
              <FormField
                control={form.control}
                name="sleepDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleep Duration (hours)</FormLabel>
                    <FormControl>
                      <div className="flex items-center">
                        <BedDouble className="mr-2 h-4 w-4 text-purple-500" />
                        <Input 
                          type="number" 
                          placeholder="8" 
                          {...field}
                          value={field.value || ""}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>How many hours you slept</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Fitness Data"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManualFitnessEntry;
