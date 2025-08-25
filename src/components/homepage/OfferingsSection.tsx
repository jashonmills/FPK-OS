import React from 'react';

const offerings = [
  {
    emoji: '🎓',
    title: 'Courses',
    description: 'Self-paced lessons covering spelling, reading, math, science, and more. Each course is interactive and tailored to different learning styles.'
  },
  {
    emoji: '🎮',
    title: 'Games',
    description: 'Educational games designed to make practice fun and keep students engaged. From escape-room science adventures to math quests, learning feels like play.'
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Parent Resources',
    description: 'Step-by-step guides that help parents understand how their child learns best, with practical tools for support at home.'
  },
  {
    emoji: '🍎',
    title: 'Educator Tools',
    description: 'Classroom-ready strategies, AI-powered supports, and resources that help teachers adapt lessons for diverse learners.'
  }
];

const OfferingsSection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
            Our Core Offerings
          </h2>
          <p className="text-xl text-slate-700 mb-12 text-center max-w-3xl mx-auto">
            At FPK University, education goes beyond worksheets and textbooks. We give learners, parents, and teachers the tools to succeed:
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {offerings.map((offering, index) => (
              <div key={index} className="flex items-start space-x-4 p-6 rounded-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all duration-200 shadow-md">
                <div className="text-4xl mb-2 flex-shrink-0">
                  {offering.emoji}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    {offering.title}
                  </h3>
                  <p className="text-slate-700 leading-relaxed">
                    {offering.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferingsSection;