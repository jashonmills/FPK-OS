import React from 'react';

export const Lesson1USConstitutionBillOfRights: React.FC = () => {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 1: Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand that the Constitution is the supreme law of the United States.</li>
          <li>Identify the three branches of government established by the Constitution.</li>
          <li>Define the purpose of the Bill of Rights.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 2: Concept</h2>
        <p className="text-lg leading-relaxed">
          The U.S. Constitution is the blueprint for the American government. Ratified in 1788, it establishes a federal system with three distinct branches to ensure a separation of powers: the Legislative (Congress), the Executive (the President), and the Judicial (the Supreme Court). To protect individual liberties from the power of the government, the first ten amendments, known as the Bill of Rights, were added in 1791.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 3: Example</h2>
        <div className="bg-accent/10 p-6 rounded-lg border-l-4 border-accent">
          <p className="text-lg">
            The First Amendment in the Bill of Rights guarantees several key freedoms, including freedom of speech, freedom of the press, and freedom of religion. These rights are considered fundamental to American democracy.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4 text-primary">Screen 4: Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-secondary/5 p-6 rounded-lg">
            <p className="font-semibold mb-3">Question 1: What is the name for the first ten amendments to the Constitution?</p>
            <ul className="space-y-2">
              <li>• The Preamble</li>
              <li>• The Articles of Confederation</li>
              <li className="text-green-600 font-semibold">✓ The Bill of Rights</li>
            </ul>
          </div>
          
          <div className="bg-secondary/5 p-6 rounded-lg">
            <p className="font-semibold mb-3">Question 2: Which of these is NOT one of the three branches of the U.S. government?</p>
            <ul className="space-y-2">
              <li>• Legislative</li>
              <li>• Executive</li>
              <li className="text-green-600 font-semibold">✓ The Military</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};
