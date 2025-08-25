import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fpk-purple via-fpk-secondary to-fpk-amber">
      {/* Simple Navigation */}
      <nav className="bg-white/90 backdrop-blur-md p-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-fpk-orange to-fpk-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="text-xl font-bold text-slate-900">FPK University</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/dashboard/learner" className="text-slate-700 hover:text-fpk-orange">Learning Portal</Link>
            <Link to="/courses" className="text-slate-700 hover:text-fpk-orange">Courses</Link>
            <Button asChild className="bg-fpk-orange hover:bg-fpk-orange/90 text-white">
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-[80vh] px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-white/35">
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6">
              FPK University
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-8 max-w-3xl mx-auto">
              Unlocking Creativity, Confidence, and Visual Learning for Neurodiverse Students
            </p>
            <p className="text-lg text-slate-600 mb-10 max-w-3xl mx-auto">
              Learning doesn't have to be frustrating. At FPK University, we believe every learner deserves tools that match their strengths.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-fpk-orange hover:bg-fpk-orange/90 text-white px-8 py-4 text-lg">
                <Link to="/dashboard/learner">Enter Learning Portal</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-fpk-purple text-fpk-purple hover:bg-fpk-purple hover:text-white px-8 py-4 text-lg">
                <Link to="/courses">View Courses</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="p-6 text-center">
        <div className="bg-white/85 backdrop-blur-sm rounded-xl p-6 max-w-2xl mx-auto">
          <p className="text-slate-600">© 2025 FPK University | Empowering Learning by Olive Hickmott</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;