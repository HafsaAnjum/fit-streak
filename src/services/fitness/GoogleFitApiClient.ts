
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Google Fit API endpoints
export const BASE_URL = "https://fitness.googleapis.com/fitness/v1/users/me";
export const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

// OAuth configuration
export const CLIENT_ID = "115719526977-t4ijd1tedi8730iprvbidl88lfu0o9km.apps.googleusercontent.com";
export const CLIENT_SECRET = "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";
export const REDIRECT_URI = window.location.origin + "/auth/google-fit/callback";
export const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.location.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
].join(" ");

// Types
export interface FitnessToken {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Timestamp when token expires
}

export interface FitnessData {
  steps: { date: string; value: number }[];
  calories: { date: string; value: number }[];
  distance: { date: string; value: number }[];
  activeMinutes: { date: string; value: number }[];
  lastSynced: string;
}

// Database access functions for tokens
export async function getTokensFromDb(userId: string, provider: string): Promise<FitnessToken | null> {
  try {
    const { data, error } = await supabase
      .from('fitness_connections')
      .select('access_token, refresh_token, expires_at')
      .eq('user_id', userId)
      .eq('provider', provider)
      .maybeSingle();
      
    if (error || !data) {
      console.error("Error getting tokens:", error);
      return null;
    }
    
    return data as FitnessToken;
  } catch (error) {
    console.error("Error in getTokensFromDb:", error);
    return null;
  }
}

export async function saveTokensToDb(
  userId: string, 
  provider: string, 
  tokens: FitnessToken
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fitness_connections')
      .upsert({
        user_id: userId,
        provider: provider,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_at,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id,provider' });
      
    if (error) {
      console.error("Error saving tokens:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in saveTokensToDb:", error);
    return false;
  }
}

export async function deleteTokensFromDb(userId: string, provider: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('fitness_connections')
      .delete()
      .eq('user_id', userId)
      .eq('provider', provider);
      
    if (error) {
      console.error("Error deleting tokens:", error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Error in deleteTokensFromDb:", error);
    return false;
  }
}

// Token refresh functionality
export async function refreshAccessToken(refreshToken: string, userId: string): Promise<boolean> {
  try {
    console.log("Refreshing access token");
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to refresh token:", errorText);
      throw new Error(`Failed to refresh token: ${errorText}`);
    }

    const tokenData = await response.json();
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    
    console.log("Token refreshed successfully, expires:", new Date(expiresAt).toISOString());
    
    // Save the new access token
    await saveTokensToDb(
      userId,
      'google_fit',
      {
        access_token: tokenData.access_token,
        refresh_token: refreshToken, // Keep the same refresh token
        expires_at: expiresAt,
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
}

// API request helpers
export async function fetchDatasetFromGoogleFit(
  accessToken: string,
  dataType: string,
  startTimeMillis: number,
  endTimeMillis: number
) {
  try {
    const response = await fetch(`${BASE_URL}/dataset:aggregate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        aggregateBy: [{ dataTypeName: dataType }],
        bucketByTime: { durationMillis: 86400000 }, // Daily buckets
        startTimeMillis,
        endTimeMillis,
      }),
    });

    if (!response.ok) {
      console.error(`Google Fit API error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error response:", errorText);
      throw new Error(`Google Fit API error: ${response.status} ${errorText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching data from Google Fit:", error);
    throw error;
  }
}
