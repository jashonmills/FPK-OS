import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from 'date-fns';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface GovernorLog {
  id: string;
  persona: string;
  reason: string;
  severity: string;
  is_safe: boolean;
  is_on_topic: boolean;
  persona_adherence: string;
  blocked: boolean;
  created_at: string;
}

interface GovernorActivityTableProps {
  data: GovernorLog[];
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'high': return 'destructive';
    case 'medium': return 'default';
    case 'low': return 'secondary';
    default: return 'outline';
  }
};

const getAdherenceColor = (adherence: string) => {
  if (adherence.includes('correct')) return 'default';
  if (adherence.includes('violation')) return 'destructive';
  return 'secondary';
};

export const GovernorActivityTable = ({ data }: GovernorActivityTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
          <p>No governor violations detected</p>
          <p className="text-sm mt-1">All AI responses are passing quality checks!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Persona</TableHead>
            <TableHead>Issue</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Safety</TableHead>
            <TableHead>On Topic</TableHead>
            <TableHead>Adherence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="text-sm">
                {format(parseISO(log.created_at), 'MMM dd, HH:mm')}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{log.persona}</Badge>
              </TableCell>
              <TableCell className="max-w-md text-sm">
                {log.reason}
              </TableCell>
              <TableCell>
                <Badge variant={getSeverityColor(log.severity)}>
                  {log.severity}
                </Badge>
              </TableCell>
              <TableCell>
                {log.is_safe ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                {log.is_on_topic ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </TableCell>
              <TableCell>
                <Badge variant={getAdherenceColor(log.persona_adherence)} className="text-xs">
                  {log.persona_adherence.replace(/_/g, ' ')}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
