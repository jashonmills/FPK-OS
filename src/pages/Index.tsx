import React from 'react';
import HomepageNavigation from '@/components/homepage/HomepageNavigation';
import HomepageHero from '@/components/homepage/HomepageHero';
import ResourcesSection from '@/components/homepage/ResourcesSection';
import IntroSection from '@/components/homepage/IntroSection';
import OfferingsSection from '@/components/homepage/OfferingsSection';
import WhyChooseSection from '@/components/homepage/WhyChooseSection';
import EmpoweringLearningSection from '@/components/homepage/EmpoweringLearningSection';
import CTASection from '@/components/homepage/CTASection';
import HomepageFooter from '@/components/homepage/HomepageFooter';

const Index = () => {

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
      <ResourcesSection />
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