
import { useState, useEffect } from 'react';

interface UserProfile {
  display_name?: string;
  avatar_url?: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate profile fetch
    setTimeout(() => {
      setProfile({
        display_name: 'John Doe',
        avatar_url: ''
      });
      setLoading(false);
    }, 500);
  }, []);

  return { profile, loading };
};
