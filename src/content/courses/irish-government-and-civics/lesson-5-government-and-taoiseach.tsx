import React from 'react';

export const Lesson5GovernmentAndTaoiseach: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Define the Government as the executive branch of the State.</li>
          <li>Identify the Taoiseach as the Head of Government (Prime Minister).</li>
          <li>Understand how a government is formed, usually through a coalition of parties.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          The Government is the cabinet of ministers that runs the country day-to-day. It is led by the Taoiseach, who is the most powerful political figure in Ireland. After a general election, the Taoiseach is nominated by the Dáil and appointed by the President. Because of Ireland's PR-STV voting system, it is rare for one party to win an outright majority, so most governments are coalitions, where two or more parties agree to govern together.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            If Party A wins 40% of the seats and Party B wins 15%, they might agree to form a coalition government to get over the 50% mark needed to command a majority in the Dáil. The leader of the larger party (Party A) would typically become Taoiseach.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: Who is the Head of Government in Ireland?</p>
          <ul className="space-y-2">
            <li>• The President</li>
            <li className="text-green-600 font-semibold">✓ The Taoiseach</li>
            <li>• The Ceann Comhairle</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
