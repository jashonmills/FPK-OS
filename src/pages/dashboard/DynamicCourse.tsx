import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCourse } from '@/hooks/useCourses';
import { useModules } from '@/hooks/useModules';
import EnhancedModuleViewer from '@/components/admin/EnhancedModuleViewer';

const DynamicCourse = () => {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = new URLSearchParams(location.search);
  const selectedModuleNumber = searchParams.get('module');
  
  const { course, isLoading: courseLoading } = useCourse(slug || '');
  const { modules, isLoading: modulesLoading } = useModules(course?.id || '');
  
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const location = useLocation();

  // Set initial module based on URL parameter
  useEffect(() => {
    if (selectedModuleNumber && modules.length > 0) {
      const moduleIndex = modules.findIndex(m => m.module_number === parseInt(selectedModuleNumber));
      if (moduleIndex !== -1) {
        setCurrentModuleIndex(moduleIndex);
      }
    }
  }, [selectedModuleNumber, modules]);

  if (courseLoading || modulesLoading) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Course Not Found</h2>
          <p className="text-gray-600">The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  const currentModule = modules[currentModuleIndex];

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar with module list */}
      <div className="w-80 border-r border-gray-200 bg-gray-50">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{course.title}</h2>
          <p className="text-sm text-gray-600">{course.description}</p>
        </div>
        
        <div className="p-4 space-y-2">
          {modules.map((module, index) => (
            <button
              key={module.id}
              onClick={() => setCurrentModuleIndex(index)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                index === currentModuleIndex 
                  ? 'bg-blue-100 border-blue-200 border' 
                  : 'bg-white hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <div className="font-medium text-sm">
                Module {module.module_number}: {module.title}
              </div>
              {module.description && (
                <div className="text-xs text-gray-600 mt-1">
                  {module.description}
                </div>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  {module.content_type}
                </Badge>
                {module.duration_minutes > 0 && (
                  <span className="text-xs text-gray-500">
                    {module.duration_minutes} mins
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-auto">
        {currentModule ? (
          <div className="p-6">
            <EnhancedModuleViewer module={currentModule} />
            
            {/* Navigation buttons */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setCurrentModuleIndex(Math.max(0, currentModuleIndex - 1))}
                disabled={currentModuleIndex === 0}
              >
                Previous Module
              </Button>
              
              <span className="text-sm text-gray-600">
                Module {currentModuleIndex + 1} of {modules.length}
              </span>
              
              <Button
                onClick={() => setCurrentModuleIndex(Math.min(modules.length - 1, currentModuleIndex + 1))}
                disabled={currentModuleIndex === modules.length - 1}
              >
                Next Module
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules available</h3>
              <p className="text-gray-600">This course doesn't have any modules yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicCourse;
