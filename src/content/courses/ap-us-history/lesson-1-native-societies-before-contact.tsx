import React from 'react';

export const Lesson1Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Describe the diversity of Native American societies in different regions of North America before 1492.</li>
          <li>Analyze how environment shaped the development of these societies (e.g., maize cultivation).</li>
          <li>Understand that North America was a populated and complex continent prior to European arrival.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Pre-Contact North America</h2>
        <p className="mb-4">
          Before European contact, North America was home to millions of people living in hundreds of distinct and complex societies. These societies adapted to and transformed their diverse environments.
        </p>
        <p className="mb-4">
          For example, the spread of maize (corn) cultivation from present-day Mexico northward supported economic development, settlement, and social diversification among societies in the Southwest and along the Atlantic seaboard.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Regional Diversity</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            <strong>Southwest (Pueblo Peoples):</strong> Developed intricate irrigation systems to grow maize in the arid environment.
          </p>
          <p className="mb-3">
            <strong>Northeast (Iroquois):</strong> Formed the Iroquois League, a powerful political confederacy that was a major diplomatic and military force.
          </p>
          <p>
            <strong>Great Plains (Sioux):</strong> Largely mobile societies that hunted buffalo and adapted to the grassland environment.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: The spread of which crop from Mexico was a major factor in the development of more settled societies in North America?</p>
            <ul className="space-y-2">
              <li>• Wheat</li>
              <li>• Potatoes</li>
              <li>• <strong>Maize (corn) ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson1Content;
