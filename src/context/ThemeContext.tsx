
import React, { createContext, useEffect, useState, useContext } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

type ThemeType = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => Promise<void>;
  resolvedTheme: "light" | "dark"; // The actual theme applied (resolved from system if needed)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const { user } = useAuth();

  useEffect(() => {
    // Load theme from localStorage or default to system
    const storedTheme = localStorage.getItem("theme") as ThemeType;
    
    if (storedTheme) {
      setThemeState(storedTheme);
    }
  }, []);

  useEffect(() => {
    // Load theme preference from Supabase if user is logged in
    const loadUserThemePreference = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('theme')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error loading theme preference:", error);
      } else if (data?.theme) {
        setThemeState(data.theme as ThemeType);
      }
    };
    
    loadUserThemePreference();
  }, [user]);

  // Update the theme in both localStorage and Supabase
  const setTheme = async (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    
    // If user is logged in, update their preference in Supabase
    if (user) {
      const { error } = await supabase
        .from('user_settings')
        .update({ theme: newTheme, updated_at: new Date().toISOString() })
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error saving theme preference:", error);
      }
    }
  };

  // Effect to resolve the actual theme (light or dark) based on preference
  useEffect(() => {
    const updateResolvedTheme = () => {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        setResolvedTheme(systemTheme);
      } else {
        setResolvedTheme(theme as "light" | "dark");
      }
    };
    
    updateResolvedTheme();
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        updateResolvedTheme();
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // Apply the theme to the document
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolvedTheme);
  }, [resolvedTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
