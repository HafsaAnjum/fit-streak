
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footprints, Heart, Weight, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const ManualFitnessEntry = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    steps: "",
    weight: "",
    workoutDuration: "",
    heartRate: "",
  });
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    // Basic validation - all fields should be numbers if provided
    for (const [key, value] of Object.entries(formData)) {
      if (value && isNaN(Number(value))) {
        toast.error(`${key} must be a number`);
        return false;
      }
    }
    
    // At least one field should be filled
    if (Object.values(formData).every(v => !v)) {
      toast.error("Please fill at least one field");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Convert empty strings to null
      const dataToInsert = {
        user_id: user.id,
        steps: formData.steps ? parseInt(formData.steps) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        workout_duration: formData.workoutDuration ? parseInt(formData.workoutDuration) : null,
        heart_rate: formData.heartRate ? parseInt(formData.heartRate) : null,
      };
      
      const { error } = await supabase
        .from('fitness_entries')
        .insert(dataToInsert);
      
      if (error) {
        throw error;
      }
      
      toast.success("Fitness data saved successfully");
      
      // Clear the form
      setFormData({
        steps: "",
        weight: "",
        workoutDuration: "",
        heartRate: "",
      });
      
    } catch (error) {
      console.error("Error saving fitness data:", error);
      toast.error("Failed to save fitness data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-primary/10">
      <CardHeader className="bg-gradient-to-r from-blue-500/10 to-green-500/10">
        <CardTitle className="text-lg">Manual Fitness Data Entry</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <Footprints className="h-4 w-4 mr-2 text-blue-500" />
                <Label htmlFor="steps">Daily Steps</Label>
              </div>
              <Input
                id="steps"
                name="steps"
                placeholder="e.g. 8000"
                value={formData.steps}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Weight className="h-4 w-4 mr-2 text-green-500" />
                <Label htmlFor="weight">Weight (kg)</Label>
              </div>
              <Input
                id="weight"
                name="weight"
                placeholder="e.g. 68.5"
                value={formData.weight}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                <Label htmlFor="workoutDuration">Workout Duration (min)</Label>
              </div>
              <Input
                id="workoutDuration"
                name="workoutDuration"
                placeholder="e.g. 45"
                value={formData.workoutDuration}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <Heart className="h-4 w-4 mr-2 text-red-500" />
                <Label htmlFor="heartRate">Resting Heart Rate</Label>
              </div>
              <Input
                id="heartRate"
                name="heartRate"
                placeholder="e.g. 68"
                value={formData.heartRate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Fitness Data"}
          </Button>
          
          <p className="text-xs text-muted-foreground text-center">
            Your data is stored privately and used to generate insights
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualFitnessEntry;
