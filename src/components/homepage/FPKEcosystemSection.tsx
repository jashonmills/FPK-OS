import React from 'react';
import { ExternalLink } from 'lucide-react';

const products = [
  {
    name: 'FPK-X',
    description: 'A revolutionary document hub for neurodiversity care, allowing parents, therapists, and educators to centralize records and leverage AI for predictive insights.',
    url: 'https://fpkx.com'
  },
  {
    name: 'FPK Games',
    description: 'Engaging and educational games designed to make learning fun and accessible for everyone.',
    url: 'https://fpkgames.com'
  },
  {
    name: 'FPK Podcast',
    description: 'Insights and conversations on the future of education, technology, and neurodiversity.',
    url: 'https://fpkpodcast.org'
  },
  {
    name: 'FPK Nexus',
    description: 'Our vibrant social media platform for the FPK community to connect, share, and grow together.',
    url: 'https://fpk-nexus.com'
  },
  {
    name: 'FPK University Coach',
    description: 'A powerful, standalone AI study coach for personalized, adaptive learning.',
    url: '#'
  }
];

const FPKEcosystemSection = () => {
  return (
    <section className="py-20 px-6 w-full">
      <div className="w-full max-w-none mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-white/20 max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 text-center">
            More from Future Proof Knowledge
          </h2>
          <p className="text-xl text-slate-700 mb-12 text-center max-w-3xl mx-auto">
            Explore our ecosystem of platforms for learning, community, and personalized care.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <a
                key={index}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-xl bg-white/60 border border-white/40 hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-slate-900">
                    {product.name}
                  </h3>
                  <ExternalLink className="h-5 w-5 text-slate-500 group-hover:text-fpk-orange transition-colors flex-shrink-0 ml-2" />
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {product.description}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FPKEcosystemSection;
