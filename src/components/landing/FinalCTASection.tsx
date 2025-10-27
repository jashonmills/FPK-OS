import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const FinalCTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent" />
      
      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
          Your Community is Waiting.
        </h2>
        
        <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
          Ready to find your safe harbor? Joining is free, simple, and the first step towards connecting with a community that truly understands.
        </p>
        
        <div className="pt-4">
          <Button 
            size="lg"
            variant="secondary"
            className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-shadow"
            onClick={() => navigate('/auth?tab=signup')}
          >
            Create Your Free Account Today
          </Button>
        </div>
      </div>
    </section>
  );
};
