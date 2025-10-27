import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10 animate-fade-in" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          Find Your People.{' '}
          <span className="text-primary">Find Your Place.</span>
        </h1>
        
        <h2 className="text-xl sm:text-2xl md:text-3xl text-muted-foreground font-medium max-w-3xl mx-auto">
          Welcome to FPK Nexus, the private social network built for the neurodiverse community and the people who support it.
        </h2>
        
        <p className="text-base sm:text-lg md:text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
          A safe harbor to connect, share, and thrive. FPK Nexus is a dedicated space for neurodiverse individuals, parents, educators, and professionals to build meaningful connections, find trusted resources, and celebrate every milestone—free from the noise and judgment of mainstream social media.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-lg px-8 py-6"
            onClick={() => navigate('/auth?tab=signup')}
          >
            Join Our Community for Free
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto text-lg px-8 py-6"
            onClick={() => navigate('/auth?tab=signin')}
          >
            Already a member? Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};
