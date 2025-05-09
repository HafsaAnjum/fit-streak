
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface UserSettings {
  theme: "light" | "dark" | "system";
  notifications_enabled: boolean;
  public_profile: boolean;
}

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    fetchUserSettings();
  }, [user]);

  const fetchUserSettings = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (data) {
        setSettings({
          theme: data.theme || "system",
          notifications_enabled: data.notifications_enabled,
          public_profile: data.public_profile,
        });
      }
    } catch (error) {
      console.error("Error fetching user settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    try {
      if (!user) return;
      
      const { error } = await supabase
        .from('user_settings')
        .update({
          ...newSettings,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) throw error;

      setSettings(prev => prev ? { ...prev, ...newSettings } : null);
      toast.success("Settings updated successfully");
      
      return true;
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
      return false;
    }
  };

  return {
    settings,
    loading,
    updateSettings,
    refreshSettings: fetchUserSettings,
  };
}
