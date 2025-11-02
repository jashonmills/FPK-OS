import React from 'react';

export const Lesson4Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Compare the development of the New England, Middle, and Southern colonies.</li>
          <li>Analyze the sources of conflict, such as Bacon's Rebellion and King Philip's War.</li>
          <li>Understand the growth of slavery in the Southern colonies.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Regional Differences in British America</h2>
        <p className="mb-4">
          The British colonies were not uniform. Different regions developed distinct economies, societies, and cultures based on geography, climate, and the motivations of their founders.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Three Colonial Regions</h2>
        <div className="space-y-4">
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">New England Colonies (Massachusetts, Connecticut, Rhode Island):</p>
            <p>Founded primarily by Puritans seeking religious freedom. Developed around small towns, family farms, fishing, and shipbuilding.</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">Middle Colonies (Pennsylvania, New York, New Jersey):</p>
            <p>More diverse religiously and ethnically. Known as the "breadbasket" colonies for their wheat production.</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">Southern Colonies (Virginia, Maryland, Carolinas, Georgia):</p>
            <p>Developed a plantation economy based on export crops like tobacco and rice, which led to a massive increase in the use of enslaved African labor.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Major Colonial Conflicts</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            <strong>King Philip's War (1675-1676):</strong> A major conflict between New England colonists and Native Americans over land expansion.
          </p>
          <p>
            <strong>Bacon's Rebellion (1676):</strong> A conflict in Virginia between poor frontier farmers and the wealthy elite, which accelerated the shift from using indentured servants to enslaved Africans for labor.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Which colonial region developed an economy based on large plantations and enslaved labor?</p>
            <ul className="space-y-2">
              <li>• New England Colonies</li>
              <li>• Middle Colonies</li>
              <li>• <strong>Southern Colonies ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson4Content;
