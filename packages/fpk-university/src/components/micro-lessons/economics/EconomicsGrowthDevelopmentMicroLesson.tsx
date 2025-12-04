import React from 'react';
import { MicroLessonContainer } from '@/components/micro-lessons/MicroLessonContainer';
import { MicroLessonData } from '@/components/micro-lessons/MicroLessonContainer';

interface EconomicsGrowthDevelopmentMicroLessonProps {
  onComplete?: () => void;
  onNext?: () => void;
  hasNext?: boolean;
}

export const EconomicsGrowthDevelopmentMicroLesson: React.FC<EconomicsGrowthDevelopmentMicroLessonProps> = ({ 
  onComplete, 
  onNext, 
  hasNext 
}) => {
  const lessonData: MicroLessonData = {
    id: 'economics-growth-development',
    moduleTitle: 'Economic Growth & Development',
    totalScreens: 11,
    screens: [
      {
        id: 'intro',
        type: 'concept',
        title: 'Growth vs Development',
        content: `
          <h2>Economic Growth and Development</h2>
          <p>Economic growth and development are related but distinct concepts in economics.</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Economic Growth</h3>
              <p class="text-sm">Increase in the quantity of goods and services produced</p>
              <p class="text-sm mt-2"><strong>Measured by:</strong> GDP, GDP per capita</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Economic Development</h3>
              <p class="text-sm">Improvement in quality of life and living standards</p>
              <p class="text-sm mt-2"><strong>Includes:</strong> Health, education, environment</p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Key Point:</strong> A country can have growth without development, but sustainable development usually requires growth.</p>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'measuring-growth',
        type: 'concept',
        title: 'Measuring Economic Growth',
        content: `
          <h2>How We Track Economic Progress</h2>
          <p>Economic growth is typically measured by changes in real GDP over time.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Growth Rate Formula</h3>
            <p class="text-center text-lg">Growth Rate = ((GDP₂ - GDP₁) / GDP₁) × 100</p>
          </div>
          <div class="space-y-3 mt-4">
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Strong Growth</h3>
              <p class="text-sm">3-5% annually for developed countries</p>
              <p class="text-sm">5-8% annually for developing countries</p>
            </div>
            <div class="bg-yellow-50 p-3 rounded-lg">
              <h3 class="font-bold text-yellow-800">GDP Per Capita</h3>
              <p class="text-sm">Total GDP ÷ Population</p>
              <p class="text-sm">Better measure of individual prosperity</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'sources-of-growth',
        type: 'concept',
        title: 'Sources of Economic Growth',
        content: `
          <h2>What Drives Economic Growth?</h2>
          <p>Economic growth comes from increases in the quantity and quality of productive resources.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-800">Labor</h3>
              <p class="text-sm">More workers, better education and skills</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">Capital</h3>
              <p class="text-sm">More machines, buildings, and infrastructure</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold text-purple-800">Technology</h3>
              <p class="text-sm">Innovation and improved production methods</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-800">Natural Resources</h3>
              <p class="text-sm">Land, minerals, energy sources</p>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Most Important:</strong> Technology and human capital are often the biggest drivers of long-term growth.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'productivity',
        type: 'concept',
        title: 'Productivity and Growth',
        content: `
          <h2>Working Smarter, Not Just Harder</h2>
          <p>Productivity measures how much output is produced per unit of input.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Labor Productivity</h3>
            <p class="text-center">Output per Worker = Total Output ÷ Number of Workers</p>
          </div>
          <div class="space-y-3 mt-4">
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Factors Increasing Productivity</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Better education and training</li>
                <li>• Improved technology and tools</li>
                <li>• Better organization and management</li>
                <li>• Specialization and division of labor</li>
              </ul>
            </div>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Why It Matters:</strong> Higher productivity means higher wages and living standards without working more hours.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'human-capital',
        type: 'concept',
        title: 'Human Capital',
        content: `
          <h2>Investing in People</h2>
          <p>Human capital refers to the knowledge, skills, and abilities that workers possess.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Components of Human Capital</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Formal education (schools, universities)</li>
              <li>• Job training and experience</li>
              <li>• Health and physical fitness</li>
              <li>• Technical and soft skills</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">Benefits of Human Capital Investment</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Higher individual earnings</li>
              <li>• Increased economic growth</li>
              <li>• Better innovation and problem-solving</li>
              <li>• More adaptability to change</li>
            </ul>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'technology-innovation',
        type: 'concept',
        title: 'Technology and Innovation',
        content: `
          <h2>The Engine of Long-term Growth</h2>
          <p>Technological progress is often the most important driver of sustained economic growth.</p>
          <div class="space-y-3 mt-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Types of Innovation</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Product innovation (new goods and services)</li>
                <li>• Process innovation (better production methods)</li>
                <li>• Organizational innovation (new management techniques)</li>
              </ul>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Examples of Growth-Driving Technologies</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Steam engine (Industrial Revolution)</li>
                <li>• Electricity and assembly lines</li>
                <li>• Computers and the internet</li>
                <li>• Artificial intelligence and automation</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'investment-capital',
        type: 'concept',
        title: 'Investment and Capital Formation',
        content: `
          <h2>Building for the Future</h2>
          <p>Investment in physical capital is crucial for economic growth.</p>
          <div class="bg-blue-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-blue-800">Types of Investment</h3>
            <ul class="mt-2 space-y-1 text-sm">
              <li>• Business equipment and machinery</li>
              <li>• Infrastructure (roads, bridges, airports)</li>
              <li>• Buildings and facilities</li>
              <li>• Research and development</li>
            </ul>
          </div>
          <div class="bg-green-50 p-4 rounded-lg mt-4">
            <h3 class="font-bold text-green-800">The Investment-Growth Cycle</h3>
            <p class="text-sm">Investment → Higher productivity → Higher income → More savings → More investment</p>
          </div>
          <div class="bg-yellow-50 p-4 rounded-lg mt-4">
            <p><strong>Challenge:</strong> Investment requires sacrifice of current consumption for future benefits.</p>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'institutions-growth',
        type: 'concept',
        title: 'Institutions and Growth',
        content: `
          <h2>The Framework for Growth</h2>
          <p>Strong institutions provide the foundation for sustainable economic growth.</p>
          <div class="space-y-3 mt-4">
            <div class="border-l-4 border-blue-500 pl-4">
              <h3 class="font-bold text-blue-800">Property Rights</h3>
              <p class="text-sm">Legal protection of ownership encourages investment</p>
            </div>
            <div class="border-l-4 border-green-500 pl-4">
              <h3 class="font-bold text-green-800">Rule of Law</h3>
              <p class="text-sm">Fair legal system reduces uncertainty and corruption</p>
            </div>
            <div class="border-l-4 border-purple-500 pl-4">
              <h3 class="font-bold text-purple-800">Political Stability</h3>
              <p class="text-sm">Stable government encourages long-term planning</p>
            </div>
            <div class="border-l-4 border-red-500 pl-4">
              <h3 class="font-bold text-red-800">Free Markets</h3>
              <p class="text-sm">Competition drives efficiency and innovation</p>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'measuring-development',
        type: 'concept',
        title: 'Measuring Development',
        content: `
          <h2>Beyond GDP: Quality of Life Indicators</h2>
          <p>Economic development involves more than just income - it includes improvements in human welfare.</p>
          <div class="space-y-3 mt-4">
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Human Development Index (HDI)</h3>
              <p class="text-sm">Combines life expectancy, education, and income measures</p>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">Other Development Indicators</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Literacy rates</li>
                <li>• Infant mortality rates</li>
                <li>• Access to clean water and sanitation</li>
                <li>• Gender equality measures</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 3
      },
      {
        id: 'south-korea-example',
        type: 'example',
        title: 'South Korea: A Development Success Story',
        content: `
          <h2>From Poverty to Prosperity</h2>
          <p>South Korea's transformation from 1960-2020 demonstrates rapid economic development:</p>
          <div class="space-y-3 mt-4">
            <div class="bg-red-50 p-3 rounded-lg">
              <h3 class="font-bold text-red-800">1960: Starting Point</h3>
              <ul class="text-sm space-y-1">
                <li>• GDP per capita: $158 (poorer than many African countries)</li>
                <li>• Largely agricultural economy</li>
                <li>• Low literacy rates</li>
              </ul>
            </div>
            <div class="bg-blue-50 p-3 rounded-lg">
              <h3 class="font-bold text-blue-800">Key Strategies</h3>
              <ul class="text-sm space-y-1">
                <li>• Massive investment in education</li>
                <li>• Export-oriented industrialization</li>
                <li>• Government-business cooperation</li>
                <li>• Technology adoption and R&D</li>
              </ul>
            </div>
            <div class="bg-green-50 p-3 rounded-lg">
              <h3 class="font-bold text-green-800">2020: Results</h3>
              <ul class="text-sm space-y-1">
                <li>• GDP per capita: over $31,000</li>
                <li>• High-tech manufacturing leader</li>
                <li>• High HDI ranking</li>
              </ul>
            </div>
          </div>
        `,
        estimatedTime: 4
      },
      {
        id: 'summary',
        type: 'summary',
        title: 'Growth & Development Summary',
        content: `
          <h2>Key Takeaways</h2>
          <div class="space-y-4 mt-4">
            <div class="bg-blue-50 p-4 rounded-lg">
              <h3 class="font-bold text-blue-800">Growth vs Development</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Growth = more output (GDP)</li>
                <li>• Development = better quality of life (HDI)</li>
                <li>• Both are important for prosperity</li>
              </ul>
            </div>
            <div class="bg-green-50 p-4 rounded-lg">
              <h3 class="font-bold text-green-800">Sources of Growth</h3>
              <ul class="mt-2 space-y-1 text-sm">
                <li>• Human capital (education, skills)</li>
                <li>• Physical capital (machines, infrastructure)</li>
                <li>• Technology and innovation</li>
                <li>• Strong institutions</li>
              </ul>
            </div>
            <div class="bg-yellow-50 p-4 rounded-lg">
              <h3 class="font-bold text-yellow-800">Key Insight</h3>
              <p class="text-sm">Sustainable development requires investment in people, technology, and institutions - not just more resources.</p>
            </div>
          </div>
          <p class="mt-4 text-center font-medium">Economic growth and development improve lives and create opportunities!</p>
        `,
        estimatedTime: 3
      }
    ]
  };

  return (
    <MicroLessonContainer
      lessonData={lessonData}
      onComplete={onComplete}
      onNext={onNext}
      hasNext={hasNext}
    />
  );
};