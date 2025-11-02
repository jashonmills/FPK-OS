import React from 'react';

export const Lesson2Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify Daniel O'Connell, 'The Liberator', as a key figure in 19th-century Ireland.</li>
          <li>Define Catholic Emancipation.</li>
          <li>Understand O'Connell's method of non-violent mass mobilization.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Daniel O'Connell: The Liberator</h2>
        <p className="mb-4">
          Following the Act of Union, Catholics in Ireland could vote but were barred from holding seats in Parliament due to discriminatory laws. Daniel O'Connell, a brilliant lawyer and politician, organized a massive, non-violent political movement to fight for their rights.
        </p>
        <p className="mb-4">
          His organization, the Catholic Association, used a 'Catholic Rent' of one penny a month to create a huge grassroots campaign. This movement culminated in Catholic Emancipation in 1829, which allowed Catholics to sit in the British Parliament.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Political Crisis of 1828</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            In 1828, O'Connell won a seat in County Clare, but as a Catholic, he was legally unable to take it. This created a political crisis for the British government, forcing them to pass the Catholic Relief Act of 1829 (Catholic Emancipation) to avoid widespread civil unrest in Ireland.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: What was the main goal of Catholic Emancipation?</p>
            <ul className="space-y-2">
              <li>• To repeal the Act of Union</li>
              <li>• <strong>To allow Catholics to sit in Parliament ✓</strong></li>
              <li>• To establish a Catholic monarchy</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson2Content;
