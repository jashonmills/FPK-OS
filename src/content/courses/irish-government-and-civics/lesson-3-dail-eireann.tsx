import React from 'react';

export const Lesson3DailEireann: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify Dáil Éireann as the principal house of the Oireachtas (Irish Parliament).</li>
          <li>Understand the role of a Teachta Dála (TD).</li>
          <li>Learn about Ireland's system of proportional representation (PR-STV).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          Dáil Éireann is the main decision-making body in Ireland. It is where new laws are debated and passed, and where the government is formed. Its members are called Teachtaí Dála (TDs), and they are directly elected by the people at least every five years. Ireland uses a voting system called Proportional Representation by means of the Single Transferable Vote (PR-STV). This system is designed to ensure that the number of seats a party gets in the Dáil is roughly proportional to the number of votes it receives nationwide.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            In the PR-STV system, you don't just vote for one candidate. You rank the candidates in order of preference (1, 2, 3...). This allows your vote to transfer to your second or third choice if your first choice is eliminated or has a surplus of votes, making your vote more powerful.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: What is a member of Dáil Éireann called?</p>
          <ul className="space-y-2">
            <li>• A Senator</li>
            <li>• A Councillor</li>
            <li className="text-green-600 font-semibold">✓ A Teachta Dála (TD)</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
