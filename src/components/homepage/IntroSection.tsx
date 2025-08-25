import React from 'react';

const IntroSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center">
            What is FPK University?
          </h2>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl text-slate-800 mb-6 leading-relaxed">
              FPK University is a next-generation digital learning platform designed especially for <strong>neurodiverse learners</strong> and their families.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Built on the proven <strong>Empowering Learning</strong> program developed by Olive Hickmott, we teach students how to use their natural visual memory to thrive.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              For more than 25 years, Empowering Learning has helped students with Dyslexia, Dyscalculia, ADHD, Dyspraxia, and other challenges discover how capable they truly are.
            </p>
            
            <p className="text-lg text-slate-700 leading-relaxed">
              At FPK University, we've brought this powerful approach online, combining science, creativity, and play into a learning experience unlike anything else.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;