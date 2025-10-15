/**
 * Platform Guide Viewer
 * Comprehensive documentation system for FPK University Platform
 */

import React, { useState, useMemo } from 'react';
import { Search, Home, BookOpen, ChevronRight, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { organizationOwnerGuide, allGuideEntries } from '@/data/platform-guide';
import { GuideEntry } from '@/types/platform-guide';

export default function PlatformGuide() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<GuideEntry | null>(null);

  // Search functionality
  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return allGuideEntries;
    
    const query = searchQuery.toLowerCase();
    return allGuideEntries.filter(entry =>
      entry.title.toLowerCase().includes(query) ||
      entry.description.toLowerCase().includes(query) ||
      entry.userPurpose.toLowerCase().includes(query) ||
      entry.subsection?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">FPK University Platform Guide</h1>
              <p className="text-muted-foreground">Comprehensive documentation for every feature</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search features, interactions, data fields..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Guide List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  Dashboard Guide
                </CardTitle>
                <CardDescription>
                  {filteredEntries.length} feature{filteredEntries.length !== 1 ? 's' : ''} documented
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-1 p-4">
                    {filteredEntries.map((entry) => (
                      <button
                        key={entry.id}
                        onClick={() => setSelectedEntry(entry)}
                        className={`w-full text-left p-3 rounded-lg transition-colors hover:bg-muted ${
                          selectedEntry?.id === entry.id ? 'bg-muted' : ''
                        }`}
                      >
                        <div className="font-medium text-sm">{entry.title}</div>
                        {entry.subsection && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {entry.subsection}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Selected Entry Details */}
          <div className="lg:col-span-2">
            {selectedEntry ? (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      {selectedEntry.subsection && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span>{selectedEntry.section}</span>
                          <ChevronRight className="h-4 w-4" />
                          <span>{selectedEntry.subsection}</span>
                        </div>
                      )}
                      <CardTitle className="text-2xl">{selectedEntry.title}</CardTitle>
                      <CardDescription className="mt-2">{selectedEntry.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedEntry.accessLevel.map((level) => (
                      <Badge key={level} variant="outline">{level}</Badge>
                    ))}
                  </div>
                  
                  {selectedEntry.route && (
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      <code className="bg-muted px-2 py-1 rounded text-xs">{selectedEntry.route}</code>
                    </div>
                  )}
                </CardHeader>

                <CardContent>
                  <Tabs defaultValue="purpose" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="purpose">Purpose</TabsTrigger>
                      <TabsTrigger value="interactions">Interactions</TabsTrigger>
                      <TabsTrigger value="data">Data</TabsTrigger>
                      <TabsTrigger value="related">Related</TabsTrigger>
                    </TabsList>

                    <TabsContent value="purpose" className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">User Purpose</h3>
                        <p className="text-sm text-muted-foreground">{selectedEntry.userPurpose}</p>
                      </div>
                      
                      {selectedEntry.component && (
                        <div>
                          <h3 className="font-semibold mb-2">Component</h3>
                          <code className="bg-muted px-2 py-1 rounded text-xs">{selectedEntry.component}</code>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="interactions" className="space-y-4">
                      {selectedEntry.interactions.length > 0 ? (
                        selectedEntry.interactions.map((interaction, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <h4 className="font-semibold text-sm mb-2">{interaction.element}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Action:</span>
                                <p className="mt-1">{interaction.action}</p>
                              </div>
                              <Separator />
                              <div>
                                <span className="text-muted-foreground">Outcome:</span>
                                <p className="mt-1">{interaction.outcome}</p>
                              </div>
                              {interaction.technicalDetails && (
                                <>
                                  <Separator />
                                  <div>
                                    <span className="text-muted-foreground">Technical:</span>
                                    <p className="mt-1 font-mono text-xs bg-muted p-2 rounded">
                                      {interaction.technicalDetails}
                                    </p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No interactions documented</p>
                      )}
                    </TabsContent>

                    <TabsContent value="data" className="space-y-4">
                      {selectedEntry.dataDisplayed.length > 0 ? (
                        selectedEntry.dataDisplayed.map((data, idx) => (
                          <div key={idx} className="border rounded-lg p-4">
                            <h4 className="font-semibold text-sm mb-2">{data.field}</h4>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Source:</span>
                                <p className="mt-1 font-mono text-xs">{data.source}</p>
                              </div>
                              {data.calculation && (
                                <>
                                  <Separator />
                                  <div>
                                    <span className="text-muted-foreground">Calculation:</span>
                                    <p className="mt-1 font-mono text-xs bg-muted p-2 rounded">
                                      {data.calculation}
                                    </p>
                                  </div>
                                </>
                              )}
                              {data.refreshRate && (
                                <>
                                  <Separator />
                                  <div>
                                    <span className="text-muted-foreground">Refresh Rate:</span>
                                    <p className="mt-1">{data.refreshRate}</p>
                                  </div>
                                </>
                              )}
                              <Separator />
                              <div>
                                <span className="text-muted-foreground">Significance:</span>
                                <p className="mt-1">{data.significance}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No data fields documented</p>
                      )}
                    </TabsContent>

                    <TabsContent value="related">
                      {selectedEntry.relatedFeatures.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {selectedEntry.relatedFeatures.map((feature, idx) => (
                            <Badge key={idx} variant="secondary">{feature}</Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No related features documented</p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex items-center justify-center min-h-[500px]">
                  <div className="text-center">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Select a Feature</h3>
                    <p className="text-muted-foreground">
                      Choose a feature from the list to view detailed documentation
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
