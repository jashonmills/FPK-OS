import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, PenSquare, Lightbulb, Heart } from 'lucide-react';

const features = [
  {
    icon: Users,
    title: 'Connect in Private Circles',
    description: 'Join topic-based conversations with people who get it. From "Parenting Toddlers" to "Celebrating Wins" and "Ask the Professionals," find your niche and share freely.',
  },
  {
    icon: PenSquare,
    title: 'Share Your Journey',
    description: 'Create posts, share photos and videos, and celebrate your progress in a supportive environment. Our platform is a judgment-free zone where your story matters.',
  },
  {
    icon: Lightbulb,
    title: 'Find & Provide Resources',
    description: 'Discover trusted resources shared by professionals and experienced community members. Have something valuable to offer? Become a resource for others and build your authority.',
  },
  {
    icon: Heart,
    title: 'Have Fun & Build Friendships',
    description: "This isn't just a resource hub—it's a community. Engage in daily reflections, join live chats, and build genuine friendships with people on a similar path.",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
          A Space to Connect, Learn, and Grow.
        </h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index} 
                className="animate-fade-in hover-scale transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader>
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
