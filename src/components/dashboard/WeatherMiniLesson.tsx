
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, BookOpen, Loader2, RotateCcw } from 'lucide-react';
import { WeatherData } from '@/services/WeatherService';

interface WeatherMiniLessonProps {
  weatherData: WeatherData;
  onGenerate?: () => void;
}

const WeatherMiniLesson: React.FC<WeatherMiniLessonProps> = ({ 
  weatherData, 
  onGenerate 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lesson, setLesson] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLesson = async () => {
    if (onGenerate) {
      onGenerate();
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate AI lesson generation with weather context
      const temp = Math.round(weatherData.current.temp);
      const weather = weatherData.current.weather[0]?.description || 'clear';
      const avgPrecip = Math.round(
        weatherData.hourly.reduce((sum, hour) => sum + hour.pop, 0) / weatherData.hourly.length * 100
      );

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      const generatedLesson = `
# Today's Weather Science Mini-Lesson

## Current Conditions & Science
Today's temperature is **${temp}°C** with **${weather}** conditions and an average **${avgPrecip}% chance** of precipitation over the next 12 hours.

## How This Affects Ecosystems

### Temperature Impact (${temp}°C)
${temp > 25 
  ? '• **Hot Weather Effects**: Plants increase transpiration (water loss through leaves), animals seek shade and water sources, and some insects become more active.'
  : temp > 15
  ? '• **Moderate Weather Effects**: Plants photosynthesize efficiently, animals are active, and ecosystems maintain balanced water cycles.'
  : '• **Cool Weather Effects**: Plants slow their growth, some animals enter conservation mode, and water evaporation decreases.'
}

### Precipitation Probability (${avgPrecip}%)
${avgPrecip > 70
  ? '• **High Rain Chance**: Soil moisture increases, plants can absorb more nutrients, and aquatic ecosystems receive fresh water input.'
  : avgPrecip > 30
  ? '• **Moderate Rain Chance**: Perfect for plant growth and maintaining soil moisture levels without overwhelming drainage systems.'
  : '• **Low Rain Chance**: Plants may rely on stored water, animals seek water sources, and dry conditions favor certain adapted species.'
}

## Fun Weather Fact! 🌟
Did you know that a single raindrop can travel up to 20 mph before hitting the ground? The speed depends on the drop's size - larger drops fall faster but also break apart more easily!

## Quick Home Experiment 🧪

**Make a Simple Weather Station:**

1. **Temperature Tracker**: Place a thermometer outside in the shade
2. **Rain Gauge**: Put a clear container outside to measure rainfall
3. **Wind Direction**: Tie a ribbon to a stick to see wind direction
4. **Observations**: Record your measurements for 3 days and compare with weather forecasts

**What to Notice**: How do your measurements compare to official weather reports? What patterns do you see?

## Human Activity Connections
- **Agriculture**: Farmers adjust irrigation based on precipitation forecasts
- **Energy**: Air conditioning use increases with temperature, affecting power grids
- **Transportation**: Weather conditions influence travel safety and efficiency
- **Health**: Temperature and humidity affect how our bodies regulate heat

*This lesson was generated based on your local weather conditions. Try the experiment and observe how weather patterns change throughout the week!*
      `;

      setLesson(generatedLesson);
      setIsOpen(true);
    } catch (err) {
      console.error('Error generating weather lesson:', err);
      setError('Unable to generate lesson. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderLessonContent = (text: string) => {
    const lines = text.trim().split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      if (line.trim() === '') return;
      
      if (line.startsWith('# ')) {
        elements.push(
          <h2 key={index} className="text-lg font-bold text-blue-900 mb-3 mt-4 first:mt-0">
            {line.replace('# ', '')}
          </h2>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h3 key={index} className="text-md font-semibold text-blue-800 mb-2 mt-4">
            {line.replace('## ', '')}
          </h3>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h4 key={index} className="text-sm font-semibold text-blue-700 mb-2 mt-3">
            {line.replace('### ', '')}
          </h4>
        );
      } else if (line.startsWith('• ')) {
        elements.push(
          <p key={index} className="text-sm text-gray-700 mb-1 ml-4">
            {line}
          </p>
        );
      } else if (line.match(/^\d+\./)) {
        elements.push(
          <p key={index} className="text-sm text-gray-700 mb-1 ml-4">
            {line}
          </p>
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        elements.push(
          <p key={index} className="text-xs text-gray-600 italic mt-3 mb-2">
            {line.replace(/^\*|\*$/g, '')}
          </p>
        );
      } else {
        elements.push(
          <p key={index} className="text-sm text-gray-700 mb-2">
            {line}
          </p>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="mt-4 border-t border-blue-200 pt-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between">
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-blue-700 hover:text-blue-900 hover:bg-blue-50 p-0 h-auto font-medium"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Mini-Lesson
              {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="mt-3">
          {!lesson && !error ? (
            <div className="text-center py-4">
              <BookOpen className="h-8 w-8 text-blue-400 mx-auto mb-3" />
              <p className="text-sm text-blue-700 mb-3">
                Generate a personalized science lesson based on today's weather conditions
              </p>
              <Button
                onClick={generateLesson}
                disabled={isGenerating}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Generate Today's Science Lesson
                  </>
                )}
              </Button>
            </div>
          ) : error ? (
            <div className="text-center py-4">
              <RotateCcw className="h-8 w-8 text-red-400 mx-auto mb-3" />
              <p className="text-sm text-red-600 mb-3">{error}</p>
              <Button
                onClick={generateLesson}
                disabled={isGenerating}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          ) : lesson ? (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="prose prose-sm max-w-none">
                {renderLessonContent(lesson)}
              </div>
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-blue-200">
                <Button
                  onClick={() => setLesson(null)}
                  variant="outline"
                  size="sm"
                  className="border-blue-300 text-blue-600 hover:bg-blue-100"
                >
                  Close Lesson
                </Button>
                <Button
                  onClick={generateLesson}
                  disabled={isGenerating}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-100"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Generate New
                </Button>
              </div>
            </div>
          ) : null}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default WeatherMiniLesson;
