import React from 'react';
import { LessonProps } from '@/types/lesson';

export const Lesson6CitizenRightsAndResponsibilities: React.FC<LessonProps> = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify your fundamental rights as guaranteed by the Constitution.</li>
          <li>Understand your responsibilities, such as obeying the law and voting.</li>
          <li>Learn how Ireland's membership in the European Union grants you additional rights.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          As an Irish citizen, you have rights protected by the Constitution, such as the right to vote, the right to a fair trial, and freedom of speech. With these rights come responsibilities, including respecting the rights of others, obeying the laws passed by the Oireachtas, and participating in democracy by voting. As Ireland is a member of the European Union, you are also an EU citizen, which gives you additional rights, such as the right to live, work, and study in any other EU country.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            Your right as an EU citizen to 'freedom of movement' means you can move to Spain, Germany, or any other EU country to take a job or attend university without needing a visa, and you must be treated the same as a citizen of that country in terms of employment rights.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: Being a citizen of an EU country like Ireland gives you the right to do what in other EU countries?</p>
          <ul className="space-y-2">
            <li>• Vote in their national elections</li>
            <li className="text-green-600 font-semibold">✓ Live, work, and study</li>
            <li>• Ignore local laws</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
