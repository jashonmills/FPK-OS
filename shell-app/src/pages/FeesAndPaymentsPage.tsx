// shell-app/src/pages/FeesAndPaymentsPage.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { DollarSign, TrendingUp, AlertOctagon, Receipt, FilePlus, Settings, Bell, CreditCard } from "lucide-react";

// --- ADVANCED MOCK DATA & COMPONENTS ---
const mockInvoices = [
  { id: "INV-0123", studentName: "Sarah Johnson", amount: "€1,500.00", dueDate: "2025-12-15", status: "Paid", datePaid: "2025-12-01" },
  { id: "INV-0124", studentName: "Michael O’Brien", amount: "€1,550.00", dueDate: "2025-12-15", status: "Overdue", datePaid: null },
  { id: "INV-0125", studentName: "Emma Walsh", amount: "€75.00", dueDate: "2025-12-20", status: "Pending", datePaid: null },
];

const mockFeeTemplates = [
  { id: "TPL-01", name: "Standard Tuition - Grade 10", amount: "€1,500.00", description: "Core tuition for Grade 10 students." },
  { id: "TPL-02", name: "After-School Care (Full Time)", amount: "€250.00 / month", description: "Daily after-school supervision." },
  { id: "TPL-03", name: "Bus Service - Zone A", amount: "€50.00 / month", description: "Monthly fee for bus transport in Zone A." },
];

const RevenueChart = () => (
  <div className="h-72 w-full bg-slate-50 rounded-lg flex items-center justify-center p-4">
    <p className="text-slate-500">A bar chart showing Revenue vs. Outstanding Receivables would be rendered here.</p>
  </div>
);

export const FeesAndPaymentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Financial Command Center</h1>
        <p className="text-slate-500 mt-1">
          Automate billing, track payments, and gain clear insights into your school's financial health.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-200/60 p-1 h-auto">
          <TabsTrigger value="dashboard" className="py-2 text-sm">
            <TrendingUp className="h-4 w-4 mr-2" />
            Financial Dashboard
          </TabsTrigger>
          <TabsTrigger value="billing" className="py-2 text-sm">
            <Receipt className="h-4 w-4 mr-2" />
            Invoice & Billing Center
          </TabsTrigger>
          <TabsTrigger value="structures" className="py-2 text-sm">
            <Settings className="h-4 w-4 mr-2" />
            Fee Structure Management
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Financial Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue (Term)</CardTitle>
                <DollarSign className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€125,430.00</div>
                <p className="text-xs text-slate-500">+15.2% from last term</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Outstanding Receivables</CardTitle>
                <AlertOctagon className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€12,870.00</div>
                <p className="text-xs text-slate-500">Across 18 invoices</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Overdue Invoices</CardTitle>
                <Bell className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-slate-500">Totaling €6,200.00</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Recent Payments (24h)</CardTitle>
                <CreditCard className="h-4 w-4 text-slate-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">€2,350.00</div>
                <p className="text-xs text-slate-500">From 3 transactions</p>
              </CardContent>
            </Card>
          </div>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Revenue vs. Receivables</CardTitle>
            </CardHeader>
            <CardContent>
              <RevenueChart />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Invoice & Billing Center */}
        <TabsContent value="billing" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Invoice Management</CardTitle>
                <div className="flex gap-2">
                  <Button>Bulk Invoice Grade</Button>
                  <Button>
                    <FilePlus className="h-4 w-4 mr-2" />
                    Create New Invoice
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockInvoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-mono text-xs">{inv.id}</TableCell>
                      <TableCell className="font-medium">{inv.studentName}</TableCell>
                      <TableCell>{inv.amount}</TableCell>
                      <TableCell>{inv.dueDate}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inv.status === "Paid"
                              ? "success"
                              : inv.status === "Overdue"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Fee Structure Management */}
        <TabsContent value="structures" className="space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Fee Templates</CardTitle>
                <Button>
                  <FilePlus className="h-4 w-4 mr-2" />
                  Create New Template
                </Button>
              </div>
              <CardDescription>
                Create and manage reusable fee structures to ensure consistency and speed up invoicing.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template Name</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFeeTemplates.map((tpl) => (
                    <TableRow key={tpl.id}>
                      <TableCell className="font-medium">{tpl.name}</TableCell>
                      <TableCell>{tpl.amount}</TableCell>
                      <TableCell className="text-slate-600">{tpl.description}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FeesAndPaymentsPage;
