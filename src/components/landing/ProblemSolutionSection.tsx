import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Heart } from 'lucide-react';

export const ProblemSolutionSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Tired of the Noise? We Built a Better Place.
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* The Problem */}
          <Card className="animate-fade-in hover-scale">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-8 h-8 text-destructive" />
                <CardTitle className="text-2xl">Mainstream Social Media Wasn't Built for Us.</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Overwhelming interfaces, constant judgment, and a lack of genuine understanding can make finding support feel impossible. Your journey is unique, and you deserve a space that respects and celebrates that.
              </p>
            </CardContent>
          </Card>
          
          {/* The Solution */}
          <Card className="animate-fade-in hover-scale">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">A Community Designed for Connection.</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                We designed FPK Nexus from the ground up with the neurodiverse experience in mind. With a calm interface, private topic-based circles, and a culture of mutual support, you can finally connect, learn, and share with confidence.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
