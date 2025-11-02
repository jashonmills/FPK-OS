import React from 'react';

export const Lesson5JudicialBranchSupremeCourt: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the judicial branch as the system of federal courts.</li>
          <li>Understand the role of the Supreme Court as the highest court in the nation.</li>
          <li>Define the power of 'judicial review'.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          The judicial branch is responsible for interpreting the laws. It is made up of the Supreme Court and lower federal courts. The Supreme Court is the final judge in all cases involving laws of Congress and the Constitution. Its most important power is 'judicial review'—the ability to declare a law passed by Congress or an action by the President to be unconstitutional, and therefore void.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            In the landmark case Marbury v. Madison (1803), the Supreme Court established the principle of judicial review. In Brown v. Board of Education (1954), the Court used this power to declare that state laws establishing separate public schools for black and white students were unconstitutional.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: What is the power of the Supreme Court to declare a law unconstitutional called?</p>
          <ul className="space-y-2">
            <li>• Veto</li>
            <li className="text-green-600 font-semibold">✓ Judicial Review</li>
            <li>• Federalism</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
