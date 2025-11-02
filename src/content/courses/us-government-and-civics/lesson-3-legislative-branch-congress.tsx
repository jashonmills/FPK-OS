import React from 'react';

export const Lesson3LegislativeBranchCongress: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify Congress as the legislative (law-making) branch.</li>
          <li>Differentiate between the two houses of Congress: the Senate and the House of Representatives.</li>
          <li>Understand the process of how a bill becomes a law.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          Congress is the part of the government that makes laws. It is bicameral, meaning it has two chambers. The House of Representatives has 435 members, with representation based on a state's population. The Senate has 100 members, with two from each state regardless of size. For a bill to become a law, it must be passed by a majority vote in both the House and the Senate and then be signed by the President.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            A bill to fund national parks is introduced in the House. It passes a vote. It then goes to the Senate, which also passes it. It is then sent to the President. If the President signs it, it becomes law. If the President vetoes it, Congress can override the veto with a two-thirds vote in both houses.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: How many Senators does each state have?</p>
          <ul className="space-y-2">
            <li>• It depends on the population</li>
            <li className="text-green-600 font-semibold">✓ Two</li>
            <li>• Four</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
