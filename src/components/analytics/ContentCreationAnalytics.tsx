
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FileText, Upload, CreditCard, TrendingUp } from 'lucide-react';
import { useNotes } from '@/hooks/useNotes';
import { useFileUploads } from '@/hooks/useFileUploads';
import { useFlashcards } from '@/hooks/useFlashcards';
import EmptyState from '@/components/analytics/EmptyState';

const ContentCreationAnalytics = () => {
  const { notes, isLoading: notesLoading } = useNotes();
  const { uploads, isLoading: uploadsLoading } = useFileUploads();
  const { flashcards, isLoading: flashcardsLoading } = useFlashcards();

  const loading = notesLoading || uploadsLoading || flashcardsLoading;

  // Process notes data for weekly creation chart
  const notesData = React.useMemo(() => {
    if (!notes?.length) return [];
    
    const weeklyData = notes.reduce((acc, note) => {
      const week = new Date(note.created_at).toISOString().split('T')[0];
      acc[week] = (acc[week] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(weeklyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-7) // Last 7 weeks
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString(),
        notes: count
      }));
  }, [notes]);

  // Process upload success rate
  const uploadStats = React.useMemo(() => {
    if (!uploads?.length) return { successRate: 0, total: 0 };
    
    const completed = uploads.filter(u => u.processing_status === 'completed').length;
    const total = uploads.length;
    
    return {
      successRate: Math.round((completed / total) * 100),
      total,
      completed,
      failed: total - completed
    };
  }, [uploads]);

  // Process flashcard generation trends
  const flashcardData = React.useMemo(() => {
    if (!flashcards?.length) return [];
    
    const dailyData = flashcards.reduce((acc, card) => {
      const day = new Date(card.created_at).toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(dailyData)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-14) // Last 14 days
      .map(([date, count]) => ({
        date: new Date(date).toLocaleDateString(),
        flashcards: count
      }));
  }, [flashcards]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-0 shadow-lg">
            <CardContent className="p-4 sm:p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const chartConfig = {
    notes: {
      label: 'Notes Created',
      color: '#8B5CF6',
    },
    flashcards: {
      label: 'Flashcards Generated',
      color: '#F59E0B',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Notes Created per Week */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
            Notes Created per Week
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Your note-taking activity over time
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {notesData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={notesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="notes" 
                    stroke="var(--color-notes)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={FileText}
              title="No notes created yet"
              description="Start taking notes to see your content creation trends"
            />
          )}
        </CardContent>
      </Card>

      {/* File Upload Success Rate */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
            File Upload Success Rate
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Upload processing performance
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {uploadStats.total > 0 ? (
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {uploadStats.successRate}%
                </div>
                <p className="text-sm text-gray-500">Success Rate</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">
                    {uploadStats.completed}
                  </div>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div>
                  <div className="text-lg font-semibold text-red-600">
                    {uploadStats.failed}
                  </div>
                  <p className="text-xs text-gray-500">Failed</p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState 
              icon={Upload}
              title="No file uploads yet"
              description="Upload documents to see processing success rates"
            />
          )}
        </CardContent>
      </Card>

      {/* Flashcard Generation Trends */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
            Flashcard Generation Trends
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Daily flashcard creation activity
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          {flashcardData.length > 0 ? (
            <ChartContainer config={chartConfig} className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={flashcardData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis fontSize={10} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="flashcards" 
                    stroke="var(--color-flashcards)" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          ) : (
            <EmptyState 
              icon={CreditCard}
              title="No flashcards generated yet"
              description="Create flashcards from your notes to see generation trends"
            />
          )}
        </CardContent>
      </Card>

      {/* Content Creation Summary */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 flex-shrink-0" />
            Content Creation Summary
          </CardTitle>
          <p className="text-xs sm:text-sm text-gray-500">
            Overall content creation metrics
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 pt-0">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {notes?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Total Notes</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-1">
                {uploads?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Files Uploaded</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {flashcards?.length || 0}
              </div>
              <p className="text-xs text-gray-500">Flashcards</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentCreationAnalytics;
