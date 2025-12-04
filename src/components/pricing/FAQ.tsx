import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export const FAQ = () => {
  const faqs = [
    {
      question: 'What are "On-Demand" or "À La Carte" tools?',
      answer: 'These are powerful, specialized AI services that you can purchase individually without needing to change your monthly subscription. For example, if you\'re on the Collaborative Team plan and only need one AI-generated goal, you can buy it as a one-time add-on for $4.99.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes, you can upgrade, downgrade, or cancel at any time from your settings. Changes to your plan take effect immediately, and we\'ll prorate any charges if you upgrade mid-cycle.',
    },
    {
      question: 'What happens at the end of my free trial?',
      answer: 'You\'ll be asked to add a payment method to continue using the paid features. You can also downgrade to the free Family plan at any time, and all your data will be preserved.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use bank-grade encryption and strict data isolation to ensure your family\'s data is private and secure. Your information is never shared with third parties without your explicit consent.',
    },
    {
      question: 'What counts as a "user"?',
      answer: 'Anyone you invite to your family hub counts as a user, including parents, therapists, educators, and family members. Each user can have different roles and permissions based on your family\'s needs.',
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, there are no long-term commitments. You can cancel your subscription at any time from your settings page. You\'ll retain access to paid features until the end of your billing period.',
    },
    {
      question: 'Do you offer discounts for schools or organizations?',
      answer: 'Yes! We offer special pricing for schools, therapy centers, and non-profit organizations. Contact our team to discuss your specific needs and get a custom quote.',
    },
  ];

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="glass-card border px-6">
              <AccordionTrigger className="text-left font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
