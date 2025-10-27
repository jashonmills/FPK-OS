import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
      {/* Animated Background with Shapes */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Decorative Floating Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10 animate-fade-in">
        {/* Main Headline with Creative Layout */}
        <div className="space-y-2">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            <span className="inline-block animate-fade-in">Find Your</span>{' '}
            <span className="inline-block text-primary bg-clip-text animate-fade-in" style={{ animationDelay: '0.1s' }}>
              People
            </span>
            <span className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl mx-3">✨</span>
          </h1>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-tight">
            <span className="inline-block animate-fade-in" style={{ animationDelay: '0.2s' }}>Find Your</span>{' '}
            <span className="inline-block text-accent bg-clip-text animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Place
            </span>
            <span className="inline-block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">.</span>
          </h1>
        </div>
        
        {/* Subheadline with Better Spacing */}
        <div className="max-w-3xl mx-auto space-y-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <p className="text-xl sm:text-2xl md:text-3xl text-foreground font-semibold leading-relaxed">
            Welcome to <span className="text-primary font-bold">FPK Nexus</span>
          </p>
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-medium leading-relaxed">
            The private social network built for the neurodiverse community and the people who support it.
          </p>
        </div>
        
        {/* Value Prop with Visual Separation */}
        <div className="max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg border border-primary/20">
            <p className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed">
              <span className="font-semibold text-primary">A safe harbor</span> to connect, share, and thrive. 
              A dedicated space for neurodiverse individuals, parents, educators, and professionals to build 
              <span className="font-semibold"> meaningful connections</span>, find 
              <span className="font-semibold"> trusted resources</span>, and celebrate every milestone—
              <span className="italic">free from the noise and judgment of mainstream social media.</span>
            </p>
          </div>
        </div>
        
        {/* CTA Buttons with Enhanced Styling */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <Button 
            size="lg" 
            className="w-full sm:w-auto text-lg px-10 py-7 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/auth?tab=signup')}
          >
            Join Our Community for Free
          </Button>
          
          <Button 
            variant="outline" 
            size="lg"
            className="w-full sm:w-auto text-lg px-10 py-7 hover:scale-105 transition-all duration-300"
            onClick={() => navigate('/auth?tab=signin')}
          >
            Already a member? Sign In
          </Button>
        </div>
      </div>
    </section>
  );
};
