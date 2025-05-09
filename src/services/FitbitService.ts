
import { supabase } from "@/integrations/supabase/client";

// Fitbit API endpoints
const BASE_URL = "https://api.fitbit.com";
const TOKEN_ENDPOINT = "https://api.fitbit.com/oauth2/token";

// Fitbit OAuth configuration
const CLIENT_ID = "YOUR_FITBIT_CLIENT_ID"; // Replace with your Fitbit Client ID
const REDIRECT_URI = window.location.origin + "/auth/fitbit/callback";
const SCOPES = [
  "activity",
  "heartrate",
  "location",
  "nutrition",
  "profile",
  "settings",
  "sleep",
  "weight"
].join(" ");

interface FitnessToken {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Timestamp when token expires
}

interface FitbitData {
  steps: { date: string; value: number }[];
  calories: { date: string; value: number }[];
  heartRate: { date: string; value: number }[];
  sleep: { date: string; value: number }[];
  lastSynced: string;
}

// Direct database access functions - same pattern as GoogleFitService
async function getTokensFromDb(userId: string): Promise<FitnessToken | null> {
  const { data, error } = await supabase
    .from('fitness_connections')
    .select('access_token, refresh_token, expires_at')
    .eq('user_id', userId)
    .eq('provider', 'fitbit')
    .maybeSingle();
    
  if (error || !data) {
    console.error("Error getting Fitbit tokens:", error);
    return null;
  }
  
  return data as FitnessToken;
}

async function saveTokensToDb(
  userId: string, 
  tokens: FitnessToken
): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_connections')
    .upsert({
      user_id: userId,
      provider: 'fitbit',
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_at: tokens.expires_at,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,provider' });
    
  if (error) {
    console.error("Error saving Fitbit tokens:", error);
    return false;
  }
  
  return true;
}

async function deleteTokensFromDb(userId: string): Promise<boolean> {
  const { error } = await supabase
    .from('fitness_connections')
    .delete()
    .eq('user_id', userId)
    .eq('provider', 'fitbit');
    
  if (error) {
    console.error("Error deleting Fitbit tokens:", error);
    return false;
  }
  
  return true;
}

export const FitbitService = {
  // Initiate OAuth flow
  initiateAuth: () => {
    // Store the current URL to return after authentication
    localStorage.setItem("authRedirectUrl", window.location.pathname);

    // Create and redirect to Fitbit OAuth URL
    const authUrl = new URL("https://www.fitbit.com/oauth2/authorize");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES);
    authUrl.searchParams.append("expires_in", "604800"); // 7 days
    
    window.location.href = authUrl.toString();
  },

  // Handle OAuth callback and exchange code for tokens
  handleAuthCallback: async (code: string): Promise<boolean> => {
    try {
      // Basic auth for Fitbit API (client_id:client_secret in base64)
      const basicAuth = btoa(`${CLIENT_ID}:`);
      
      const tokenResponse = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${basicAuth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenResponse.ok) {
        throw new Error("Failed to exchange code for Fitbit tokens");
      }

      const tokenData = await tokenResponse.json();
      const expiresAt = Date.now() + tokenData.expires_in * 1000;
      
      // Get current user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("User not authenticated");
      }
      
      // Save tokens
      const saved = await saveTokensToDb(
        user.user.id,
        {
          access_token: tokenData.access_token,
          refresh_token: tokenData.refresh_token,
          expires_at: expiresAt,
        }
      );
      
      if (!saved) {
        throw new Error("Failed to save Fitbit tokens");
      }
      
      return true;
    } catch (error) {
      console.error("Error in Fitbit handleAuthCallback:", error);
      return false;
    }
  },

  // Fetch fitness data from Fitbit API
  getFitnessData: async (days = 7): Promise<FitbitData | null> => {
    try {
      // Get current user
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        throw new Error("User not authenticated");
      }
      
      // Get tokens from storage
      const tokens = await getTokensFromDb(user.user.id);
      if (!tokens) {
        throw new Error("No Fitbit tokens available");
      }

      // Check if token is expired
      if (tokens.expires_at < Date.now()) {
        const refreshed = await refreshAccessToken(tokens.refresh_token, user.user.id);
        if (!refreshed) {
          throw new Error("Failed to refresh Fitbit token");
        }
        // Get refreshed token
        const newTokens = await getTokensFromDb(user.user.id);
        if (!newTokens) {
          throw new Error("Could not retrieve refreshed token");
        }
        tokens.access_token = newTokens.access_token;
      }
      
      // Calculate date range
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      
      const endDateStr = formatDate(endDate);
      const startDateStr = formatDate(startDate);
      
      // Fetch multiple data types using Promise.all
      const [stepsData, caloriesData, heartRateData, sleepData] = await Promise.all([
        fetchFitbitTimeSeriesData(tokens.access_token, "activities/steps", startDateStr, endDateStr),
        fetchFitbitTimeSeriesData(tokens.access_token, "activities/calories", startDateStr, endDateStr),
        fetchFitbitHeartRateData(tokens.access_token, startDateStr, endDateStr),
        fetchFitbitSleepData(tokens.access_token, startDateStr, endDateStr)
      ]);
      
      const result: FitbitData = {
        steps: processTimeSeriesData(stepsData),
        calories: processTimeSeriesData(caloriesData),
        heartRate: processHeartRateData(heartRateData),
        sleep: processSleepData(sleepData),
        lastSynced: new Date().toISOString(),
      };
      
      return result;
    } catch (error) {
      console.error("Error fetching Fitbit data:", error);
      return null;
    }
  },
  
  // Check if user has connected their Fitbit account
  isConnected: async (): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const tokens = await getTokensFromDb(user.user.id);
      return !!tokens;
    } catch (error) {
      return false;
    }
  },
  
  // Disconnect Fitbit
  disconnect: async (): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return false;
      }
      
      const tokens = await getTokensFromDb(user.user.id);
      
      if (tokens?.access_token) {
        // Revoke access token
        await fetch(`${BASE_URL}/oauth2/revoke`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${tokens.access_token}`,
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            token: tokens.access_token,
          }),
        });
      }
      
      // Delete tokens from database
      return await deleteTokensFromDb(user.user.id);
    } catch (error) {
      console.error("Error disconnecting from Fitbit:", error);
      return false;
    }
  }
};

// Helper function to format dates for Fitbit API (yyyy-MM-dd)
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to fetch time series data from Fitbit
async function fetchFitbitTimeSeriesData(
  accessToken: string,
  resourcePath: string,
  startDate: string,
  endDate: string
) {
  const response = await fetch(`${BASE_URL}/1/user/-/${resourcePath}/date/${startDate}/${endDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fitbit API error: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to fetch heart rate data from Fitbit
async function fetchFitbitHeartRateData(
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const response = await fetch(`${BASE_URL}/1/user/-/activities/heart/date/${startDate}/${endDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fitbit heart rate API error: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to fetch sleep data from Fitbit
async function fetchFitbitSleepData(
  accessToken: string,
  startDate: string,
  endDate: string
) {
  const response = await fetch(`${BASE_URL}/1.2/user/-/sleep/date/${startDate}/${endDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Fitbit sleep API error: ${response.statusText}`);
  }

  return response.json();
}

// Helper function to process time series data
function processTimeSeriesData(apiResponse: any): { date: string; value: number }[] {
  const processedData: { date: string; value: number }[] = [];
  
  try {
    // The key changes based on the type of data requested
    const dataKey = Object.keys(apiResponse).find(key => key.includes('activities') || key.includes('body'));
    
    if (dataKey && Array.isArray(apiResponse[dataKey])) {
      for (const entry of apiResponse[dataKey]) {
        if (entry.dateTime && entry.value) {
          processedData.push({
            date: entry.dateTime,
            value: parseInt(entry.value, 10) || 0,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error processing Fitbit time series data:", error);
  }
  
  return processedData;
}

// Helper function to process heart rate data
function processHeartRateData(apiResponse: any): { date: string; value: number }[] {
  const processedData: { date: string; value: number }[] = [];
  
  try {
    if (apiResponse && Array.isArray(apiResponse['activities-heart'])) {
      for (const entry of apiResponse['activities-heart']) {
        if (entry.dateTime && entry.value && entry.value.restingHeartRate) {
          processedData.push({
            date: entry.dateTime,
            value: entry.value.restingHeartRate,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error processing Fitbit heart rate data:", error);
  }
  
  return processedData;
}

// Helper function to process sleep data
function processSleepData(apiResponse: any): { date: string; value: number }[] {
  const processedData: { date: string; value: number }[] = [];
  const dailySleepMap: Record<string, number> = {};
  
  try {
    if (apiResponse && Array.isArray(apiResponse.sleep)) {
      for (const sleepEntry of apiResponse.sleep) {
        if (sleepEntry.dateOfSleep && sleepEntry.minutesAsleep) {
          // Sum up sleep minutes per day
          const date = sleepEntry.dateOfSleep;
          dailySleepMap[date] = (dailySleepMap[date] || 0) + sleepEntry.minutesAsleep;
        }
      }
      
      // Convert map to array format
      for (const [date, minutes] of Object.entries(dailySleepMap)) {
        processedData.push({
          date,
          value: minutes,
        });
      }
    }
  } catch (error) {
    console.error("Error processing Fitbit sleep data:", error);
  }
  
  return processedData;
}

// Refresh access token
async function refreshAccessToken(refreshToken: string, userId: string): Promise<boolean> {
  try {
    // Basic auth for Fitbit API (client_id:client_secret in base64)
    const basicAuth = btoa(`${CLIENT_ID}:`);
    
    const response = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${basicAuth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to refresh Fitbit token");
    }

    const tokenData = await response.json();
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    
    // Save the new tokens
    await saveTokensToDb(
      userId,
      {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token || refreshToken, // Use new refresh token if provided
        expires_at: expiresAt,
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error refreshing Fitbit token:", error);
    return false;
  }
}
