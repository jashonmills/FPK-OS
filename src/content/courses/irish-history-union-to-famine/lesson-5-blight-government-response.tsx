import React from 'react';

export const Lesson5Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Identify the potato blight ('Phytophthora infestans') as the cause of the Famine.</li>
          <li>Analyze the initial response of Robert Peel's government.</li>
          <li>Critique the later response of Lord John Russell's government and the ideology of 'laissez-faire'.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Blight Arrives</h2>
        <p className="mb-4">
          In 1845, a fungal disease called potato blight arrived in Ireland, destroying up to half the crop. The British Prime Minister, Robert Peel, responded by importing Indian corn from America and setting up public works schemes.
        </p>
        <p className="mb-4">
          However, he was replaced in 1846 by Lord John Russell, whose government was a strong believer in 'laissez-faire'—the idea that the government should not interfere with the economy. They shut down food depots and made relief efforts much harsher, believing that the free market would solve the problem.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">The Cruel Paradox</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p>
            A key failure of the laissez-faire policy was that while millions starved, large quantities of other food products like grain, cattle, and butter were being exported from Ireland to England because it was more profitable. The government refused to stop these exports.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: What was the economic ideology that guided Lord John Russell's government's response to the Famine?</p>
            <ul className="space-y-2">
              <li>• Socialism</li>
              <li>• Mercantilism</li>
              <li>• <strong>Laissez-faire ✓</strong></li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson5Content;
