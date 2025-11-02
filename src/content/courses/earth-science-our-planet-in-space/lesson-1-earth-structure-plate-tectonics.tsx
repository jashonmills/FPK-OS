import React from 'react';

export const Lesson1Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the layers of the Earth: crust, mantle, and core.</li>
          <li>Define the theory of plate tectonics.</li>
          <li>Understand how plate movement causes earthquakes and volcanoes.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Structure of Our Planet</h2>
        <p className="mb-4">
          Our planet is made of several layers. We live on the crust, a thin outer shell. Below that is the hot, semi-solid mantle, and at the center is the super-hot core. The crust is not one solid piece; it's broken into massive plates that float on the mantle.
        </p>
        <p className="mb-4">
          The theory of plate tectonics explains that these plates are constantly moving, crashing into, pulling apart from, and sliding past each other. This movement is the primary force behind most major geological events.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Real-World Examples</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            <strong>The San Andreas Fault in California</strong> is a boundary where the Pacific Plate and the North American Plate slide past each other, causing frequent earthquakes.
          </p>
          <p>
            <strong>The 'Ring of Fire'</strong> around the Pacific Ocean is a zone of intense volcanic and earthquake activity caused by plates colliding.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question 1: What is the thin outer layer of the Earth that we live on?</p>
            <ul className="space-y-2">
              <li>• Mantle</li>
              <li>• Core</li>
              <li>• <strong>Crust ✓</strong></li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question 2: The movement of which of the following is described by the theory of plate tectonics?</p>
            <ul className="space-y-2">
              <li>• Oceans</li>
              <li>• <strong>Tectonic Plates ✓</strong></li>
              <li>• The Earth's core</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson1Content;
