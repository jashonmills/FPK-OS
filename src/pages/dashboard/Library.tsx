import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Search, BookOpen, Filter, Grid, List, Upload, Users, Globe } from 'lucide-react';
import { usePublicDomainBooks } from '@/hooks/usePublicDomainBooks';
import { useOpenLibrarySearch } from '@/hooks/useOpenLibrarySearch';
import LibraryWithMonitoring from '@/components/library/LibraryWithMonitoring';
import PublicDomainBooksSection from '@/components/library/PublicDomainBooksSection';
import UserUploadsSection from '@/components/library/UserUploadsSection';
import ApprovedStorageBooksSection from '@/components/library/ApprovedStorageBooksSection';
import CommunityLibraryContent from '@/components/library/CommunityLibraryContent';

type ViewMode = 'grid' | 'list';

const Library = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [activeTab, setActiveTab] = useState('public-domain');
  
  const { books: publicDomainBooks, isLoading: pdLoading } = usePublicDomainBooks();
  const { 
    books: searchResults, 
    isLoading: searchLoading, 
    searchBooks,
    clearResults 
  } = useOpenLibrarySearch();

  // Handle search
  const handleSearch = async (query: string) => {
    if (query.trim()) {
      await searchBooks(query);
      setActiveTab('search-results');
    } else {
      clearResults();
    }
  };

  // Auto-search when query changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        clearResults();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const renderPublicDomainSection = () => (
    <PublicDomainBooksSection 
      viewMode={viewMode}
    />
  );

  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200"></div>
              <CardContent className="p-3">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!searchResults?.length) {
      return (
        <div className="text-center py-12">
          <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No results found' : 'Search the library'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? `No books found for "${searchQuery}". Try a different search term.`
              : 'Enter a search term to find books from millions of titles.'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Found {searchResults.length} results for "{searchQuery}"
        </p>
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          : "space-y-4"
        }>
          {searchResults.map((book) => (
            <Card key={book.key} className="hover:shadow-md transition-shadow">
              {viewMode === 'grid' ? (
                <div>
                  <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                    {book.cover_i ? (
                      <img
                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                        alt={book.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <BookOpen className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                      {book.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {book.author_name?.[0] || 'Unknown Author'}
                    </p>
                    {book.first_publish_year && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {book.first_publish_year}
                      </p>
                    )}
                  </CardContent>
                </div>
              ) : (
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-20 bg-gray-100 flex items-center justify-center flex-shrink-0">
                      {book.cover_i ? (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-S.jpg`}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <BookOpen className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-sm line-clamp-2 mb-1">
                        {book.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {book.author_name?.[0] || 'Unknown Author'}
                      </p>
                      {book.first_publish_year && (
                        <p className="text-xs text-muted-foreground">
                          Published: {book.first_publish_year}
                        </p>
                      )}
                      {book.subject && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                          Subjects: {book.subject.slice(0, 3).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <LibraryWithMonitoring>
      <div className="container mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Library</h1>
            <p className="text-muted-foreground">
              Discover, read, and organize your digital book collection
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search millions of books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
            
            <ToggleGroup 
              type="single" 
              value={viewMode} 
              onValueChange={(value) => value && setViewMode(value as ViewMode)}
              className="border rounded-md"
            >
              <ToggleGroupItem value="grid" aria-label="Grid view">
                <Grid className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">Grid</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view">
                <List className="h-4 w-4" />
                <span className="ml-2 hidden sm:inline">List</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        {/* Library Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="public-domain" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Public Domain</span>
              <span className="sm:hidden">Public</span>
            </TabsTrigger>
            <TabsTrigger value="uploads" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Your Uploads</span>
              <span className="sm:hidden">Uploads</span>
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
              <span className="sm:hidden">Community</span>
            </TabsTrigger>
            <TabsTrigger value="search-results" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search Results</span>
              <span className="sm:hidden">Search</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="public-domain" className="mt-6">
            {renderPublicDomainSection()}
          </TabsContent>

          <TabsContent value="uploads" className="mt-6">
            <UserUploadsSection />
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <ApprovedStorageBooksSection />
          </TabsContent>

          <TabsContent value="search-results" className="mt-6">
            {renderSearchResults()}
          </TabsContent>
        </Tabs>
      </div>
    </LibraryWithMonitoring>
  );
};

export default Library;
