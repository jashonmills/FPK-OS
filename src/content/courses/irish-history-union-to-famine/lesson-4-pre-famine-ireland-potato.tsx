import React from 'react';

export const Lesson4Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand the structure of pre-famine Irish society.</li>
          <li>Analyze the critical dependence of the rural poor on the potato.</li>
          <li>Recognize the precariousness of the pre-famine economy.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Ireland on the Eve of Catastrophe</h2>
        <p className="mb-4">
          In the 1840s, Ireland's population was over 8 million. A large portion of the rural population were tenant farmers living in extreme poverty. They survived on tiny plots of land, and the only crop that could produce enough food to feed a family on such a small plot was the potato.
        </p>
        <p className="mb-4">
          This over-reliance on a single crop created a ticking time bomb.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Critical Role of the Potato</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            A single acre of potatoes could feed a family of six for a year. No other crop came close. For about one-third of the Irish population, the potato was not just part of their diet; it was their entire diet.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Why was the potato so important to the rural poor in Ireland?</p>
            <ul className="space-y-2">
              <li>• It was the only crop they were allowed to grow</li>
              <li>• <strong>It was the only crop that could produce enough food on a small plot of land ✓</strong></li>
              <li>• It was a valuable export crop</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson4Content;
