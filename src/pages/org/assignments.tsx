import React, { useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  ClipboardList, 
  Plus, 
  Search, 
  Calendar as CalendarIcon, 
  MoreHorizontal, 
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const assignmentSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  due_at: z.date().optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

interface Assignment {
  id: string;
  title: string;
  description?: string;
  due_at?: Date;
  status: 'active' | 'completed' | 'overdue';
  assigned_count: number;
  completed_count: number;
}

// Mock data for demonstration
const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Complete Chapter 1 Reading',
    description: 'Read through the entire first chapter and answer the discussion questions.',
    due_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'active',
    assigned_count: 15,
    completed_count: 8,
  },
  {
    id: '2',
    title: 'Submit Practice Quiz',
    description: 'Complete the practice quiz on the learning platform.',
    due_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'active',
    assigned_count: 12,
    completed_count: 10,
  },
  {
    id: '3',
    title: 'Project Presentation',
    description: 'Prepare and deliver a 10-minute presentation on your chosen topic.',
    due_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    status: 'overdue',
    assigned_count: 8,
    completed_count: 5,
  },
];

export default function AssignmentsPage() {
  const { currentOrg, getUserRole } = useOrgContext();
  const { toast } = useToast();
  const userRole = getUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [activeTab, setActiveTab] = useState('active');

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view assignments.</p>
        </div>
      </div>
    );
  }

  const canManageAssignments = userRole === 'owner' || userRole === 'instructor';
  
  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'active' && assignment.status === 'active') ||
                      (activeTab === 'overdue' && assignment.status === 'overdue') ||
                      (activeTab === 'completed' && assignment.status === 'completed');
    
    return matchesSearch && matchesTab;
  });

  const handleCreateAssignment = (data: AssignmentFormData) => {
    // This would normally call an API
    console.log('Creating assignment:', data);
    toast({
      title: "Success",
      description: "Assignment created successfully.",
    });
    
    form.reset();
    setShowCreateDialog(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500';
      case 'overdue':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  const activeAssignments = mockAssignments.filter(a => a.status === 'active');
  const overdueAssignments = mockAssignments.filter(a => a.status === 'overdue');
  const completedAssignments = mockAssignments.filter(a => a.status === 'completed');

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="text-muted-foreground">
              Manage and track student assignments
            </p>
          </div>
        </div>
        
        {canManageAssignments && (
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium">Active</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold">{activeAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium">Overdue</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-red-500">{overdueAssignments.length}</div>
            <p className="text-xs text-muted-foreground">Past due date</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium">Completion Rate</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">Average completion</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium">Total Students</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Assigned students</p>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Assignments List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({activeAssignments.length})</TabsTrigger>
          <TabsTrigger value="overdue">Overdue ({overdueAssignments.length})</TabsTrigger>
          <TabsTrigger value="all">All ({mockAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Assignments</h3>
              <p className="text-muted-foreground mb-4">
                Create assignments to track student progress.
              </p>
              {canManageAssignments && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assignment
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <OrgCard key={assignment.id} className="hover:shadow-md transition-shadow">
                  <OrgCardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(assignment.status)}
                          <OrgCardTitle className="text-lg">{assignment.title}</OrgCardTitle>
                          <Badge 
                            variant="outline" 
                            className={cn("capitalize", getStatusColor(assignment.status))}
                          >
                            {assignment.status}
                          </Badge>
                        </div>
                        <OrgCardDescription className="line-clamp-2">
                          {assignment.description || 'No description provided'}
                        </OrgCardDescription>
                      </div>
                      {canManageAssignments && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => setSelectedAssignment(assignment)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </OrgCardHeader>
                  <OrgCardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{assignment.completed_count}/{assignment.assigned_count} completed</span>
                        </div>
                        {assignment.due_at && (
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                            <span>Due {format(assignment.due_at, 'MMM d, yyyy')}</span>
                          </div>
                        )}
                      </div>
                      <div className="text-muted-foreground">
                        {Math.round((assignment.completed_count / assignment.assigned_count) * 100)}% complete
                      </div>
                    </div>
                  </OrgCardContent>
                </OrgCard>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          {overdueAssignments.map((assignment) => (
            <OrgCard key={assignment.id} className="border-red-200 hover:shadow-md transition-shadow">
              {/* Same structure as active tab but with red styling */}
              <OrgCardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(assignment.status)}
                      <OrgCardTitle className="text-lg">{assignment.title}</OrgCardTitle>
                      <Badge variant="destructive">Overdue</Badge>
                    </div>
                    <OrgCardDescription className="line-clamp-2">
                      {assignment.description || 'No description provided'}
                    </OrgCardDescription>
                  </div>
                </div>
              </OrgCardHeader>
              <OrgCardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{assignment.completed_count}/{assignment.assigned_count} completed</span>
                    </div>
                    {assignment.due_at && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-red-500" />
                        <span className="text-red-500">Due {format(assignment.due_at, 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </OrgCardContent>
            </OrgCard>
          ))}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <OrgCard key={assignment.id} className="hover:shadow-md transition-shadow">
              {/* Same structure as active tab */}
              <OrgCardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(assignment.status)}
                      <OrgCardTitle className="text-lg">{assignment.title}</OrgCardTitle>
                      <Badge 
                        variant={assignment.status === 'overdue' ? 'destructive' : 'outline'}
                        className={assignment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {assignment.status}
                      </Badge>
                    </div>
                    <OrgCardDescription className="line-clamp-2">
                      {assignment.description || 'No description provided'}
                    </OrgCardDescription>
                  </div>
                </div>
              </OrgCardHeader>
              <OrgCardContent>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{assignment.completed_count}/{assignment.assigned_count} completed</span>
                    </div>
                    {assignment.due_at && (
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                        <span>Due {format(assignment.due_at, 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-muted-foreground">
                    {Math.round((assignment.completed_count / assignment.assigned_count) * 100)}% complete
                  </div>
                </div>
              </OrgCardContent>
            </OrgCard>
          ))}
        </TabsContent>
      </Tabs>

      {/* Create Assignment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
            <DialogDescription>
              Create a new assignment for your students.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateAssignment)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignment Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter assignment title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="Describe the assignment requirements..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="due_at"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date (Optional)</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a due date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateDialog(false);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Create Assignment
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Assignment Detail Sheet */}
      <Sheet open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedAssignment?.title}</SheetTitle>
            <SheetDescription>Assignment details and student progress</SheetDescription>
          </SheetHeader>
          
          {selectedAssignment && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedAssignment.description || 'No description provided'}
                </p>
              </div>
              
              {selectedAssignment.due_at && (
                <div>
                  <h3 className="font-semibold mb-2">Due Date</h3>
                  <p className="text-sm">{format(selectedAssignment.due_at, 'PPPP')}</p>
                </div>
              )}
              
              <div>
                <h3 className="font-semibold mb-2">Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completed:</span>
                    <span>{selectedAssignment.completed_count}/{selectedAssignment.assigned_count}</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: `${(selectedAssignment.completed_count / selectedAssignment.assigned_count) * 100}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Student Status</h3>
                <p className="text-sm text-muted-foreground">
                  Individual student progress will be displayed here once implemented.
                </p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}