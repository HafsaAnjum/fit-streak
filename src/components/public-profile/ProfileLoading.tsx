
import React from "react";

const ProfileLoading: React.FC = () => {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4 text-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
      <p className="mt-4 text-muted-foreground">Loading profile...</p>
    </div>
  );
};

export default ProfileLoading;
