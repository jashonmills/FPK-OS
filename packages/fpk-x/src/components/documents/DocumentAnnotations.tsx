import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Highlighter, Pen, Eraser, MousePointer, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Annotation {
  type: "highlight" | "draw";
  color: string;
  points: { x: number; y: number }[];
  strokeWidth?: number;
}

interface DocumentAnnotationsProps {
  pageNumber: number;
  scale: number;
  rotation: number;
  width: number;
  height: number;
  visible?: boolean;
  onClose?: () => void;
}

export function DocumentAnnotations({ 
  pageNumber, 
  scale, 
  rotation, 
  width, 
  height,
  visible = true,
  onClose
}: DocumentAnnotationsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPath, setCurrentPath] = useState<{ x: number; y: number }[]>([]);
  const [annotations, setAnnotations] = useState<Record<number, Annotation[]>>({});
  const [tool, setTool] = useState<"select" | "highlight" | "draw">("select");
  const [color, setColor] = useState("#FFFF00");
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations for this page
    const pageAnnotations = annotations[pageNumber] || [];
    pageAnnotations.forEach((annotation) => {
      if (annotation.type === "highlight") {
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = (annotation.strokeWidth || 20) * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      } else {
        ctx.globalAlpha = 1;
        ctx.strokeStyle = annotation.color;
        ctx.lineWidth = (annotation.strokeWidth || 2) * scale;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      }

      ctx.beginPath();
      annotation.points.forEach((point, i) => {
        if (i === 0) {
          ctx.moveTo(point.x * scale, point.y * scale);
        } else {
          ctx.lineTo(point.x * scale, point.y * scale);
        }
      });
      ctx.stroke();
    });

    ctx.globalAlpha = 1;
  }, [annotations, pageNumber, scale]);

  const getCanvasCoordinates = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === "select") return;

    const { x, y } = getCanvasCoordinates(e);
    setIsDrawing(true);
    setCurrentPath([{ x, y }]);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || tool === "select") return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const { x, y } = getCanvasCoordinates(e);
    setCurrentPath((prev) => [...prev, { x, y }]);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (tool === "highlight") {
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color;
      ctx.lineWidth = 20 * scale;
    } else {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2 * scale;
    }

    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    
    const prevPoint = currentPath[currentPath.length - 1];
    ctx.moveTo(prevPoint.x * scale, prevPoint.y * scale);
    ctx.lineTo(x * scale, y * scale);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing && currentPath.length > 0) {
      const newAnnotation: Annotation = {
        type: tool === "highlight" ? "highlight" : "draw",
        color,
        points: currentPath,
        strokeWidth: tool === "highlight" ? 20 : 2,
      };

      setAnnotations((prev) => ({
        ...prev,
        [pageNumber]: [...(prev[pageNumber] || []), newAnnotation],
      }));
    }

    setIsDrawing(false);
    setCurrentPath([]);
  };

  const clearAnnotations = () => {
    setAnnotations((prev) => ({
      ...prev,
      [pageNumber]: [],
    }));
  };

  const handleToolChange = (newTool: "select" | "highlight" | "draw") => {
    setTool(newTool);
    // Auto-minimize when selecting an active tool
    if (newTool !== "select") {
      setIsMinimized(true);
    }
  };

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      <canvas
        ref={canvasRef}
        width={width * scale}
        height={height * scale}
        className={cn(
          "absolute top-0 left-0",
          tool !== "select" && "pointer-events-auto cursor-crosshair"
        )}
        style={{ width: width * scale, height: height * scale }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="absolute bottom-4 right-4 pointer-events-auto z-20">
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg">
          <div className="flex items-center gap-2 p-2 border-b">
            <span className="text-sm font-medium text-muted-foreground">Annotations</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="ml-auto h-6 w-6 p-0"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isMinimized ? (
            <div className="p-1 flex gap-1">
              <Button
                variant={tool === "select" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolChange("select")}
                className="h-8 w-8 p-0"
                title="Select"
              >
                <MousePointer className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === "highlight" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolChange("highlight")}
                className="h-8 w-8 p-0"
                title="Highlight"
              >
                <Highlighter className="h-4 w-4" />
              </Button>
              <Button
                variant={tool === "draw" ? "default" : "ghost"}
                size="sm"
                onClick={() => handleToolChange("draw")}
                className="h-8 w-8 p-0"
                title="Draw"
              >
                <Pen className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAnnotations}
                className="h-8 w-8 p-0"
                title="Clear Page"
              >
                <Eraser className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="p-2 space-y-1">
                <Button
                  variant={tool === "select" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolChange("select")}
                  className="w-full justify-start"
                >
                  <MousePointer className="h-4 w-4 mr-2" />
                  Select
                </Button>
                <Button
                  variant={tool === "highlight" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolChange("highlight")}
                  className="w-full justify-start"
                >
                  <Highlighter className="h-4 w-4 mr-2" />
                  Highlight
                </Button>
                <Button
                  variant={tool === "draw" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolChange("draw")}
                  className="w-full justify-start"
                >
                  <Pen className="h-4 w-4 mr-2" />
                  Draw
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAnnotations}
                  className="w-full justify-start"
                >
                  <Eraser className="h-4 w-4 mr-2" />
                  Clear Page
                </Button>
              </div>

              {tool !== "select" && (
                <div className="p-2 border-t">
                  <div className="text-xs text-muted-foreground mb-1">Color</div>
                  <div className="flex gap-1">
                    {["#FFFF00", "#00FF00", "#FF0000", "#0000FF", "#FF00FF"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setColor(c)}
                        className={cn(
                          "w-6 h-6 rounded border-2 transition-all",
                          color === c ? "border-foreground scale-110" : "border-border"
                        )}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
