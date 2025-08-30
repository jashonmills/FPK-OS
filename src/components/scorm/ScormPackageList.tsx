import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  MoreVertical, 
  Play, 
  Users, 
  BarChart3, 
  Settings, 
  Archive,
  Trash2,
  Upload,
  Package
} from "lucide-react";
import { useScormPackages } from "@/hooks/useScormPackages";
import { formatDistanceToNow } from "date-fns";

export function ScormPackageList() {
  const navigate = useNavigate();
  const { packages, isLoading, error } = useScormPackages();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Use useMemo instead of useState + useEffect to prevent infinite loops
  const filteredPackages = useMemo(() => {
    if (!packages) return [];
    
    return packages.filter(pkg =>
      pkg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pkg.version?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [packages, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'parsed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'uploaded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    }
  };

  const handlePreview = (packageId: string) => {
    navigate(`/scorm/player/${packageId}`);
  };

  const handleManage = (packageId: string) => {
    navigate(`/dashboard/scorm/packages/${packageId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Loading packages...</span>
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
            <p>Error loading packages: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>SCORM Packages</CardTitle>
              <CardDescription>
                Manage your uploaded SCORM packages and their deployments
              </CardDescription>
            </div>
            <Button onClick={() => navigate("/dashboard/scorm/upload")}>
              <Upload className="mr-2 h-4 w-4" />
              Upload New Package
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Packages List */}
      <Card>
        <CardContent className="p-0">
          {filteredPackages.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No SCORM packages found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "No packages match your search criteria." : "Upload your first SCORM package to get started."}
              </p>
              {!searchTerm && (
                <Button onClick={() => navigate("/dashboard/scorm/upload")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Package
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Package</TableHead>
                  <TableHead>Standard</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>SCOs</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{pkg.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {pkg.description || "No description provided"}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {pkg.version || 'SCORM 1.2'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(pkg.status)}>
                        {pkg.status || 'uploaded'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">0</span>
                      <span className="text-sm text-muted-foreground ml-1">SCOs</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {pkg.updated_at 
                        ? formatDistanceToNow(new Date(pkg.updated_at), { addSuffix: true })
                        : "Unknown"
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handlePreview(pkg.id)}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Preview
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleManage(pkg.id)}>
                              <Settings className="mr-2 h-4 w-4" />
                              Manage
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/scorm/packages/${pkg.id}/enrollments`)}>
                              <Users className="mr-2 h-4 w-4" />
                              Enrollments
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => navigate(`/dashboard/scorm/packages/${pkg.id}/analytics`)}>
                              <BarChart3 className="mr-2 h-4 w-4" />
                              Analytics
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}