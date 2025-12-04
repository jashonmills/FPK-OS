
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, BookOpen, Loader2, RotateCcw } from 'lucide-react';
import { WeatherData } from '@/services/WeatherService';
import { useCleanup } from '@/utils/cleanupManager';

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
  const cleanup = useCleanup('WeatherMiniLesson');

  const generateLesson = async () => {
    if (onGenerate) {
      onGenerate();
    }

    setIsGenerating(true);
    setError(null);

    try {
      const temp = Math.round(weatherData.current.temp);
      const weather = weatherData.current.weather[0]?.description || 'clear';
      const weatherMain = weatherData.current.weather[0]?.main || 'Clear';
      const humidity = weatherData.current.humidity;
      const avgPrecip = Math.round(
        weatherData.hourly.reduce((sum, hour) => sum + hour.pop, 0) / weatherData.hourly.length * 100
      );

      // Simulate API delay
      await new Promise(resolve => {
        cleanup.setTimeout(() => resolve(undefined), 1500 + Math.random() * 1000);
      });

      // Weather-specific content variations
      const weatherFacts = {
        Clear: [
          "Did you know that clear skies allow up to 90% of the sun's UV radiation to reach Earth's surface?",
          "On clear days, temperature differences between day and night can be as much as 15-20°C due to radiational cooling!",
          "Clear skies happen when high-pressure systems push clouds away, creating stable atmospheric conditions."
        ],
        Clouds: [
          "Clouds are made of tiny water droplets or ice crystals so small that 1 million could fit in a teaspoon!",
          "A single cumulus cloud can weigh as much as 100 elephants - about 500,000 kg of water vapor!",
          "Clouds reflect about 20% of incoming solar radiation back to space, helping regulate Earth's temperature."
        ],
        Rain: [
          "A raindrop falling from a typical cloud height of 1000m takes about 4-5 minutes to reach the ground!",
          "The smell of rain (petrichor) comes from oils secreted by plants and a chemical called geosmin produced by bacteria.",
          "Rain drops are not tear-shaped - they're actually more like tiny hamburger buns due to air resistance!"
        ],
        Drizzle: [
          "Drizzle droplets are so small (less than 0.5mm) that they appear to float in the air!",
          "Drizzle forms in stratus clouds close to the ground, creating that misty, ethereal atmosphere.",
          "Unlike rain, drizzle droplets rarely reach terminal velocity, making them seem to drift rather than fall."
        ]
      };

      const experiments = {
        Clear: [
          "**Shadow Clock**: Use a stick in the ground to track the sun's movement and create your own sundial!",
          "**Solar Heating**: Place dark and light objects in the sun - measure which heats up faster and why.",
          "**UV Detection**: Place different materials (glass, plastic, fabric) over UV-sensitive beads to test protection."
        ],
        Clouds: [
          "**Cloud Formation**: Fill a jar with hot water, place ice on top, and watch clouds form inside!",
          "**Cloud Types**: Look outside and try to identify cumulus (puffy), stratus (layered), and cirrus (wispy) clouds.",
          "**Weather Prediction**: Track cloud types and movements to predict weather changes over the next few hours."
        ],
        Rain: [
          "**Rain Collection**: Set up containers of different shapes - does shape affect collection rate?",
          "**Drop Size Study**: Let raindrops fall on flour to see their actual shapes when they hit surfaces.",
          "**Sound Science**: Listen to rain on different surfaces - metal, wood, fabric. Why do the sounds differ?"
        ],
        Drizzle: [
          "**Droplet Observation**: Use a magnifying glass to observe drizzle droplets on spider webs or leaves.",
          "**Mist Creation**: Use a spray bottle to recreate drizzle conditions and study how it affects visibility.",
          "**Plant Response**: Observe how plants react differently to drizzle versus heavier rain."
        ]
      };

      const selectedFact = weatherFacts[weatherMain] ? 
        weatherFacts[weatherMain][Math.floor(Math.random() * weatherFacts[weatherMain].length)] :
        weatherFacts.Clear[0];

      const selectedExperiment = experiments[weatherMain] ? 
        experiments[weatherMain][Math.floor(Math.random() * experiments[weatherMain].length)] :
        experiments.Clear[0];

      // Season-based content (simplified approximation)
      const month = new Date().getMonth();
      const season = month >= 2 && month <= 4 ? 'Spring' : 
                   month >= 5 && month <= 7 ? 'Summer' :
                   month >= 8 && month <= 10 ? 'Autumn' : 'Winter';

      const seasonalInsights = {
        Spring: "Spring's changing weather patterns help plants know when to bloom and animals when to emerge from winter dormancy.",
        Summer: "Summer's intense solar radiation drives the water cycle, creating thunderstorms and heat islands in urban areas.",
        Autumn: "Autumn's cooling temperatures trigger leaf color changes as chlorophyll breaks down, revealing other pigments.",
        Winter: "Winter's cold air holds less moisture, creating crisp, clear days and unique ice crystal formations."
      };

      const generatedLesson = `
# Today's Weather Science Mini-Lesson

## Current Conditions & Science
Right now, it's **${temp}°C** with **${weather}** conditions. The humidity is at **${humidity}%**, and there's an average **${avgPrecip}% chance** of precipitation over the next 12 hours.

## Weather Pattern Analysis

### Temperature Impact (${temp}°C)
${temp > 30 
  ? '• **Very Hot**: Extreme heat stress on plants and animals. Increased risk of heat-related health issues. Urban heat island effects intensify.'
  : temp > 25 
  ? '• **Hot Weather**: Plants increase transpiration to cool down. Animals seek shade and water. Some insects become more active.'
  : temp > 15
  ? '• **Comfortable Range**: Optimal conditions for most plant photosynthesis and animal activity. Balanced ecosystem functions.'
  : temp > 5
  ? '• **Cool Conditions**: Plants slow metabolic processes. Some animals begin energy conservation behaviors.'
  : '• **Cold Weather**: Plants enter dormancy modes. Animals use more energy for thermoregulation. Water may freeze, affecting ecosystems.'
}

### Humidity Level (${humidity}%)
${humidity > 80
  ? '• **Very Humid**: High moisture content can stress plants through reduced transpiration. Fog and mist formation likely.'
  : humidity > 60
  ? '• **Moderately Humid**: Good conditions for plant growth. Comfortable for most organisms.'
  : humidity > 40
  ? '• **Moderate Humidity**: Balanced atmospheric moisture. Plants may increase water uptake from roots.'
  : '• **Low Humidity**: Dry air increases plant transpiration rates. Animals may seek water sources more frequently.'
}

### Precipitation Forecast (${avgPrecip}%)
${avgPrecip > 70
  ? '• **High Rain Likelihood**: Soil saturation expected. Great for plant growth but potential for waterlogging in poor drainage areas.'
  : avgPrecip > 40
  ? '• **Moderate Rain Chance**: Perfect balance for ecosystem hydration without overwhelming natural drainage systems.'
  : '• **Low Precipitation**: Plants will rely on stored soil moisture. Desert-adapted species thrive in these conditions.'
}

## Seasonal Context: ${season}
${seasonalInsights[season]}

## Fun Weather Science Fact! 🌟
${selectedFact}

## Today's Weather Experiment 🧪
${selectedExperiment}

## Real-World Connections
- **Agriculture**: Current conditions affect crop irrigation needs and pest management strategies
- **Energy Systems**: Temperature and humidity influence heating/cooling demands and solar panel efficiency  
- **Human Health**: Weather conditions impact air quality, UV exposure, and respiratory comfort
- **Transportation**: Visibility, road conditions, and vehicle performance all respond to these weather patterns

## ${season} Weather Pattern
During ${season.toLowerCase()}, weather systems like today's create specific environmental responses that you can observe in your local area.

*This lesson was generated based on current weather conditions in your area. Weather patterns change constantly - try generating a new lesson tomorrow to see how the science evolves!*
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
