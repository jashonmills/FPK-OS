import React from 'react';

export const Lesson3Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand the role of oceans in regulating Earth's climate.</li>
          <li>Learn about ocean currents and tides.</li>
          <li>Identify the major zones of the ocean.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Vital Role of Oceans</h2>
        <p className="mb-4">
          Oceans cover over 70% of our planet's surface and play a vital role in our climate system by absorbing heat and carbon dioxide. Giant ocean currents, like the Gulf Stream, act like a conveyor belt, transporting warm and cold water around the globe.
        </p>
        <p className="mb-4">
          Tides are the regular rise and fall of sea level caused by the gravitational pull of the Moon and Sun. These tidal forces create predictable patterns that have shaped coastal ecosystems for millions of years.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Real-World Example</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            <strong>The Gulf Stream</strong> brings warm water from the tropics to Northern Europe, making countries like the UK and Ireland much warmer than they would otherwise be at their latitude. Without this current, these regions would have climates similar to Canada!
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: What is the primary cause of ocean tides?</p>
            <ul className="space-y-2">
              <li>• Wind</li>
              <li>• The Earth's rotation</li>
              <li>• <strong>The gravitational pull of the Moon and Sun ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson3Content;
