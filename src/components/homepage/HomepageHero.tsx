import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HomepageHero = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-black/10" />
      
      <div className="w-full px-6 text-center">
        {/* Main Hero Content */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20 mb-8 max-w-6xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            FPK University
          </h1>
          <p className="text-xl md:text-2xl text-slate-800 mb-8 max-w-4xl mx-auto leading-relaxed">
            Unlocking Creativity, Confidence, and Visual Learning for Neurodiverse Students
          </p>
          <p className="text-lg text-slate-700 mb-10 max-w-3xl mx-auto">
            Learning doesn't have to be frustrating. At FPK University, we believe every learner deserves tools that match their strengths. Our platform combines cutting-edge neuroscience, interactive games, and empowering strategies to transform education into an exciting journey.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Link to="/dashboard/learner">Enter Learning Portal</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-600 text-purple-600 bg-white/20 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              <Link to="/courses">View Courses</Link>
            </Button>
            <Button 
              asChild 
              variant="secondary" 
              size="lg"
              className="bg-white/20 text-slate-800 border border-slate-300 hover:bg-white/40 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageHero;