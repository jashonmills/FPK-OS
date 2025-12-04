import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { format } from "date-fns";

export const ExtractionMonitoringDashboard = () => {
  // Fetch recent extraction telemetry
  const { data: recentExtractions } = useQuery({
    queryKey: ["extraction-telemetry"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extraction_telemetry")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return data;
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  // Fetch circuit breaker status
  const { data: circuitBreakers } = useQuery({
    queryKey: ["circuit-breaker-status"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extraction_circuit_breaker")
        .select("*")
        .order("failure_count", { ascending: false });

      if (error) throw error;
      return data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch extraction analytics
  const { data: analytics } = useQuery({
    queryKey: ["extraction-analytics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extraction_analytics")
        .select("*")
        .limit(7); // Last 7 days

      if (error) throw error;
      return data;
    },
    refetchInterval: 60000, // Refresh every minute
  });

  // Calculate success rate
  const overallSuccessRate = recentExtractions
    ? ((recentExtractions.filter(e => e.success).length / recentExtractions.length) * 100).toFixed(1)
    : "0";

  const avgExtractionTime = recentExtractions
    ? (recentExtractions.reduce((sum, e) => sum + (e.extraction_time_ms || 0), 0) / recentExtractions.length / 1000).toFixed(1)
    : "0";

  const totalCost = analytics
    ? analytics.reduce((sum, a) => sum + (a.total_cost_cents || 0), 0).toFixed(2)
    : "0";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Extraction Monitoring Dashboard</h2>
        <p className="text-muted-foreground">Real-time document extraction health</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallSuccessRate}%</div>
            <p className="text-xs text-muted-foreground">Last 20 extractions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgExtractionTime}s</div>
            <p className="text-xs text-muted-foreground">Per extraction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cost</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalCost}</div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Circuit Breakers</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {circuitBreakers?.filter(cb => cb.is_disabled).length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Active blocks</p>
          </CardContent>
        </Card>
      </div>

      {/* Circuit Breaker Status */}
      {circuitBreakers && circuitBreakers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Circuit Breaker Status</CardTitle>
            <CardDescription>
              File types with repeated failures are temporarily disabled
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Consecutive Failures</TableHead>
                  <TableHead>Total Failures</TableHead>
                  <TableHead>Last Failure</TableHead>
                  <TableHead>Disabled Until</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {circuitBreakers.map((cb) => (
                  <TableRow key={cb.id}>
                    <TableCell className="font-medium">{cb.file_type}</TableCell>
                    <TableCell>
                      {cb.is_disabled ? (
                        <Badge variant="destructive">Disabled</Badge>
                      ) : (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </TableCell>
                    <TableCell>{cb.consecutive_failures}</TableCell>
                    <TableCell>{cb.failure_count}</TableCell>
                    <TableCell>
                      {cb.last_failure_at
                        ? format(new Date(cb.last_failure_at), "MMM dd, HH:mm")
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {cb.disabled_until
                        ? format(new Date(cb.disabled_until), "MMM dd, HH:mm")
                        : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Recent Extractions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Extractions</CardTitle>
          <CardDescription>Last 20 extraction attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Cost</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentExtractions?.map((extraction) => (
                <TableRow key={extraction.id}>
                  <TableCell>
                    {extraction.success ? (
                      <Badge variant="outline" className="bg-green-50">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Success
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Failed
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {extraction.file_name}
                  </TableCell>
                  <TableCell>{extraction.file_type}</TableCell>
                  <TableCell>{Math.round(extraction.file_size_kb)}KB</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{extraction.extraction_method}</Badge>
                  </TableCell>
                  <TableCell>
                    {extraction.extraction_time_ms
                      ? `${(extraction.extraction_time_ms / 1000).toFixed(1)}s`
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {extraction.api_cost_estimate
                      ? `$${extraction.api_cost_estimate.toFixed(3)}`
                      : "—"}
                  </TableCell>
                  <TableCell>{format(new Date(extraction.created_at), "MMM dd, HH:mm")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Daily Analytics */}
      {analytics && analytics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daily Analytics</CardTitle>
            <CardDescription>Extraction performance by file type</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>File Type</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Successful</TableHead>
                  <TableHead>Failed</TableHead>
                  <TableHead>Success %</TableHead>
                  <TableHead>Avg Time</TableHead>
                  <TableHead>Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.map((stat: any, idx) => {
                  const successRate = ((stat.successful / stat.total_attempts) * 100).toFixed(1);
                  return (
                    <TableRow key={idx}>
                      <TableCell>{format(new Date(stat.date), "MMM dd")}</TableCell>
                      <TableCell>{stat.file_type}</TableCell>
                      <TableCell>{stat.total_attempts}</TableCell>
                      <TableCell className="text-green-600">{stat.successful}</TableCell>
                      <TableCell className="text-destructive">{stat.failed}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {Number(successRate) >= 90 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : Number(successRate) >= 70 ? (
                            <Minus className="h-3 w-3 text-yellow-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-destructive" />
                          )}
                          {successRate}%
                        </div>
                      </TableCell>
                      <TableCell>{stat.avg_time_seconds}s</TableCell>
                      <TableCell>${(stat.total_cost_cents / 100).toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};