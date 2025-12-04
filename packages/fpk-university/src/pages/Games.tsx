import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Games = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fpk-purple via-fpk-secondary to-fpk-amber p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.15)] border border-white/35">
          <Button asChild variant="ghost" className="mb-6">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft size={20} />
              Back to Home
            </Link>
          </Button>
          
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Educational Games</h1>
          <p className="text-xl text-slate-600 mb-8">
            Interactive learning games are coming soon! Our educational games will make practice fun and keep students engaged.
          </p>
          
          <div className="text-center">
            <Button asChild className="bg-fpk-orange hover:bg-fpk-orange/90 text-white">
              <Link to="/dashboard/learner">Explore Learning Portal</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games;