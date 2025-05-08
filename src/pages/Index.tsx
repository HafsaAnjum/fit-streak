
import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Award, Calendar, User, ChevronRight, Plus } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/context/AuthContext";
import Settings from "@/components/Settings";
import { Link } from "react-router-dom";

const MotionCard = motion(Card);

const Index = () => {
  const { user, profile } = useAuth();
  
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
  
  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">FitStreak</h1>
            <p className="text-muted-foreground">
              {user ? `Welcome back, ${profile?.username || user.email?.split('@')[0]}` : 'Your fitness journey, enhanced by AI'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {user && <Settings />}
          </div>
        </header>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
            <Link to="/workouts" className="block p-6">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-primary" />
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
          
          <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
          
          <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
          
          <MotionCard variants={item} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
            <Button className="justify-start">
              <Plus className="mr-2 h-4 w-4" />
              Add new workout
            </Button>
            <Button variant="outline" className="justify-start">
              <Activity className="mr-2 h-4 w-4" />
              Log today's activity
            </Button>
            <Button variant="outline" className="justify-start">
              <Award className="mr-2 h-4 w-4" />
              View current streak
            </Button>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
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
