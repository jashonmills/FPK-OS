import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  X, 
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useParams } from 'react-router-dom';

interface ScormPlayerProps {
  mode?: 'preview' | 'launch';
}

const ScormPlayer: React.FC<ScormPlayerProps> = ({ mode = 'preview' }) => {
  const { packageId, scoId, enrollmentId } = useParams();
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [lessonStatus, setLessonStatus] = useState('not attempted');
  const [score, setScore] = useState<number | null>(null);
  const [currentSco, setCurrentSco] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Mock SCO data - will be replaced with real data from hooks
  const scos = [
    { id: 'sco1', title: 'Introduction', completed: true },
    { id: 'sco2', title: 'Safety Procedures', completed: false },
    { id: 'sco3', title: 'Emergency Protocols', completed: false },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed': return 'bg-green-100 text-green-800 border-green-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'incomplete': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'passed': return <CheckCircle className="h-4 w-4" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      case 'incomplete': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  useEffect(() => {
    // Initialize SCORM API
    const initializeScormAPI = () => {
      if (iframeRef.current?.contentWindow) {
        // Inject SCORM 1.2 API into iframe
        const scormAPI = {
          LMSInitialize: (param: string) => {
            console.log('SCORM: LMSInitialize called with', param);
            return 'true';
          },
          LMSGetValue: (element: string) => {
            console.log('SCORM: LMSGetValue called for', element);
            // Return appropriate CMI values based on element
            switch (element) {
              case 'cmi.core.lesson_status': return lessonStatus;
              case 'cmi.core.score.raw': return score?.toString() || '';
              case 'cmi.core.session_time': return sessionTime;
              default: return '';
            }
          },
          LMSSetValue: (element: string, value: string) => {
            console.log('SCORM: LMSSetValue called', element, value);
            // Update state based on CMI element
            switch (element) {
              case 'cmi.core.lesson_status':
                setLessonStatus(value);
                break;
              case 'cmi.core.score.raw':
                setScore(parseInt(value));
                break;
            }
            return 'true';
          },
          LMSCommit: (param: string) => {
            console.log('SCORM: LMSCommit called');
            // Save data to backend
            return 'true';
          },
          LMSFinish: (param: string) => {
            console.log('SCORM: LMSFinish called');
            // Finalize session
            return 'true';
          }
        };

        // Attach API to iframe window
        (iframeRef.current.contentWindow as any).API = scormAPI;
      }
    };

    const timer = setTimeout(initializeScormAPI, 1000);
    return () => clearTimeout(timer);
  }, [lessonStatus, score, sessionTime]);

  const handleRestart = () => {
    setLessonStatus('incomplete');
    setScore(null);
    setSessionTime('00:00:00');
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src; // Reload iframe
    }
  };

  const handleExit = () => {
    // Handle exit logic
    if (mode === 'preview') {
      window.history.back();
    } else {
      // Navigate to course or dashboard
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={handleExit}>
              <X className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="font-semibold">Safety Training Course</h1>
              <p className="text-sm text-muted-foreground">
                {mode === 'preview' ? 'Preview Mode' : 'Learning Mode'} • SCO {currentSco + 1} of {scos.length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{sessionTime}</span>
            </div>
            <Badge 
              variant="outline" 
              className={getStatusColor(lessonStatus)}
            >
              {getStatusIcon(lessonStatus)}
              <span className="ml-1 capitalize">{lessonStatus.replace('_', ' ')}</span>
            </Badge>
            {score !== null && (
              <Badge variant="outline">
                Score: {score}%
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* TOC Sidebar */}
        <div className="w-64 border-r bg-card p-4">
          <h3 className="font-semibold mb-4">Course Contents</h3>
          <div className="space-y-2">
            {scos.map((sco, index) => (
              <div 
                key={sco.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentSco 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-accent'
                }`}
                onClick={() => setCurrentSco(index)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{sco.title}</span>
                  {sco.completed && (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Content Frame */}
          <div className="flex-1 p-4">
            <Card className="h-full">
              <CardContent className="p-0 h-full">
                <iframe
                  ref={iframeRef}
                  src="/placeholder-scorm-content.html" // This would be the actual SCO content
                  className="w-full h-full border-none"
                  title="SCORM Content"
                />
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentSco === 0}
                  onClick={() => setCurrentSco(Math.max(0, currentSco - 1))}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={currentSco === scos.length - 1}
                  onClick={() => setCurrentSco(Math.min(scos.length - 1, currentSco + 1))}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Restart
                </Button>
                <Button variant="outline" size="sm" onClick={handleExit}>
                  Exit Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScormPlayer;