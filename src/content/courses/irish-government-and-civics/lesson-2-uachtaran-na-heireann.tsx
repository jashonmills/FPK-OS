import React from 'react';
import { LessonProps } from '@/types/lesson';

export const Lesson2UachtaranNaHEireann: React.FC<LessonProps> = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand the role of the President as the Head of State.</li>
          <li>Differentiate the President's role from the Taoiseach's role (Head of Government).</li>
          <li>Identify the key powers of the President, such as referring a bill to the Supreme Court.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          The President of Ireland is the Head of State, representing the people of Ireland on the world stage. This role is largely ceremonial, as the real political power lies with the Taoiseach (Prime Minister). The President is directly elected by the people for a seven-year term and can serve a maximum of two terms. While mainly ceremonial, the President has some important powers, such as signing bills into law or, if they have concerns about a bill's constitutionality, referring it to the Supreme Court for a decision before signing it.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            If the Dáil and Seanad pass a new law, it is sent to the President. The President usually signs it, making it official. However, if the President believes the law might violate the Constitution, they can consult the Council of State and then send the bill to the Supreme Court. This is a crucial check and balance in the Irish system.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: The President of Ireland is the Head of...?</p>
          <ul className="space-y-2">
            <li>• Government</li>
            <li className="text-green-600 font-semibold">✓ State</li>
            <li>• The Army</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
