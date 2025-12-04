import React from 'react';

export const Lesson6Content = () => {
  return (
    <div className="prose prose-lg max-w-none">
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Learning Objectives</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name the eight planets of our solar system in order.</li>
          <li>Differentiate between a star, a galaxy, and the universe.</li>
          <li>Understand the vast scale of the cosmos.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">From Solar System to Universe</h2>
        <p className="mb-4">
          Our solar system consists of our star (the Sun) and everything bound to it by gravity. A <strong>star</strong> is a massive ball of hot gas that produces light and heat through nuclear fusion.
        </p>
        <p className="mb-4">
          A <strong>galaxy</strong> is a huge collection of gas, dust, and billions of stars and their solar systems, all held together by gravity. The <strong>universe</strong> is all of space and time and their contents, including planets, stars, galaxies, and all other forms of matter and energy.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Our Cosmic Address</h2>
        <div className="bg-muted p-6 rounded-lg mb-4">
          <p className="mb-3">
            <strong>The Eight Planets:</strong> Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.
          </p>
          <p>
            We live on planet Earth, in the Solar System, which is part of the Milky Way galaxy. The Milky Way is just one of billions of galaxies in the observable universe. Each of those billions of galaxies contains billions of stars, many with their own planets!
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Knowledge Check</h2>
        <div className="space-y-4">
          <div className="bg-card p-6 rounded-lg border">
            <p className="font-semibold mb-3">Question: A huge collection of billions of stars is called a...?</p>
            <ul className="space-y-2">
              <li>• Solar System</li>
              <li>• <strong>Galaxy ✓</strong></li>
              <li>• Nebula</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Lesson6Content;
