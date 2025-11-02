import React from 'react';

export const Lesson2Federalism: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Define federalism as the division of power between the national and state governments.</li>
          <li>Differentiate between federal, state, and local governments.</li>
          <li>Provide an example of a power held by the federal government and one held by state governments.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          Federalism is a core principle of the U.S. system. It means that power is shared between the national (federal) government in Washington, D.C., and the individual state governments. The Constitution grants certain powers to the federal government (like declaring war and printing money), while reserving other powers for the states (like running schools and issuing driver's licenses). This creates a balance of power.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            The federal government is responsible for the U.S. Postal Service. Your state government is responsible for maintaining state highways. Your local city or county government is responsible for services like trash collection and local parks.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: Which of the following is a power reserved for state governments?</p>
          <ul className="space-y-2">
            <li>• Declaring war</li>
            <li>• Printing money</li>
            <li className="text-green-600 font-semibold">✓ Running public schools</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
