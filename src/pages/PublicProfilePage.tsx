
import React from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Import our new components
import ProfileHeader from "@/components/public-profile/ProfileHeader";
import ProfileStats from "@/components/public-profile/ProfileStats";
import RecentWorkouts from "@/components/public-profile/RecentWorkouts";
import ProfileAchievements from "@/components/public-profile/ProfileAchievements";
import ProfileLoading from "@/components/public-profile/ProfileLoading";
import ProfileNotFound from "@/components/public-profile/ProfileNotFound";
import usePublicProfile from "@/hooks/usePublicProfile";

const PublicProfilePage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { profile, loading, error } = usePublicProfile(userId);

  if (loading) {
    return <ProfileLoading />;
  }

  if (error || !profile) {
    return <ProfileNotFound error={error} />;
  }

  return (
    <>
      <Helmet>
        <title>{profile.username}'s Fitness Profile</title>
      </Helmet>
      
      <div className="container max-w-7xl mx-auto py-8 px-4 pb-24 md:pb-6 space-y-6">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="pb-2">
            <Button asChild variant="ghost" className="w-fit -ml-2.5 mb-2">
              <Link to="/community">
                <span>← Back to Community</span>
              </Link>
            </Button>
            
            <ProfileHeader 
              username={profile.username}
              avatar_url={profile.avatar_url}
              bio={profile.bio}
              fitness_level={profile.fitness_level}
              streak={profile.streak}
            />
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* User Stats */}
            {profile.stats && <ProfileStats stats={profile.stats} />}
            
            {/* Recent Workouts */}
            <RecentWorkouts workouts={profile.workouts} />
            
            {/* Achievements */}
            <ProfileAchievements achievements={profile.achievements} />
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PublicProfilePage;
