import React from 'react';
import oliveImage from '@/assets/olive-hickmott.png';
const EmpoweringLearningSection = () => {
  return <section className="py-20 px-6 w-full">
      <div className="w-full max-w-none mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <img src="https://zgcegkmqfgznbpdplscz.supabase.co/storage/v1/object/public/home-page/olive.png" alt="Olive Hickmott, creator of Empowering Learning" className="w-32 h-32 md:w-40 md:h-40 object-contain flex-shrink-0" />
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 text-center md:text-left">The Foundation of Empowering Learning. </h2>
          </div>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl text-slate-800 mb-6 leading-relaxed">
              The foundation of our platform is the <strong>Empowering Learning</strong> model, created by Olive Hickmott, a forensic learning coach with decades of experience.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Neuroscience shows that fluent reading, spelling, and handwriting depend on building a <strong>Word Form Area (WFA)</strong> in the brain, near the occipital lobe where visual images are stored.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              FPK University helps children grow their WFA by connecting visual memory to words, making learning natural, memorable, and enjoyable.
            </p>
            
            <p className="text-lg text-slate-700 mb-8 leading-relaxed">
              This approach has already helped <strong>thousands of children</strong> unlock their creativity, boost self-esteem, and rediscover the joy of learning.
            </p>
            
            <div className="text-center">
              <a href="https://empowering-learning.fpkadapt.com/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-fpk-orange hover:bg-fpk-orange/90 text-white font-semibold rounded-lg transition-colors duration-200">
                Learn More About Empowering Learning
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default EmpoweringLearningSection;