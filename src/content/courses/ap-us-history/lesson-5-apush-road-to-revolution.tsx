import React from 'react';

export const Lesson5Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Analyze the causes and consequences of the French and Indian War (Seven Years' War).</li>
          <li>Explain how British attempts to raise revenue and assert control after 1763 led to colonial resistance.</li>
          <li>Trace the intellectual origins of the Revolution in Enlightenment ideas.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">From Victory to Revolution</h2>
        <p className="mb-4">
          The French and Indian War (1754-1763) ended with a British victory, but left Britain with massive debt. To pay this debt, Parliament imposed new taxes on the colonies, including the Stamp Act (1765) and the Townshend Acts (1767).
        </p>
        <p className="mb-4">
          Colonists, influenced by Enlightenment thinkers like John Locke, argued that this "taxation without representation" violated their natural rights. Years of protest, boycotts, and escalating conflict led to the Declaration of Independence in 1776 and the Revolutionary War.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Power of Ideas</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            Thomas Paine's pamphlet <strong>"Common Sense"</strong> (1776) was hugely influential, using plain language to argue for independence and republican government. It sold hundreds of thousands of copies and swayed public opinion in favor of revolution.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: The British desire to tax the colonies after 1763 stemmed from the debt incurred during which war?</p>
            <ul className="space-y-2">
              <li>• King Philip's War</li>
              <li>• The American Revolution</li>
              <li>• <strong>The French and Indian War ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson5Content;
