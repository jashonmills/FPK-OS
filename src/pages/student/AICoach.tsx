import { AICoachCommandCenter } from '@/components/AICoachCommandCenter';

const AICoach = () => {
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
      <AICoachCommandCenter />
    </div>
  );
};

export default AICoach;
