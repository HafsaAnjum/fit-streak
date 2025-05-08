
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function AuthPage() {
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  
  useEffect(() => {
    // Check if the user came from an email verification link or is already logged in
    if (user) {
      navigate("/");
    }

    // Check for verification message in URL query params
    const urlParams = new URLSearchParams(location.search);
    const verified = urlParams.get('verified');
    
    if (verified === 'true') {
      setShowVerificationAlert(true);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [user, navigate, location]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(email, password);
      // We won't navigate since the user may need to verify their email
      setShowVerificationAlert(true);
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await signIn("demo@fitstreak.app", "Password123");
      navigate("/");
    } catch (error) {
      console.error("Demo login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const authContainerAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 to-background p-4">
      <motion.div 
        variants={authContainerAnimation}
        initial="hidden"
        animate="show"
        className="max-w-md w-full"
      >
        {showVerificationAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Alert className="bg-green-500/10 border-green-500/20 text-green-700">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription>
                Verification email sent! Please check your inbox and click the verification link.
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        
        <Card className="shadow-lg border-2 border-primary/20 overflow-hidden">
          <CardHeader className="text-center pb-4 bg-gradient-to-br from-primary/10 to-purple-400/5">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 15 
              }}
            >
              <CardTitle className="text-3xl font-bold text-gradient bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                FitStreak
              </CardTitle>
            </motion.div>
            <p className="text-muted-foreground mt-1">Your AI-powered fitness journey</p>
          </CardHeader>
          <CardContent className="pt-6">
            <Tabs 
              defaultValue="signin" 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><LoadingSpinner size={16} className="mr-2" /> Signing in...</> : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <><LoadingSpinner size={16} className="mr-2" /> Creating account...</> : "Create Account"}
                  </Button>
                </form>
              </TabsContent>
              
              <div className="mt-6 pt-6 border-t">
                <Button 
                  variant="secondary" 
                  className="w-full bg-gradient-to-r from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-all"
                  onClick={handleDemoLogin}
                  disabled={loading}
                >
                  {loading ? <><LoadingSpinner size={16} className="mr-2" /> Loading demo...</> : "Try Demo Account"}
                </Button>
                <p className="text-xs text-center text-muted-foreground mt-4">
                  Demo credentials: <span className="font-mono">demo@fitstreak.app / Password123</span>
                </p>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
