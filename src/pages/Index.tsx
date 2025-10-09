import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GraduationCap,
  BarChart3,
  Users,
  FileText,
  Brain,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useEffect } from 'react';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: FileText,
      title: 'Educator Logs',
      description: 'Track therapy sessions, classroom observations, and daily progress notes.',
    },
    {
      icon: BarChart3,
      title: 'Progress Metrics',
      description: 'Visualize quantifiable data like reading levels and behavioral improvements.',
    },
    {
      icon: Users,
      title: 'Multi-Student Support',
      description: 'Manage multiple students with role-based family access.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Get personalized recommendations based on your student progress data.',
    },
  ];

  const benefits = [
    'Secure, HIPAA-compliant data storage',
    'Customizable dashboards for each family',
    'Collaborate with therapists and educators',
    'Track progress across autism, ADHD, and more',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative py-20 px-4 overflow-hidden"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div className="max-w-6xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <GraduationCap className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Track Special Education Progress
            <br />
            <span className="text-white/90">With Confidence</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Empower families, therapists, and educators to collaborate on student progress tracking
            for autism, ADHD, and other special needs.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/auth')}
              className="text-lg px-8"
            >
              Get Started Free
              <ArrowRight className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/auth')}
              className="text-lg px-8 bg-white/10 text-white border-white/30 hover:bg-white/20"
            >
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Track Progress
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built specifically for special education families, therapists, and educators
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ background: 'var(--gradient-hero)' }}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4" style={{ background: 'var(--gradient-subtle)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Families Trust Us</h2>
            <p className="text-lg text-muted-foreground">
              Designed with privacy, accessibility, and collaboration in mind
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" onClick={() => navigate('/auth')} className="text-lg px-8">
              Start Tracking Progress Today
              <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-card border-t">
        <div className="max-w-6xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2025 Progress Hub. Built for special education families.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
