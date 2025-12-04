import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Users, GraduationCap, Stethoscope } from 'lucide-react';

const audiences = [
  {
    value: 'neurodiverse',
    label: 'Neurodiverse Individuals',
    icon: Sparkles,
    headline: 'Your Space to Be Yourself',
    description: 'Connect with peers who share your experience in a space that celebrates you for who you are. Share your interests, find support, and build lasting friendships.',
  },
  {
    value: 'parents',
    label: 'Parents & Caregivers',
    icon: Users,
    headline: 'You Are Not Alone',
    description: 'Ask questions, share advice, and find solidarity with other parents and caregivers who understand the daily challenges and triumphs.',
  },
  {
    value: 'educators',
    label: 'Educators',
    icon: GraduationCap,
    headline: 'Better Together',
    description: 'Collaborate with peers, discover new teaching strategies, and find resources specifically designed for supporting neurodiverse students in the classroom.',
  },
  {
    value: 'professionals',
    label: 'Therapists & Professionals',
    icon: Stethoscope,
    headline: 'Share Your Expertise',
    description: 'Provide valuable resources to a targeted audience, and connect with a community actively seeking your guidance and support.',
  },
];

export const AudienceSection = () => {
  return (
    <section className="py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Built for Every Part of the Journey.
        </h2>
        
        <Tabs defaultValue="neurodiverse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto">
            {audiences.map((audience) => (
              <TabsTrigger 
                key={audience.value} 
                value={audience.value}
                className="text-xs sm:text-sm py-3"
              >
                {audience.label}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {audiences.map((audience) => {
            const Icon = audience.icon;
            return (
              <TabsContent 
                key={audience.value} 
                value={audience.value}
                className="mt-8"
              >
                <Card className="animate-fade-in">
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Icon className="w-16 h-16 text-primary" />
                      <h3 className="text-2xl font-bold">{audience.headline}</h3>
                      <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                        {audience.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
};
