import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';

const CTASection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { subscription } = useSubscription();

  const handleEnterPortal = () => {
    // Smart routing based on user state
    if (!user) {
      // Not authenticated → go to login
      navigate('/login');
    } else if (!subscription?.subscribed) {
      // Authenticated but no subscription → go to plan selection
      navigate('/choose-plan');
    } else {
      // Authenticated with subscription → go to dashboard
      navigate('/dashboard/learner');
    }
  };

  return (
    <section className="py-20 px-6 w-full">
      <div className="w-full max-w-none mx-auto text-center">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20 max-w-4xl mx-auto">
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
              size="lg" 
              onClick={handleEnterPortal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Enter Learning Portal
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/organization-signup')}
              className="border-2 border-purple-600 text-purple-600 bg-white/20 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              Create Organization
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/join')}
              className="border-2 border-purple-600 text-purple-600 bg-white/20 hover:bg-purple-600 hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-200"
            >
              Join with Invite Code
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;