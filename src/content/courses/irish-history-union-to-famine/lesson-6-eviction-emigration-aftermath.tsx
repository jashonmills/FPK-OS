import React from 'react';

export const Lesson6Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand the devastation of the Famine: mass death, eviction, and emigration.</li>
          <li>Learn about the 'coffin ships' that carried emigrants to North America.</li>
          <li>Analyze the long-term consequences of the Famine on Irish society and politics.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Scale of the Catastrophe</h2>
        <p className="mb-4">
          The Great Famine (1845-1852) was a catastrophe. An estimated one million people died from starvation and disease. Another million were forced to emigrate, often on overcrowded and disease-ridden vessels known as 'coffin ships'.
        </p>
        <p className="mb-4">
          Many landlords used the Famine as an opportunity to evict their starving tenants and clear their land for cattle grazing. The Famine left a deep and lasting scar on Ireland, fueling resentment against British rule and creating a large, politically active Irish diaspora in the United States.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Lasting Legacy</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            Ireland's population fell from over 8 million before the Famine to about 6.5 million by 1851. It continued to decline for decades afterward.
          </p>
          <p>
            The memory of the Famine became a powerful rallying cry for Irish nationalists seeking independence in the decades that followed.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Approximately how many people died as a result of the Great Famine?</p>
            <ul className="space-y-2">
              <li>• 100,000</li>
              <li>• 500,000</li>
              <li>• <strong>1,000,000 ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson6Content;
