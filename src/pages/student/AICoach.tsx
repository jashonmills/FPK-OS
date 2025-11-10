import { AICoachCommandCenter } from '@/components/AICoachCommandCenter';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const AICoach = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'chat';

  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <AICoachCommandCenter initialTab={initialTab} />
    </div>
  );
};

export default AICoach;
