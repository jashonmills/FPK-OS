import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HomepageNavigation from '@/components/homepage/HomepageNavigation';
import HomepageHero from '@/components/homepage/HomepageHero';
import IntroSection from '@/components/homepage/IntroSection';
import OfferingsSection from '@/components/homepage/OfferingsSection';
import WhyChooseSection from '@/components/homepage/WhyChooseSection';
import EmpoweringLearningSection from '@/components/homepage/EmpoweringLearningSection';
import CTASection from '@/components/homepage/CTASection';
import HomepageFooter from '@/components/homepage/HomepageFooter';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Check for 'next' redirect parameter from student auth
  useEffect(() => {
    if (!loading && user) {
      const params = new URLSearchParams(window.location.search);
      const nextUrl = params.get('next');
      
      if (nextUrl) {
        console.log('Index: Found next parameter, redirecting to:', nextUrl);
        // Remove the parameter and redirect
        window.history.replaceState({}, '', '/');
        window.location.href = decodeURIComponent(nextUrl);
      }
    }
  }, [user, loading, navigate]);

  return (
    <div 
      className="min-h-screen w-full"
      style={{
        backgroundImage: 'url(https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/home-page-background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        margin: 0,
        padding: 0
      }}
    >
      <HomepageNavigation />
      <HomepageHero />
      <IntroSection />
      <OfferingsSection />
      <WhyChooseSection />
      <EmpoweringLearningSection />
      <CTASection />
      <HomepageFooter />
    </div>
  );
};

export default Index;