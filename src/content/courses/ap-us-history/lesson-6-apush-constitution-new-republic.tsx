import React from 'react';

export const Lesson6Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Analyze the debates over the Constitution, focusing on the Federalists and Anti-Federalists.</li>
          <li>Explain the principles of federalism and separation of powers.</li>
          <li>Trace the development of the first political parties (Federalists and Democratic-Republicans).</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Creating a New Government</h2>
        <p className="mb-4">
          After the weak Articles of Confederation failed to provide effective national governance, the Constitution created a stronger federal government in 1787. This sparked a heated debate between:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li><strong>Federalists:</strong> Supported the strong central government and the Constitution as written</li>
          <li><strong>Anti-Federalists:</strong> Feared the concentration of power and demanded a Bill of Rights to protect individual liberties</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The First Political Parties</h2>
        <div className="space-y-4">
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">Federalists (led by Alexander Hamilton):</p>
            <p>Favored a strong central government, a national bank, and a commercial economy. Supported close ties with Britain.</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="font-semibold mb-2">Democratic-Republicans (led by Thomas Jefferson):</p>
            <p>Favored states' rights, an agrarian society of independent farmers, and strict interpretation of the Constitution. Supported France.</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Hamilton's Financial Plan</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            The debate over Hamilton's financial plan—which included federal assumption of state debts and the creation of a national bank—highlighted the different visions of the Federalists and Democratic-Republicans for the future of the country.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: Which political party, led by Thomas Jefferson, favored states' rights and an agrarian society?</p>
            <ul className="space-y-2">
              <li>• Federalists</li>
              <li>• Anti-Federalists</li>
              <li>• <strong>Democratic-Republicans ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson6Content;
