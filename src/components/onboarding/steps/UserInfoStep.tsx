
import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepContentProps } from "../types";

const UserInfoStep: React.FC<StepContentProps> = ({ userInfoForm }) => {
  if (!userInfoForm) return null;
  
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tell Us About Yourself</h2>
      
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={userInfoForm.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Years" 
                    {...field} 
                    onChange={e => field.onChange(e.target.value)} // Convert to string for form handling
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={userInfoForm.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={userInfoForm.control}
            name="height"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Height (cm)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="cm" 
                    {...field} 
                    onChange={e => field.onChange(e.target.value)} // Convert to string for form handling
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={userInfoForm.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="kg" 
                    {...field} 
                    onChange={e => field.onChange(e.target.value)} // Convert to string for form handling
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={userInfoForm.control}
          name="workoutTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Workout Time</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="early_morning">Early Morning (5am-8am)</SelectItem>
                  <SelectItem value="morning">Morning (8am-11am)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (11am-4pm)</SelectItem>
                  <SelectItem value="evening">Evening (4pm-8pm)</SelectItem>
                  <SelectItem value="night">Night (8pm-12am)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </div>
  );
};

export default UserInfoStep;
