import React from 'react';

export const Lesson2Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the three main types of rock: igneous, sedimentary, and metamorphic.</li>
          <li>Understand the rock cycle as a process of transformation.</li>
          <li>Learn how each rock type is formed.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Rock Cycle</h2>
        <p className="mb-4">
          Rocks are not permanent; they are constantly being changed in a process called the rock cycle.
        </p>
        <ul className="list-disc pl-6 space-y-3 mb-4">
          <li><strong>Igneous rock</strong> is formed from cooled magma or lava.</li>
          <li><strong>Sedimentary rock</strong> is formed from layers of compressed sediment (like sand and mud).</li>
          <li><strong>Metamorphic rock</strong> is formed when existing rock is changed by intense heat and pressure.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">How the Rock Cycle Works</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            The rock cycle shows how magma cools to form igneous rock, which erodes into sediment. This sediment compacts into sedimentary rock, which is then transformed by heat and pressure into metamorphic rock. The metamorphic rock can melt back into magma, completing the cycle.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question 1: Which type of rock is formed from cooled lava?</p>
            <ul className="space-y-2">
              <li>• Sedimentary</li>
              <li>• <strong>Igneous ✓</strong></li>
              <li>• Metamorphic</li>
            </ul>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question 2: Layers of sand and mud pressed together form which type of rock?</p>
            <ul className="space-y-2">
              <li>• <strong>Sedimentary ✓</strong></li>
              <li>• Igneous</li>
              <li>• Metamorphic</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson2Content;
