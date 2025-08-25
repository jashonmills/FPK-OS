import React from 'react';
import { Check } from 'lucide-react';

const benefits = [
  'Based on 25+ years of research and practice in Empowering Learning',
  'Created specifically for neurodiverse learners',
  'Blends science, creativity, and play into every course',
  'Provides support for both parents and educators',
  'Builds confidence, focus, and a love of learning'
];

const WhyChooseSection = () => {
  return (
    <section className="py-20 px-6 w-full">
      <div className="w-full max-w-none mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center">
            Why Choose FPK University?
          </h2>
          
          <p className="text-xl text-slate-700 mb-12 text-center leading-relaxed">
            Because learning isn't one-size-fits-all. We understand the struggles many children face in traditional systems, and we've built a platform that works with their strengths — not against them.
          </p>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-slate-800 mb-6">
              Here's what makes us different:
            </h3>
            
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-1">
                  <Check size={16} className="text-white" />
                </div>
                <p className="text-lg text-slate-800 leading-relaxed">
                  {benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;