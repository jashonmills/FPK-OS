import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Bold, Italic, Sparkles } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCaptionPreferences } from "@/hooks/useCaptionPreferences";

export interface CaptionStyle {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  bold?: boolean;
  italic?: boolean;
}

interface CaptionFormattingProps {
  style: CaptionStyle;
  onStyleChange: (style: CaptionStyle) => void;
  showTemplates?: boolean;
}

const FONT_FAMILIES = [
  { value: "inter", label: "Inter (Default)", font: "Inter" },
  { value: "playfair", label: "Playfair Display", font: "Playfair Display" },
  { value: "roboto", label: "Roboto", font: "Roboto" },
];

const FONT_SIZES = [
  { value: "sm", label: "Small" },
  { value: "base", label: "Medium" },
  { value: "lg", label: "Large" },
];

const COLORS = [
  { value: "#FFFFFF", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#EF4444", label: "Red" },
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Orange" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#EC4899", label: "Pink" },
];

export const CaptionFormatting = ({ style, onStyleChange, showTemplates = false }: CaptionFormattingProps) => {
  const { allTemplates } = useCaptionPreferences();
  
  return (
    <div className="flex flex-col gap-3 p-3 border rounded-lg bg-muted/30">
      <Label className="text-xs font-semibold">Caption Formatting</Label>
      
      {showTemplates && (
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <Select
            value=""
            onValueChange={(templateId) => {
              const template = allTemplates.find(t => t.id === templateId);
              if (template) onStyleChange(template.style);
            }}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Apply template..." />
            </SelectTrigger>
            <SelectContent>
              {allTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id} className="text-xs">
                  {template.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {/* Font Family */}
        <div className="flex-1 min-w-[140px]">
          <Select
            value={style.fontFamily || "inter"}
            onValueChange={(value) => onStyleChange({ ...style, fontFamily: value })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value} className="text-xs">
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Font Size */}
        <div className="w-[100px]">
          <Select
            value={style.fontSize || "base"}
            onValueChange={(value) => onStyleChange({ ...style, fontSize: value })}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value} className="text-xs">
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Picker */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <div 
                className="w-4 h-4 rounded border"
                style={{ backgroundColor: style.color || "#000000" }}
              />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-4 gap-2">
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: color.value,
                    borderColor: style.color === color.value ? "#8B5CF6" : "#E5E7EB"
                  }}
                  onClick={() => onStyleChange({ ...style, color: color.value })}
                  title={color.label}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Bold */}
        <Button
          variant={style.bold ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onStyleChange({ ...style, bold: !style.bold })}
        >
          <Bold className="w-4 h-4" />
        </Button>

        {/* Italic */}
        <Button
          variant={style.italic ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => onStyleChange({ ...style, italic: !style.italic })}
        >
          <Italic className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export const getCaptionStyles = (style: CaptionStyle): React.CSSProperties => {
  const fontFamilyMap: Record<string, string> = {
    inter: "Inter, sans-serif",
    playfair: "Playfair Display, serif",
    roboto: "Roboto, sans-serif",
  };

  const fontSizeMap: Record<string, string> = {
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
  };

  return {
    fontFamily: fontFamilyMap[style.fontFamily || "inter"],
    fontSize: fontSizeMap[style.fontSize || "base"],
    color: style.color || "#000000",
    fontWeight: style.bold ? "bold" : "normal",
    fontStyle: style.italic ? "italic" : "normal",
  };
};
