import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Globe, Rss, RefreshCw, CalendarClock } from "lucide-react";

export const WebsiteSettingsPage = () => {
  const schoolWebsiteUrl = "https://www.example.com"; // placeholder; normally from config/api

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Website Integration Hub</h1>
        <p className="text-slate-500 mt-1">
          Manage your public website integration and AI content ingestion.
        </p>
      </div>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList className="bg-slate-200/70 p-1 rounded-lg">
          <TabsTrigger value="preview">Display & Ingestion</TabsTrigger>
        </TabsList>

        <TabsContent value="preview">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column: controls */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary-600" />
                    Display Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800">School Website URL</p>
                    <Input id="website-url" defaultValue={schoolWebsiteUrl} />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="font-semibold text-slate-800">Enable Website Preview</p>
                      <p className="text-sm text-slate-500">Show the website to all users.</p>
                    </div>
                    <Checkbox id="preview-toggle" defaultChecked aria-label="Enable preview" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Rss className="h-5 w-5 text-primary-600" />
                    Content Ingestion Engine
                  </CardTitle>
                  <CardDescription>
                    Keep the AI up-to-date by scraping your website's news and updates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-slate-800">Target URL for Scraping</p>
                    <Input id="scrape-url" placeholder="e.g., https://www.example.com/news" />
                  </div>
                  <Button className="w-full">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Scrape Now
                  </Button>
                  <div className="border-t pt-4 space-y-4">
                    <p className="text-sm font-semibold text-slate-800">Scheduled Scrape</p>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-semibold text-slate-800">Monthly Scrape</p>
                        <p className="text-sm text-slate-500">Run automatically on the 1st.</p>
                      </div>
                      <Checkbox id="schedule-toggle" aria-label="Enable monthly scrape" />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <CalendarClock className="h-4 w-4 text-primary-600" />
                      Next scheduled run: Jan 1, 09:00
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column: preview */}
            <div className="lg:col-span-2">
              <Card className="shadow-sm h-full">
                <CardHeader>
                  <CardTitle>Live Website Preview</CardTitle>
                  <CardDescription>Verify how the public site appears inside the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="w-full h-[75vh] border rounded-lg overflow-hidden bg-slate-100">
                    <iframe
                      src={schoolWebsiteUrl}
                      className="w-full h-full"
                      title="School Website Preview"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteSettingsPage;
