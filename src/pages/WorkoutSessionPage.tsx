
import React from 'react';
import { Helmet } from 'react-helmet';
import LiveWorkoutSession from '@/components/workout/LiveWorkoutSession';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GoogleFitService } from '@/services/GoogleFitService';
import { useFitnessData } from '@/hooks/useFitnessData';

const WorkoutSessionPage = () => {
  const { isConnected } = useFitnessData();
  
  const handleConnectGoogleFit = () => {
    GoogleFitService.initiateAuth();
  };
  
  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>Live Workout Session | Fitness App</title>
      </Helmet>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Real-Time Workout Tracking</h1>
        <p className="text-muted-foreground">
          Track your workout in real-time and get motivational feedback to keep you on track.
        </p>
      </div>
      
      {!isConnected ? (
        <Card className="max-w-md mx-auto mb-8">
          <CardHeader>
            <CardTitle>Connect to Google Fit</CardTitle>
            <CardDescription>
              To track your workout in real-time, you'll need to connect to Google Fit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnectGoogleFit} className="w-full">
              Connect Google Fit
            </Button>
          </CardContent>
        </Card>
      ) : (
        <LiveWorkoutSession />
      )}
    </div>
  );
};

export default WorkoutSessionPage;
