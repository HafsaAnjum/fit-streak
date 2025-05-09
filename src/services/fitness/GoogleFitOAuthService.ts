
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  CLIENT_ID, 
  CLIENT_SECRET, 
  REDIRECT_URI, 
  SCOPES, 
  TOKEN_ENDPOINT,
  saveTokensToDb
} from "./GoogleFitApiClient";

// OAuth flow initiation
export function initiateAuth() {
  try {
    // Store the current URL to return after authentication
    localStorage.setItem("authRedirectUrl", window.location.pathname);

    // Create and redirect to Google OAuth URL with correct parameters
    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    authUrl.searchParams.append("client_id", CLIENT_ID);
    authUrl.searchParams.append("redirect_uri", REDIRECT_URI);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("scope", SCOPES);
    authUrl.searchParams.append("access_type", "offline");
    authUrl.searchParams.append("prompt", "consent");
    
    // Log what we're doing to help with debugging
    console.log("Initiating Google Fit auth, redirecting to:", authUrl.toString());
    console.log("Redirect URI set to:", REDIRECT_URI);
    
    window.location.href = authUrl.toString();
  } catch (error) {
    console.error("Error initiating Google Fit auth:", error);
    toast.error("Failed to connect to Google Fit");
  }
}

// Handle OAuth callback and exchange code for tokens
export async function handleAuthCallback(code: string): Promise<boolean> {
  try {
    console.log("Handling Google Fit auth callback with code:", code.substring(0, 10) + "...");
    
    const tokenFormData = new URLSearchParams({
      code: code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });
    
    console.log("Sending token request to:", TOKEN_ENDPOINT);
    console.log("With params:", {
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    });
    
    const tokenResponse = await fetch(TOKEN_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: tokenFormData,
    });

    console.log("Token response status:", tokenResponse.status);
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token error response:", errorText);
      toast.error("Failed to exchange code for tokens");
      throw new Error(`Failed to exchange code for tokens: ${errorText}`);
    }

    const tokenData = await tokenResponse.json();
    console.log("Received token data:", { 
      access_token: tokenData.access_token ? "present" : "missing",
      refresh_token: tokenData.refresh_token ? "present" : "missing",
      expires_in: tokenData.expires_in 
    });
    
    const expiresAt = Date.now() + tokenData.expires_in * 1000;
    
    // Get current user
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      toast.error("User not authenticated");
      throw new Error("User not authenticated");
    }
    
    console.log("Saving tokens for user:", user.user.id);
    
    // Save tokens
    const saved = await saveTokensToDb(
      user.user.id,
      'google_fit',
      {
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        expires_at: expiresAt,
      }
    );
    
    if (!saved) {
      toast.error("Failed to save tokens");
      throw new Error("Failed to save tokens");
    }
    
    console.log("Google Fit auth successful!");
    toast.success("Successfully connected to Google Fit");
    return true;
  } catch (error) {
    console.error("Error in handleAuthCallback:", error);
    toast.error("Failed to complete Google Fit connection");
    return false;
  }
}
