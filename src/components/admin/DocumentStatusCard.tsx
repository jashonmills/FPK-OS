import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface DocumentStatusCardProps {
  document: any;
}

export function DocumentStatusCard({ document }: DocumentStatusCardProps) {
  const status = document.metadata?.extraction_status || 'pending';
  
  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'failed': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'processing': return <Clock className="h-5 w-5 text-blue-600 animate-spin" />;
      default: return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm truncate">{document.file_name}</CardTitle>
          {getStatusIcon()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={status === 'completed' ? 'default' : status === 'failed' ? 'destructive' : 'secondary'}>
              {status}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Size:</span>
            <span>{document.file_size_kb} KB</span>
          </div>
          {document.metadata?.extraction_attempts && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Attempts:</span>
              <span>{document.metadata.extraction_attempts}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
