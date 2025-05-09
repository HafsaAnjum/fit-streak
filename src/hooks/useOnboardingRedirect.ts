
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useOnboardingRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkUserOnboarding = async () => {
      if (!user) return;
      
      setIsChecking(true);
      try {
        // Check if the user has completed onboarding
        const { data, error } = await supabase
          .from('profiles')
          .select('username, fitness_level')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking onboarding status:', error);
          return;
        }
        
        // If user has missing profile fields, redirect to onboarding
        const needsOnboarding = !data.username || !data.fitness_level;
        
        if (needsOnboarding) {
          navigate('/onboarding');
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    if (user) {
      checkUserOnboarding();
    }
  }, [user, navigate]);

  return { isChecking };
};
