import React from 'react';

export const Lesson4Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the layers of the atmosphere.</li>
          <li>Understand how differences in air pressure create wind.</li>
          <li>Learn the basics of weather fronts and how they create weather.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Understanding Weather</h2>
        <p className="mb-4">
          Weather is the state of the atmosphere at a specific time and place. The atmosphere is a blanket of gases surrounding the Earth, protecting us and providing the air we breathe.
        </p>
        <p className="mb-4">
          Wind is simply air moving from an area of high pressure to an area of low pressure. Weather fronts are boundaries between large masses of cold air and warm air. When these fronts meet, they can cause clouds, rain, and storms.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Weather Front Example</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            When a <strong>cold front</strong> moves in, the dense, cold air pushes under the lighter, warm air, forcing the warm air to rise rapidly. This often creates dramatic storm clouds and heavy rain. Cold fronts typically move faster than warm fronts and can bring sudden weather changes.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Wind is caused by air moving from an area of ____ pressure to ____ pressure.</p>
            <ul className="space-y-2">
              <li>• Low to High</li>
              <li>• <strong>High to Low ✓</strong></li>
              <li>• It is not related to pressure</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson4Content;
