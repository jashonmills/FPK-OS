import React from 'react';

export const Lesson3Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Understand O'Connell's second great campaign: the repeal of the Act of Union.</li>
          <li>Learn about the 'Monster Meetings' of the 1840s.</li>
          <li>Analyze why this campaign ultimately failed.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Monster Meetings</h2>
        <p className="mb-4">
          After achieving Emancipation, O'Connell's next goal was to repeal the Act of Union and restore an Irish parliament (though still under the British Crown). He reused his tactic of mass mobilization, organizing a series of enormous peaceful rallies known as 'Monster Meetings,' some attended by hundreds of thousands of people.
        </p>
        <p className="mb-4">
          However, the British government, led by Prime Minister Robert Peel, was determined not to give in.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Crisis at Clontarf</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            The campaign reached its climax in 1843 with a planned Monster Meeting at Clontarf, Dublin. The British government banned the meeting and threatened to use military force. To avoid bloodshed, O'Connell cancelled the rally. This decision broke the momentum of the Repeal movement, which never recovered.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: What was the name for the massive rallies organized by Daniel O'Connell in the 1840s?</p>
            <ul className="space-y-2">
              <li>• The Great Rallies</li>
              <li>• The Repeal Rallies</li>
              <li>• <strong>The Monster Meetings ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson3Content;
