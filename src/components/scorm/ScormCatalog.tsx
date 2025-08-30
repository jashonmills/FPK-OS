import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Clock, BarChart3, Search, UserPlus } from "lucide-react";
import { useScormPackages } from "@/hooks/useScormPackages";

export function ScormCatalog() {
  const { packages, isLoading, error } = useScormPackages();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPackages, setFilteredPackages] = useState(packages || []);

  useEffect(() => {
    if (!packages) return;
    
    // Only show ready packages in catalog
    const published = packages.filter(pkg => pkg.status === 'ready');
    const filtered = published.filter(pkg =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPackages(filtered);
  }, [packages, searchTerm]);

  const mockStats = {
    enrolled: 24,
    completed: 18,
    avgScore: 85,
    avgTime: "45 min"
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading catalog...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>Error loading catalog: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>SCORM Catalog</CardTitle>
          <CardDescription>
            Assign published SCORM packages to learners and track progress
          </CardDescription>
          <div className="flex items-center space-x-2 pt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search published packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Package Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPackages.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No published packages</h3>
            <p className="text-muted-foreground">
              {searchTerm 
                ? "No packages match your search criteria." 
                : "Publish SCORM packages to make them available for assignment."
              }
            </p>
          </div>
        ) : (
          filteredPackages.map((pkg) => (
            <Card key={pkg.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-lg leading-tight">{pkg.title}</CardTitle>
                    <Badge variant="outline">SCORM 1.2</Badge>
                  </div>
                  <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <UserPlus className="mr-1 h-3 w-3" />
                    Assign
                  </Button>
                </div>
                <CardDescription className="line-clamp-2">
                  {pkg.description || "No description available"}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Package Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{mockStats.enrolled}</p>
                      <p className="text-xs text-muted-foreground">Enrolled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{mockStats.completed}</p>
                      <p className="text-xs text-muted-foreground">Completed</p>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Score:</span>
                    <span className="font-medium">{mockStats.avgScore}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Time:</span>
                    <span className="font-medium">{mockStats.avgTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Completion Rate:</span>
                    <span className="font-medium">
                      {Math.round((mockStats.completed / mockStats.enrolled) * 100)}%
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="mr-1 h-3 w-3" />
                    Analytics
                  </Button>
                  <Button size="sm" className="flex-1">
                    <UserPlus className="mr-1 h-3 w-3" />
                    Assign
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assignment Summary */}
      {filteredPackages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assignment Summary</CardTitle>
            <CardDescription>Overview of current assignments and enrollment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{filteredPackages.length}</p>
                <p className="text-sm text-muted-foreground">Published Packages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mockStats.enrolled * filteredPackages.length}</p>
                <p className="text-sm text-muted-foreground">Total Enrollments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mockStats.completed * filteredPackages.length}</p>
                <p className="text-sm text-muted-foreground">Completions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{mockStats.avgScore}%</p>
                <p className="text-sm text-muted-foreground">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}