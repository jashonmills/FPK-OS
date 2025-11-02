import React from 'react';

export const Lesson4SeanadEireann: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify Seanad Éireann as the upper house of the Oireachtas.</li>
          <li>Understand that the Seanad's primary role is to review and amend legislation from the Dáil.</li>
          <li>Learn how its members (Senators) are chosen, not directly elected by the public.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          Seanad Éireann, or the Senate, is the upper house. It has less power than the Dáil. Its main function is to review, debate, and suggest amendments to laws passed by the Dáil. It can delay a bill, but it cannot block it indefinitely. Most of its 60 members are not directly elected by the public. They are chosen by specific vocational panels (e.g., culture, agriculture, industry), university graduates, and by the Taoiseach.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            If the Dáil passes a controversial bill quickly, the Seanad can act as a 'cooling off' chamber, providing more time for debate and public discussion. It can propose amendments which the Dáil can then choose to accept or reject.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: Can the Seanad permanently block a law passed by the Dáil?</p>
          <ul className="space-y-2">
            <li>• Yes</li>
            <li className="text-green-600 font-semibold">✓ No, it can only delay it</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
