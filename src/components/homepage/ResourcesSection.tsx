import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ResourcesSection = () => {
  return (
    <section className="py-20 px-6 w-full">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-fpk-orange/10 rounded-2xl flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-fpk-orange" />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Educational Resources
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                Explore our comprehensive library of articles, guides, and expert insights on neurodiversity, 
                IEP advocacy, study strategies, and empowering learning approaches. Stay informed with the 
                latest research and practical tips for students, parents, and educators.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  asChild 
                  className="bg-fpk-orange hover:bg-fpk-orange/90 text-white group"
                >
                  <Link to="/resources" className="flex items-center gap-2">
                    Browse Resources
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="border-fpk-orange text-fpk-orange hover:bg-fpk-orange/10"
                >
                  <Link to="/blog/contributors" className="flex items-center gap-2">
                    Meet Our Experts
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
