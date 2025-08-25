import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const CTASection = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center">
              <Sparkles size={32} className="text-white" />
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ready to begin the journey?
          </h2>
          
          <p className="text-xl text-slate-700 mb-10 leading-relaxed">
            Join FPK University today and experience learning that empowers every child.
          </p>
          
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
              <Link to="/login">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;