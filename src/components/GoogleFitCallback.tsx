
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleFitService } from "@/services/GoogleFitService";
import { FullPageLoader } from "@/components/LoadingSpinner";
import { toast } from "sonner";

const GoogleFitCallback = () => {
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [errorDetail, setErrorDetail] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      try {
        // Get the authorization code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");
        const error = urlParams.get("error");
        
        if (error) {
          throw new Error(`Authorization denied: ${error}`);
        }
        
        if (!code) {
          throw new Error("No authorization code found in URL");
        }
        
        // Process the authorization code
        const success = await GoogleFitService.handleAuthCallback(code);
        
        if (success) {
          setStatus("success");
          toast.success("Successfully connected to Google Fit!");
          
          // Redirect back to the original page or dashboard
          const redirectUrl = localStorage.getItem("authRedirectUrl") || "/";
          localStorage.removeItem("authRedirectUrl");
          
          // Short delay to show success message
          setTimeout(() => navigate(redirectUrl), 1500);
        } else {
          throw new Error("Failed to connect Google Fit");
        }
      } catch (error) {
        console.error("Error processing Google Fit callback:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setErrorDetail(errorMessage);
        setStatus("error");
        toast.error("Failed to connect to Google Fit");
        
        // Redirect back to dashboard after error
        setTimeout(() => navigate("/"), 3000);
      }
    };
    
    processCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/20">
      <div className="text-center">
        {status === "processing" && (
          <>
            <FullPageLoader />
            <h2 className="text-2xl font-bold mt-8">Connecting to Google Fit...</h2>
            <p className="text-muted-foreground mt-2">Please wait while we set up your connection.</p>
          </>
        )}
        
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mt-4">Successfully Connected!</h2>
            <p className="text-muted-foreground mt-2">Redirecting you back...</p>
          </>
        )}
        
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mt-4">Connection Failed</h2>
            <p className="text-muted-foreground mt-2">Unable to connect to Google Fit.</p>
            {errorDetail && <p className="text-sm text-red-500 mt-2">{errorDetail}</p>}
            <p className="text-muted-foreground mt-2">Redirecting you back...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default GoogleFitCallback;
