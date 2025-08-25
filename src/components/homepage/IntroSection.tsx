import React from 'react';

const IntroSection = () => {
  return (
    <section className="py-20 px-6 w-full">
      <div className="w-full max-w-none mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center">
            What is FPK University?
          </h2>
          
          <div className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl text-slate-800 mb-6 leading-relaxed">
              FPK University is an innovative learning platform designed to make education <strong>accessible, engaging, and effective</strong> for all students.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              We leverage cutting-edge <strong>AI tools</strong>, personalized learning paths, and advanced assessments to create a fully adaptive educational experience tailored to each student's unique strengths and challenges.
            </p>
            
            <p className="text-lg text-slate-700 mb-6 leading-relaxed">
              Our mission is to ensure every student has access to learning methods that suit them best, making education enjoyable and effective.
            </p>
            
            <p className="text-lg text-slate-700 leading-relaxed">
              Unlike other platforms, FPK University is built to <strong>adapt to the individual</strong>, not the other way around. Our platform is intelligent, flexible, and responsive, adjusting in real-time based on user interactions, learning styles, and cognitive strengths.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;