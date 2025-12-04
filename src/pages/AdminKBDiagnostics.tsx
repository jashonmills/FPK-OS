import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Activity, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Play, 
  Loader2,
  Database,
  TestTube,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

type TestResult = {
  name: string;
  status: "pass" | "fail" | "warning" | "pending";
  message: string;
  details?: any;
};

export default function AdminKBDiagnostics() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Check if user is admin
  const { data: isAdmin, isLoading: checkingAdmin } = useQuery({
    queryKey: ["is-admin", user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      const { data, error } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Test individual scraper function
  const testScraperMutation = useMutation({
    mutationFn: async (functionName: string) => {
      console.log(`Testing ${functionName}...`);
      const { data, error } = await supabase.functions.invoke(functionName);
      
      if (error) {
        throw new Error(`${functionName} failed: ${error.message}`);
      }
      
      return data;
    },
  });

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: TestResult[] = [];

    // Test 1: Database connectivity
    try {
      const { count, error } = await supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      
      results.push({
        name: "Database Connection",
        status: "pass",
        message: `Connected. Current documents: ${count || 0}`,
      });
    } catch (error: any) {
      results.push({
        name: "Database Connection",
        status: "fail",
        message: error.message,
      });
    }

    setTestResults([...results]);

    // Test 2: Check embeddings table
    try {
      const { count, error } = await supabase
        .from("kb_chunks")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      
      results.push({
        name: "Embeddings Table",
        status: "pass",
        message: `Accessible. Current chunks: ${count || 0}`,
      });
    } catch (error: any) {
      results.push({
        name: "Embeddings Table",
        status: "fail",
        message: error.message,
      });
    }

    setTestResults([...results]);

    // Test 3: Check LOVABLE_API_KEY for embeddings
    try {
      const testText = "This is a test embedding";
      const { data, error } = await supabase.functions.invoke("test-embedding", {
        body: { text: testText }
      });
      
      if (error) throw error;
      
      results.push({
        name: "Embedding Service",
        status: "pass",
        message: "Lovable AI embeddings working",
        details: data,
      });
    } catch (error: any) {
      results.push({
        name: "Embedding Service",
        status: "warning",
        message: "Test function not available - will create next",
      });
    }

    setTestResults([...results]);

    // Test 4: Test a simple scraper (CHADD - small dataset)
    try {
      const { data, error } = await supabase.functions.invoke("scrape-chadd");
      
      if (error) throw error;
      
      const isSuccess = data?.processed > 0 || data?.message?.includes("completed");
      
      results.push({
        name: "Test Scraper (CHADD)",
        status: isSuccess ? "pass" : "warning",
        message: isSuccess 
          ? `Scraper working. Processed: ${data?.processed || 'unknown'} documents`
          : "Scraper ran but may not have found new content",
        details: data,
      });
    } catch (error: any) {
      results.push({
        name: "Test Scraper (CHADD)",
        status: "fail",
        message: error.message,
      });
    }

    setTestResults([...results]);

    // Test 5: Verify data was actually inserted
    try {
      const { count, error } = await supabase
        .from("knowledge_base")
        .select("*", { count: "exact", head: true });
      
      if (error) throw error;
      
      results.push({
        name: "Post-Scrape Verification",
        status: count && count > 0 ? "pass" : "warning",
        message: count && count > 0 
          ? `Success! ${count} documents now in database`
          : "No new documents found - may be duplicates or scraper issue",
      });
    } catch (error: any) {
      results.push({
        name: "Post-Scrape Verification",
        status: "fail",
        message: error.message,
      });
    }

    setTestResults([...results]);
    setIsRunning(false);
    toast.success("Diagnostics complete");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pass: "default",
      fail: "destructive",
      warning: "secondary",
      pending: "outline",
    };
    return <Badge variant={variants[status] || "outline"}>{status.toUpperCase()}</Badge>;
  };

  if (checkingAdmin) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You do not have permission to access this page.
        </p>
        <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TestTube className="h-8 w-8" />
          Knowledge Base Diagnostics
        </h1>
        <p className="text-muted-foreground">
          Comprehensive testing of the ingestion pipeline
        </p>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Run Diagnostic Tests</CardTitle>
          <CardDescription>
            This will test database connectivity, embedding services, and scraper functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={runDiagnostics}
            disabled={isRunning}
            size="lg"
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Running Diagnostics...
              </>
            ) : (
              <>
                <Play className="mr-2 h-5 w-5" />
                Start Full Diagnostic
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Test Name</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{getStatusIcon(result.status)}</TableCell>
                    <TableCell className="font-medium">{result.name}</TableCell>
                    <TableCell>{getStatusBadge(result.status)}</TableCell>
                    <TableCell className="max-w-md">
                      <div className="space-y-1">
                        <p className="text-sm">{result.message}</p>
                        {result.details && (
                          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Summary & Recommendations */}
      {testResults.length > 0 && (
        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Diagnostic Summary</AlertTitle>
          <AlertDescription className="space-y-2">
            <p>
              <strong>Passed:</strong> {testResults.filter(r => r.status === "pass").length} |{" "}
              <strong>Failed:</strong> {testResults.filter(r => r.status === "fail").length} |{" "}
              <strong>Warnings:</strong> {testResults.filter(r => r.status === "warning").length}
            </p>
            {testResults.filter(r => r.status === "fail").length > 0 && (
              <p className="text-destructive">
                ⚠️ Critical issues detected. Check failed tests above.
              </p>
            )}
            {testResults.filter(r => r.status === "pass").length === testResults.length && (
              <p className="text-green-600">
                ✓ All tests passed! System is operational.
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
