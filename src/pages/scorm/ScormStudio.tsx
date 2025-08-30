import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Package, FileText, Play, Users, BarChart3, Settings } from "lucide-react";
import { ScormUploader } from "@/components/scorm/ScormUploader";
import { ScormPackageList } from "@/components/scorm/ScormPackageList";
import { ScormAnalytics } from "@/components/scorm/ScormAnalytics";
import { ScormCatalog } from "@/components/scorm/ScormCatalog";

export default function ScormStudio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("packages");

  const quickActions = [
    {
      title: "Upload Package",
      description: "Upload a new SCORM package",
      icon: Upload,
      action: () => setActiveTab("upload"),
      variant: "default" as const
    },
    {
      title: "View Packages",
      description: "Manage your SCORM packages",
      icon: Package,
      action: () => setActiveTab("packages"),
      variant: "outline" as const
    },
    {
      title: "Preview Player",
      description: "Test SCORM content playback",
      icon: Play,
      action: () => navigate("/scorm/player/preview"),
      variant: "outline" as const
    },
    {
      title: "Documentation",
      description: "SCORM implementation guide",
      icon: FileText,
      action: () => window.open("https://docs.lovable.dev", "_blank"),
      variant: "outline" as const
    }
  ];

  const stats = [
    { title: "Total Packages", value: "12", icon: Package },
    { title: "Active Enrollments", value: "45", icon: Users },
    { title: "Completion Rate", value: "78%", icon: BarChart3 },
    { title: "Avg Score", value: "85%", icon: Settings }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">SCORM Studio</h1>
          <p className="text-muted-foreground">
            Upload, manage, and deploy SCORM packages for your learning platform
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <stat.icon className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="packages">Packages</TabsTrigger>
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="catalog">Catalog</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <ScormPackageList />
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upload SCORM Package</CardTitle>
              <CardDescription>
                Upload SCORM 1.2 or 2004 packages to your learning library
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScormUploader onUploadComplete={() => setActiveTab("packages")} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-4">
          <ScormCatalog />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <ScormAnalytics />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={action.action}
              >
                <action.icon className="h-8 w-8" />
                <div className="text-center">
                  <p className="font-semibold">{action.title}</p>
                  <p className="text-xs opacity-70">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}