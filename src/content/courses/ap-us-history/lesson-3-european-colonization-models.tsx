import React from 'react';

export const Lesson3Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Compare the colonization goals and models of the Spanish, French, Dutch, and British.</li>
          <li>Analyze the different relationships each European power had with Native Americans.</li>
          <li>Understand the development of the Atlantic slave trade.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Competing European Models</h2>
        <p className="mb-4">
          Different European powers had different goals and approaches to colonization, which shaped their relationships with Native Americans and the development of their colonies.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Colonization Strategies</h2>
        <div className="space-y-4">
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">Spanish:</p>
            <p>Sought to extract wealth (gold and silver) and convert Native Americans to Christianity, often through forced labor systems like the encomienda.</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">French and Dutch:</p>
            <p>Focused on trade (especially fur) and developed more cooperative relationships with Native Americans through trading partnerships.</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">British:</p>
            <p>Focused on agriculture and sending large numbers of permanent settlers, leading to frequent and violent conflict over land.</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">The Atlantic Slave Trade:</p>
            <p>All European powers participated in the Atlantic slave trade, which forcibly brought millions of Africans to the Americas to provide labor, particularly on sugar and tobacco plantations.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Which European power's colonization model was primarily based on fur trading and alliances with Native Americans?</p>
            <ul className="space-y-2">
              <li>• Spanish</li>
              <li>• British</li>
              <li>• <strong>French ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson3Content;
