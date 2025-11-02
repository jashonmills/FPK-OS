import React from 'react';

export const Lesson1Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand the goals of the United Irishmen in the 1798 Rebellion.</li>
          <li>Define the Act of Union of 1801.</li>
          <li>Analyze why the rebellion failed and led directly to the Act of Union.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The United Irishmen and the 1798 Rebellion</h2>
        <p className="mb-4">
          Inspired by the American and French Revolutions, the Society of United Irishmen, led by figures like Wolfe Tone, sought to overthrow British rule and create an independent Irish republic for Catholics, Protestants, and Dissenters alike.
        </p>
        <p className="mb-4">
          The 1798 Rebellion was widespread but poorly coordinated and brutally suppressed. In response, the British government, fearing further rebellion and French invasion, passed the Act of Union. This act abolished the independent Irish Parliament in Dublin and formally made Ireland part of the United Kingdom of Great Britain and Ireland.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Impact of the Act of Union</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            <strong>Before 1801:</strong> Ireland had its own parliament that governed domestic affairs, though it was still under the British Crown.
          </p>
          <p className="mt-3">
            <strong>After the Act of Union:</strong> All major decisions about Ireland were made in the British Parliament in London, where Irish representatives were a small minority.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question 1: What was the primary goal of the United Irishmen's 1798 Rebellion?</p>
            <ul className="space-y-2">
              <li>• To achieve Catholic Emancipation</li>
              <li>• <strong>To establish an independent Irish republic ✓</strong></li>
              <li>• To lower taxes</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question 2: What did the Act of Union of 1801 do?</p>
            <ul className="space-y-2">
              <li>• Gave Catholics the right to vote</li>
              <li>• <strong>Abolished the Irish Parliament ✓</strong></li>
              <li>• Started the Great Famine</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson1Content;
