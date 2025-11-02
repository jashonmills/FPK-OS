import React from 'react';

export const Lesson2Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Define the Columbian Exchange.</li>
          <li>Analyze the impact of the exchange on the populations of Europe, Africa, and the Americas.</li>
          <li>Understand the devastating effect of new diseases on Native American populations.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Columbian Exchange</h2>
        <p className="mb-4">
          The Columbian Exchange refers to the widespread transfer of plants, animals, culture, human populations, technology, diseases, and ideas between the Americas (the New World) and the Old World (Europe, Africa) in the 15th and 16th centuries.
        </p>
        <p className="mb-4">
          This exchange fundamentally transformed both worlds, with profound and lasting consequences for global populations, ecosystems, and economies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Exchange in Both Directions</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            <strong>From the Americas to Europe:</strong> Potatoes, maize, tomatoes, tobacco, cacao
          </p>
          <p className="mb-3">
            <strong>From Europe to the Americas:</strong> Horses, cattle, pigs, wheat, sugar, and devastating diseases like smallpox, measles, and typhus
          </p>
          <p>
            <strong>Catastrophic Impact:</strong> The introduction of Old World diseases led to a demographic catastrophe—up to 90% of Native American populations died within the first century of contact.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Which of the following was a consequence of the Columbian Exchange?</p>
            <ul className="space-y-2">
              <li>• The introduction of horses to the Americas</li>
              <li>• The introduction of potatoes to Europe</li>
              <li>• The spread of new diseases to Native Americans</li>
              <li>• <strong>All of the above ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson2Content;
