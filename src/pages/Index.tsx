
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Award, Calendar, User, ChevronRight, Plus, BarChart, Dumbbell, Heart } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import Settings from "@/components/Settings";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import Dashboard from "@/components/Dashboard";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { useState, useEffect } from "react";
import { useOnboardingRedirect } from "@/hooks/useOnboardingRedirect";
import WebHealthConnect from "@/components/WebHealthConnect";

const MotionCard = motion(Card);

const Index = () => {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const { isChecking } = useOnboardingRedirect();
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading || isChecking) return <FullPageLoader />;
  
  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent">
              FitStreak
            </h1>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${profile?.username || user.email?.split('@')[0]}` : 'Your fitness journey, enhanced by AI'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {user && <Settings />}
          </div>
        </motion.header>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="explore" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Dumbbell className="w-4 h-4 mr-2" />
              Explore
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-0 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <WebHealthConnect />
            </motion.div>
            <Dashboard />
          </TabsContent>

          <TabsContent value="analytics" className="mt-0 space-y-4">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="explore" className="mt-0">
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover-lift bg-gradient-to-br from-card to-secondary/50">
                <Link to="/workouts" className="block p-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Dumbbell className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Workouts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plan and track your fitness routines
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">View workouts</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </MotionCard>
              
              <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover-lift bg-gradient-to-br from-card to-secondary/50">
                <Link to="/activities" className="block p-6">
                  <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Activity className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Activities</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Log and analyze your daily activities
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Track activities</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </MotionCard>
              
              <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover-lift bg-gradient-to-br from-card to-secondary/50">
                <Link to="/profile" className="block p-6">
                  <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Achievements</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your streaks and accomplishments
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">See achievements</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </MotionCard>
              
              <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover-lift bg-gradient-to-br from-card to-secondary/50">
                <Link to="/profile" className="block p-6">
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-purple-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Profile</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Update your personal information
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Edit profile</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </Link>
              </MotionCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Quick Actions</h2>
                <Button variant="ghost" size="sm">View all</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button className="justify-start bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add new workout
                </Button>
                <Button variant="outline" className="justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  Log today's activity
                </Button>
                <Button variant="outline" className="justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Check health stats
                </Button>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 hidden lg:block"
        >
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/20">
            <div className="p-6 md:p-8">
              <h3 className="text-xl font-semibold mb-2">Enhance Your Fitness Journey</h3>
              <p className="text-muted-foreground mb-6">
                Track your progress, set goals, and achieve your fitness dreams with FitStreak's AI-powered insights.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Navigation />
    </>
  );
};

export default Index;
