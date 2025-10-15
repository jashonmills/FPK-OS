import { SEOHead } from '@/components/seo/SEOHead';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heart, Users, Target, Shield, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();

  const values = [
    {
      icon: Heart,
      title: 'Family-Centered',
      description: 'We put families at the center of everything we do, empowering parents and caregivers to be active participants in their child\'s journey.',
    },
    {
      icon: BookOpen,
      title: 'Evidence-Based',
      description: 'All our content and recommendations are grounded in peer-reviewed research and clinical best practices.',
    },
    {
      icon: Shield,
      title: 'Privacy-First',
      description: 'HIPAA-compliant data protection ensures your family\'s sensitive information remains secure and private.',
    },
    {
      icon: Users,
      title: 'Collaborative',
      description: 'We facilitate seamless communication between parents, therapists, educators, and medical professionals.',
    },
  ];

  const team = [
    {
      role: 'Clinical Advisory Board',
      description: 'Board-certified behavior analysts (BCBA-D), licensed psychologists, and special education experts',
    },
    {
      role: 'Technology Team',
      description: 'Experienced developers dedicated to creating accessible, user-friendly tools',
    },
    {
      role: 'Content Contributors',
      description: 'Licensed therapists, educators, and neurodiversity advocates',
    },
  ];

  return (
    <>
      <SEOHead
        title="About FPX CNS-App - Supporting Neurodivergent Families"
        description="Learn about FPX CNS-App's mission to empower families, educators, and therapists with evidence-based tools for supporting neurodivergent children."
        keywords={['about us', 'neurodiversity support', 'special education platform', 'autism support', 'ADHD tools']}
      />
      <SchemaMarkup
        schema={[
          {
            type: 'BreadcrumbList',
            items: [
              { name: 'Home', url: '/' },
              { name: 'About', url: '/about' },
            ],
          },
          {
            type: 'Organization',
            name: 'FPX CNS-App',
            url: window.location.origin,
            description: 'A comprehensive platform for tracking and supporting neurodivergent children\'s progress across home, school, and therapy settings.',
          },
        ]}
      />

      <div className="min-h-screen bg-gradient-subtle">
        {/* Hero Section */}
        <section className="relative py-20 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <Badge className="mb-4 text-sm">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Empowering Families Through Better Data
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              FPX CNS-App was created by parents and professionals who understand the challenges of coordinating 
              care for neurodivergent children. We're here to make progress tracking clearer, communication easier, 
              and advocacy more effective.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-8 h-8 text-primary" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-lg text-muted-foreground">
                <p>
                  To provide families, educators, and therapists with a unified platform that transforms scattered 
                  notes and observations into actionable insights, fostering better outcomes for neurodivergent children.
                </p>
                <p>
                  We believe that when everyone involved in a child's care can access the same data and collaborate 
                  effectively, children receive more consistent support and make faster progress toward their goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 px-4 bg-card/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Our Core Values</h2>
              <p className="text-xl text-muted-foreground">
                The principles that guide everything we build
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="transition-all hover:shadow-elegant">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <value.icon className="w-6 h-6 text-primary" />
                      <CardTitle>{value.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Who We Are</h2>
              <p className="text-xl text-muted-foreground">
                A multidisciplinary team dedicated to neurodiversity support
              </p>
            </div>

            <div className="space-y-6">
              {team.map((group, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-xl">{group.role}</CardTitle>
                    <CardDescription className="text-base">
                      {group.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button
                size="lg"
                onClick={() => navigate('/authors')}
                className="gap-2"
              >
                <Users className="w-5 h-5" />
                Meet Our Expert Contributors
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Credentials & Transparency Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Sparkles className="w-12 h-12 mx-auto text-primary mb-4" />
              <h2 className="text-3xl font-bold text-primary mb-4">
                Evidence-Based & Trustworthy
              </h2>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Clinical Review Process</h3>
                  <p className="text-muted-foreground">
                    All clinical content is reviewed by licensed professionals with credentials in their respective fields 
                    (BCBA-D, Ph.D., M.D., or equivalent). We cite peer-reviewed research and evidence-based practices.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-2">Data Security & Compliance</h3>
                  <p className="text-muted-foreground">
                    We maintain HIPAA compliance with encrypted data storage, secure authentication, and role-based 
                    access controls. Your family's data is never sold or shared with third parties.
                  </p>
                </div>

                <Separator />

                <div>
                  <h3 className="text-xl font-semibold mb-2">Ongoing Education</h3>
                  <p className="text-muted-foreground">
                    Our team stays current with the latest research in autism, ADHD, behavioral analysis, and 
                    special education law. We regularly update our content to reflect new evidence and best practices.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join families and professionals using FPX CNS-App to track progress and improve outcomes
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button size="lg" onClick={() => navigate('/auth')}>
                Create Free Account
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/guides')}>
                Browse Resource Guides
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
