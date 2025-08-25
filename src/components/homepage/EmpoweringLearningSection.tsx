import React from 'react';

const EmpoweringLearningSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-white/35">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center">
            The Empowering Learning Foundation
          </h2>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl text-slate-700 mb-6 leading-relaxed">
              The foundation of our platform is the <strong>Empowering Learning</strong> model, created by Olive Hickmott, a forensic learning coach with decades of experience.
            </p>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              Neuroscience shows that fluent reading, spelling, and handwriting depend on building a <strong>Word Form Area (WFA)</strong> in the brain, near the occipital lobe where visual images are stored.
            </p>
            
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              FPK University helps children grow their WFA by connecting visual memory to words, making learning natural, memorable, and enjoyable.
            </p>
            
            <p className="text-lg text-slate-600 leading-relaxed">
              This approach has already helped <strong>thousands of children</strong> unlock their creativity, boost self-esteem, and rediscover the joy of learning.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmpoweringLearningSection;