
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProfileNotFoundProps {
  error?: string;
}

const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({ error }) => {
  return (
    <div className="container max-w-7xl mx-auto py-12 px-4">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Profile Not Available</CardTitle>
          <CardDescription>
            {error || "This profile does not exist or is set to private."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link to="/">Return to Home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileNotFound;
