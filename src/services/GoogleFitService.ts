
import { supabase } from "@/integrations/supabase/client";
import { getTokensFromDb, deleteTokensFromDb } from "./fitness/GoogleFitApiClient";
import { initiateAuth, handleAuthCallback } from "./fitness/GoogleFitOAuthService";
import { getFitnessData, getMockFitnessData } from "./fitness/GoogleFitDataService";

// Main Google Fit Service that combines all functionality
export const GoogleFitService = {
  // Authentication
  initiateAuth,
  handleAuthCallback,
  
  // Data fetching
  getFitnessData,
  getMockFitnessData,
  
  // Check if user has connected their Google Fit account
  isConnected: async (): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const tokens = await getTokensFromDb(user.user.id, 'google_fit');
      return !!tokens;
    } catch (error) {
      return false;
    }
  },
  
  // Disconnect Google Fit
  disconnect: async (): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const tokens = await getTokensFromDb(user.user.id, 'google_fit');
      
      if (tokens?.access_token) {
        // Revoke access token
        await fetch(`https://oauth2.googleapis.com/revoke?token=${tokens.access_token}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });
      }
      
      // Delete tokens from database
      return await deleteTokensFromDb(user.user.id, 'google_fit');
    } catch (error) {
      console.error("Error disconnecting from Google Fit:", error);
      return false;
    }
  }
};
