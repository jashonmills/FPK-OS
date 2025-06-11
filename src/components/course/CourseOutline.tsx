
import React from 'react';
import DualLanguageText from '@/components/DualLanguageText';

const CourseOutline: React.FC = () => {
  const outlineItems = [
    'courses.learningState.outline.intro',
    'courses.learningState.outline.cognitiveLoad',
    'courses.learningState.outline.attention',
    'courses.learningState.outline.memory',
    'courses.learningState.outline.metacognition'
  ];

  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
        <DualLanguageText translationKey="courses.courseOutline" />
      </h2>
      <ul className="space-y-1 sm:space-y-2 text-sm sm:text-base text-gray-700">
        {outlineItems.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-600 rounded-full flex-shrink-0"></div>
            <DualLanguageText translationKey={item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseOutline;
