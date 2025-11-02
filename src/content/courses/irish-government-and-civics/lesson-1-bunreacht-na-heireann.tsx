import React from 'react';

export const Lesson1BunreachtNaHEireann: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand that the Constitution is the fundamental law of the Irish State.</li>
          <li>Learn that it was enacted by a vote of the people in 1937.</li>
          <li>Identify the key principles, including national sovereignty and fundamental rights.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          Bunreacht na hÉireann is the constitution of Ireland. It is the supreme law of the land, and all other laws must comply with it. It can only be changed by a referendum, which is a direct vote of the people. The Constitution establishes the organs of government (the President, the Oireachtas, the Courts) and guarantees certain fundamental rights to citizens, such as equality before the law, freedom of expression, and freedom of religion.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg italic">
            Article 40.3.1° states: 'The State guarantees in its laws to respect, and, as far as practicable, by its laws to defend and vindicate the personal rights of the citizen.' This is the basis for many rights that have been established by the courts over the years.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-secondary/5 p-6 rounded-lg">
            <p className="font-semibold mb-3">Question 1: What is the name for the Constitution of Ireland?</p>
            <ul className="space-y-2">
              <li>• The Act of Union</li>
              <li>• The Proclamation of the Republic</li>
              <li className="text-green-600 font-semibold">✓ Bunreacht na hÉireann</li>
            </ul>
          </div>
          
          <div className="bg-secondary/5 p-6 rounded-lg">
            <p className="font-semibold mb-3">Question 2: How can the Irish Constitution be changed?</p>
            <ul className="space-y-2">
              <li>• By a vote in the Dáil</li>
              <li>• By a decision of the President</li>
              <li className="text-green-600 font-semibold">✓ By a referendum of the people</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
