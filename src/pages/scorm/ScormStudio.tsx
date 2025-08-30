import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Package, FileText, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ScormStudio = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SCORM Studio</h1>
          <p className="text-muted-foreground">Upload, parse, and manage SCORM packages</p>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload SCORM Package
          </CardTitle>
          <CardDescription>
            Upload a SCORM 1.2 or SCORM 2004 package (.zip file) to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Drop your SCORM package here</h3>
            <p className="text-muted-foreground mb-4">or click to browse files</p>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Packages</CardTitle>
          <CardDescription>Your recently uploaded SCORM packages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Placeholder for recent packages */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-accent flex items-center justify-center">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">Sample SCORM Package</h4>
                  <p className="text-sm text-muted-foreground">Uploaded 2 hours ago • 3 SCOs</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-1" />
                  Preview
                </Button>
                <Button size="sm">
                  Manage
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Package className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold">View All Packages</h3>
            <p className="text-sm text-muted-foreground">Browse and manage all SCORM packages</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold">Documentation</h3>
            <p className="text-sm text-muted-foreground">Learn about SCORM standards and best practices</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6 text-center">
            <Play className="h-8 w-8 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold">Preview Player</h3>
            <p className="text-sm text-muted-foreground">Test your SCORM content in the player</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScormStudio;