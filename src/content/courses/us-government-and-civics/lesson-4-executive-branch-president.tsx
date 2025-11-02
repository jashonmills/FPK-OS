import React from 'react';

export const Lesson4ExecutiveBranchPresident: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the President as the head of the executive branch.</li>
          <li>Understand the President's roles, including Commander-in-Chief and chief diplomat.</li>
          <li>Learn about the Electoral College system used to elect the President.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          The executive branch is responsible for implementing and enforcing the laws written by Congress. The President of the United States is the head of this branch. The President's powers are extensive and include being the Commander-in-Chief of the armed forces, appointing federal judges and cabinet members, and conducting foreign policy. The President is not elected by a direct popular vote, but by the Electoral College, a system where each state is assigned a number of electors.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            When the President signs a treaty with another country, that is an example of their role as chief diplomat. When the President sends troops into a conflict, they are acting as Commander-in-Chief.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: The President is the head of which branch of government?</p>
          <ul className="space-y-2">
            <li>• Legislative</li>
            <li className="text-green-600 font-semibold">✓ Executive</li>
            <li>• Judicial</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
