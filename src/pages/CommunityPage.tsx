
import React from "react";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Leaderboard from "@/components/community/Leaderboard";
import Challenges from "@/components/community/Challenges";
import WorkoutSharing from "@/components/community/WorkoutSharing";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CommunityPage = () => {
  const { user } = useAuth();

  return (
    <>
      <Helmet>
        <title>Community | Fitness App</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            Fitness Community
          </h1>
          <p className="text-muted-foreground">
            Connect, compete, and share your fitness journey with others
          </p>
        </motion.div>

        <Tabs defaultValue="leaderboard" className="w-full">
          <TabsList className="w-full max-w-md mx-auto mb-6 grid grid-cols-3">
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="sharing">Profile & Sharing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="leaderboard" className="m-0 space-y-6">
            <Leaderboard />
          </TabsContent>
          
          <TabsContent value="challenges" className="m-0 space-y-6">
            <Challenges />
          </TabsContent>
          
          <TabsContent value="sharing" className="m-0 space-y-6">
            <WorkoutSharing userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>
      
      <Navigation />
    </>
  );
};

export default CommunityPage;
