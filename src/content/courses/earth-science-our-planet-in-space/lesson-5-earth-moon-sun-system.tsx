import React from 'react';

export const Lesson5Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Explain how the tilt of the Earth's axis causes the seasons.</li>
          <li>Understand the phases of the Moon.</li>
          <li>Differentiate between a solar and a lunar eclipse.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Earth's Tilt and Seasons</h2>
        <p className="mb-4">
          Our seasons are not caused by our distance from the Sun, but by the 23.5-degree tilt of Earth's axis. When our hemisphere is tilted toward the Sun, we experience summer. When tilted away, we experience winter.
        </p>
        <p className="mb-4">
          The phases of the Moon are caused by the changing angles at which we view the Moon's sunlit surface as it orbits the Earth. We see everything from a new moon (not visible) to a full moon (fully illuminated) and all phases in between.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Understanding Eclipses</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            <strong>Solar Eclipse:</strong> The Moon passes between the Sun and Earth, casting a shadow on Earth. This can only happen during a new moon.
          </p>
          <p>
            <strong>Lunar Eclipse:</strong> Earth passes directly between the Sun and Moon, casting a shadow on the Moon. This can only happen during a full moon.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: What is the primary cause of Earth's seasons?</p>
            <ul className="space-y-2">
              <li>• The Earth's distance from the Sun</li>
              <li>• <strong>The tilt of the Earth's axis ✓</strong></li>
              <li>• Ocean currents</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson5Content;
