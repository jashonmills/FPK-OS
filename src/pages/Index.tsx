import React from 'react';
import HomepageNavigation from '@/components/homepage/HomepageNavigation';
import HomepageHero from '@/components/homepage/HomepageHero';
import IntroSection from '@/components/homepage/IntroSection';
import OfferingsSection from '@/components/homepage/OfferingsSection';
import WhyChooseSection from '@/components/homepage/WhyChooseSection';
import EmpoweringLearningSection from '@/components/homepage/EmpoweringLearningSection';
import CTASection from '@/components/homepage/CTASection';
import HomepageFooter from '@/components/homepage/HomepageFooter';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HomepageNavigation />
      <HomepageHero />
      <div className="bg-gradient-to-br from-fpk-purple via-fpk-secondary to-fpk-amber">
        <IntroSection />
        <OfferingsSection />
        <WhyChooseSection />
        <EmpoweringLearningSection />
        <CTASection />
        <HomepageFooter />
      </div>
    </div>
  );
};

export default Index;