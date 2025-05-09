
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Clock, Footprints, Flame, Heart, Activity } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const ManualFitnessEntry = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [steps, setSteps] = useState<string>("");
  const [calories, setCalories] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to add fitness data");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert inputs to appropriate types
      const formattedDate = format(date, "yyyy-MM-dd");
      const entryData = {
        user_id: user.id,
        created_at: new Date().toISOString(),
        completed_at: new Date(formattedDate).toISOString(),
        type: "manual_entry",
        steps: steps ? parseInt(steps) : null,
        calories: calories ? parseInt(calories) : null,
        heart_rate: heartRate ? parseInt(heartRate) : null,
        distance: distance ? parseFloat(distance) : null,
        duration: duration ? parseInt(duration) : null,
      };
      
      // Save to activities table
      const { error } = await supabase
        .from('activities')
        .insert(entryData);
      
      if (error) {
        throw error;
      }
      
      toast.success("Fitness data added successfully");
      
      // Reset form
      setSteps("");
      setCalories("");
      setHeartRate("");
      setDistance("");
      setDuration("");
      setDate(new Date());
      
    } catch (error) {
      console.error("Error adding fitness data:", error);
      toast.error("Failed to add fitness data");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Fitness Data Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => setDate(date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="steps" className="flex items-center">
                <Footprints className="h-4 w-4 mr-1 text-blue-500" />
                Steps
              </Label>
              <Input
                id="steps"
                type="number"
                min="0"
                value={steps}
                onChange={(e) => setSteps(e.target.value)}
                placeholder="e.g. 8000"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="calories" className="flex items-center">
                <Flame className="h-4 w-4 mr-1 text-orange-500" />
                Calories
              </Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="e.g. 500"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="heartRate" className="flex items-center">
                <Heart className="h-4 w-4 mr-1 text-red-500" />
                Heart Rate
              </Label>
              <Input
                id="heartRate"
                type="number"
                min="0"
                value={heartRate}
                onChange={(e) => setHeartRate(e.target.value)}
                placeholder="e.g. 72"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance" className="flex items-center">
                <Activity className="h-4 w-4 mr-1 text-green-500" />
                Distance (km)
              </Label>
              <Input
                id="distance"
                type="number"
                min="0"
                step="0.01"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 5.2"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-purple-500" />
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 30"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Fitness Data"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualFitnessEntry;
