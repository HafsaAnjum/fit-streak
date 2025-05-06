
import React from "react";
import Dashboard from "@/components/Dashboard";
import ActivityTracker from "@/components/ActivityTracker";
import WorkoutPlanner from "@/components/WorkoutPlanner";
import StreakDisplay from "@/components/StreakDisplay";
import UserProfile from "@/components/UserProfile";
import Navigation from "@/components/Navigation";

const Index = () => {
  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">FitStreak</h1>
            <p className="text-muted-foreground">Your fitness journey, enhanced by AI</p>
          </div>
          <div className="bg-primary/10 p-2 rounded-lg">
            <span className="text-xs text-primary font-medium">DEMO</span>
          </div>
        </header>

        <Dashboard />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ActivityTracker />
          </div>
          <div className="lg:col-span-1">
            <WorkoutPlanner />
          </div>
          <div className="lg:col-span-1">
            <div className="grid gap-6">
              <StreakDisplay />
              <UserProfile />
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </>
  );
};

export default Index;
