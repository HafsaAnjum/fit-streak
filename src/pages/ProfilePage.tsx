
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import StreakDisplay from "@/components/StreakDisplay";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserCard from "@/components/profile/UserCard";
import ProfileStats from "@/components/profile/ProfileStats";
import Achievements from "@/components/profile/Achievements";
import SettingsSection from "@/components/profile/SettingsSection";
import { toast } from "sonner";

const ProfilePage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <div className="container max-w-7xl mx-auto py-6 px-4 pb-24 md:pb-6 space-y-8">
        <ProfileHeader />
        <UserCard />

        <Tabs defaultValue="stats" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stats" className="m-0">
            <div className="space-y-6">
              <ProfileStats />
              <StreakDisplay />
            </div>
          </TabsContent>
          
          <TabsContent value="achievements" className="m-0">
            <Achievements />
          </TabsContent>
          
          <TabsContent value="settings" className="m-0">
            <SettingsSection onLogout={handleLogout} />
          </TabsContent>
        </Tabs>
      </div>
      <Navigation />
    </>
  );
};

export default ProfilePage;
