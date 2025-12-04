import React from 'react';
import IntroSection from './IntroSection';
import WhyChooseSection from './WhyChooseSection';

const TwoColumnInfoSection = () => {
  return (
    <section className="py-20 px-6 w-full">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <IntroSection />
          <WhyChooseSection />
        </div>
      </div>
    </section>
  );
};

export default TwoColumnInfoSection;
