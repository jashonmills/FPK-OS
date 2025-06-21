
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, Filter, Grid, List } from 'lucide-react';

const Library = () => {
  return (
    <div className="mobile-page-container">
      <div className="mobile-section-spacing">
        <h1 className="mobile-heading-xl text-gray-900 mb-2">Library</h1>
        <p className="text-muted-foreground mobile-text-base mb-6">
          Discover and read from our collection of books and resources
        </p>
      </div>
      
      {/* Mobile Search Bar */}
      <div className="mobile-section-spacing">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            className="mobile-input pl-10"
          />
        </div>
      </div>

      {/* Mobile Filter Controls */}
      <div className="mobile-section-spacing">
        <div className="flex items-center gap-3 overflow-x-auto pb-2">
          <Button variant="outline" size="sm" className="mobile-button flex-shrink-0">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm" className="mobile-button flex-shrink-0">
            <Grid className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button variant="outline" size="sm" className="mobile-button flex-shrink-0">
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Mobile Book Grid */}
      <div className="mobile-grid-2">
        {[1, 2, 3, 4, 5, 6].map((book) => (
          <Card key={book} className="mobile-card-interactive">
            <CardContent className="mobile-card-compact">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mobile-text-sm font-semibold mb-1 line-clamp-2">
                Sample Book Title {book}
              </h3>
              <p className="mobile-text-xs text-muted-foreground mb-2">
                Author Name
              </p>
              <Button size="sm" className="mobile-button w-full">
                Read Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="mobile-section-spacing text-center">
        <Button variant="outline" className="mobile-button">
          Load More Books
        </Button>
      </div>
    </div>
  );
};

export default Library;
