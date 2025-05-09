
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useOnboardingRedirect = () => {
  const { user, setIsNewUser } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkUserOnboarding = async () => {
      if (!user) {
        setIsChecking(false);
        return;
      }
      
      try {
        // Check if the user has completed onboarding
        const { data, error } = await supabase
          .from('profiles')
          .select('username, fitness_level')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking onboarding status:', error);
          setIsChecking(false);
          return;
        }
        
        // If user has missing profile fields, redirect to onboarding
        const needsOnboarding = !data.username || !data.fitness_level;
        
        if (needsOnboarding) {
          setIsNewUser(true);
          navigate('/onboarding');
        } else {
          // If user has completed onboarding, redirect to home
          navigate('/home');
        }
      } catch (error) {
        console.error('Error in onboarding check:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    if (user) {
      checkUserOnboarding();
    } else {
      setIsChecking(false);
    }
  }, [user, navigate, setIsNewUser]);

  return { isChecking };
};
