import React from 'react';

export const Lesson6USCitizenRightsResponsibilities: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the rights guaranteed to citizens in the Bill of Rights.</li>
          <li>Understand the responsibilities of citizenship, such as voting and jury duty.</li>
          <li>Learn how citizens can participate in their democracy.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          Citizenship in a democracy comes with both rights and responsibilities. Rights, such as freedom of speech and the right to a fair trial, are protections from government overreach. Responsibilities are duties that citizens are expected to perform to help the democracy function. These include obeying laws, paying taxes, serving on a jury if called, and, most importantly, being an informed and active voter.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            Voting in local, state, and federal elections is the most direct way to participate. Other ways include contacting your elected officials, volunteering for a campaign, participating in a peaceful protest, or staying informed about current events.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="bg-secondary/5 p-6 rounded-lg">
          <p className="font-semibold mb-3">Question: Which of the following is considered both a right and a responsibility of a U.S. citizen?</p>
          <ul className="space-y-2">
            <li>• Serving in the military</li>
            <li className="text-green-600 font-semibold">✓ Voting in elections</li>
            <li>• Owning property</li>
          </ul>
        </div>
      </section>
    </div>
  );
};
