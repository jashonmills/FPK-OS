import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Trash2, Plus, Sparkles } from "lucide-react";
import { CaptionFormatting, CaptionStyle, getCaptionStyles } from "@/components/messaging/CaptionFormatting";
import { useCaptionPreferences, CAPTION_TEMPLATES } from "@/hooks/useCaptionPreferences";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CaptionSettings() {
  const navigate = useNavigate();
  const {
    defaultStyle,
    setDefaultStyle,
    customTemplates,
    addCustomTemplate,
    removeCustomTemplate,
  } = useCaptionPreferences();

  const [previewStyle, setPreviewStyle] = useState<CaptionStyle>(defaultStyle);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [showNewTemplateForm, setShowNewTemplateForm] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);

  const handleSetDefault = () => {
    setDefaultStyle(previewStyle);
    toast.success("Default caption style updated");
  };

  const handleCreateTemplate = () => {
    if (!newTemplateName.trim()) {
      toast.error("Please enter a template name");
      return;
    }

    if (newTemplateName.length > 30) {
      toast.error("Template name must be 30 characters or less");
      return;
    }

    const success = addCustomTemplate(newTemplateName.trim(), previewStyle);
    if (success) {
      toast.success(`Template "${newTemplateName}" created`);
      setNewTemplateName("");
      setShowNewTemplateForm(false);
    } else {
      toast.error("A template with this name already exists");
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplateToDelete(templateId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (templateToDelete) {
      const template = customTemplates.find(t => t.id === templateToDelete);
      removeCustomTemplate(templateToDelete);
      toast.success(`Template "${template?.name}" deleted`);
      setTemplateToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Caption Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize your default caption style and manage templates
          </p>
        </div>

        <div className="grid gap-6">
          {/* Default Caption Style */}
          <Card>
            <CardHeader>
              <CardTitle>Default Caption Style</CardTitle>
              <CardDescription>
                This style will be automatically applied to new image captions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <CaptionFormatting
                style={previewStyle}
                onStyleChange={setPreviewStyle}
                showTemplates={true}
              />
              
              <div className="p-4 border rounded-lg bg-muted/30">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Preview:
                </Label>
                <p style={getCaptionStyles(previewStyle)}>
                  This is how your caption will look
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSetDefault} className="flex-1">
                  Save as Default
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPreviewStyle(defaultStyle)}
                >
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Built-in Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Built-in Templates
              </CardTitle>
              <CardDescription>
                Quick preset styles for common caption needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2">
                {CAPTION_TEMPLATES.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-sm">{template.name}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs"
                        onClick={() => setPreviewStyle(template.style)}
                      >
                        Try
                      </Button>
                    </div>
                    <p
                      style={getCaptionStyles(template.style)}
                      className="text-sm"
                    >
                      Sample caption text
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Templates */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Custom Templates</CardTitle>
                  <CardDescription>
                    Save your own caption styles for quick reuse
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  onClick={() => setShowNewTemplateForm(!showNewTemplateForm)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {showNewTemplateForm && (
                <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
                  <div>
                    <Label htmlFor="template-name">Template Name</Label>
                    <Input
                      id="template-name"
                      value={newTemplateName}
                      onChange={(e) => setNewTemplateName(e.target.value)}
                      placeholder="e.g., My Style"
                      maxLength={30}
                      className="mt-2"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {newTemplateName.length}/30 characters
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleCreateTemplate} className="flex-1">
                      Save Template
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowNewTemplateForm(false);
                        setNewTemplateName("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {customTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No custom templates yet. Create one to get started!
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {customTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm flex-1 truncate">
                          {template.name}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs"
                            onClick={() => setPreviewStyle(template.style)}
                          >
                            Try
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <p
                        style={getCaptionStyles(template.style)}
                        className="text-sm"
                      >
                        Sample caption text
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this custom template? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
