import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Contact = () => {
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
          
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Contact Us</h1>
          <p className="text-xl text-slate-600 mb-8">
            Get in touch with the FPK University team. We're here to help with any questions about our platform or the Empowering Learning approach.
          </p>
          
          <div className="space-y-4">
            <div className="p-4 bg-white/50 rounded-lg border border-white/30">
              <h3 className="font-semibold text-slate-800">General Inquiries</h3>
              <p className="text-slate-600">info@fpkuniversity.com</p>
            </div>
            <div className="p-4 bg-white/50 rounded-lg border border-white/30">
              <h3 className="font-semibold text-slate-800">Learning Support</h3>
              <p className="text-slate-600">support@fpkuniversity.com</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button asChild className="bg-fpk-orange hover:bg-fpk-orange/90 text-white">
              <Link to="/dashboard/learner">Visit Learning Portal</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;