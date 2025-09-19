import React, { useState } from 'react';
import { useOrgContext } from '@/components/organizations/OrgContext';
// Card imports removed - using OrgCard components
import { OrgCard, OrgCardContent, OrgCardDescription, OrgCardHeader, OrgCardTitle } from '@/components/organizations/OrgCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
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
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Target, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Eye,
  Edit,
  Trash2,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const goalSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  priority: z.enum(['low', 'medium', 'high']),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  progress: number;
  assigned_count: number;
  completed_count: number;
  created_at: Date;
}

// Mock data for demonstration
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Complete Programming Fundamentals',
    description: 'Master the basics of programming including variables, loops, and functions.',
    category: 'Technical Skills',
    priority: 'high',
    status: 'active',
    progress: 75,
    assigned_count: 12,
    completed_count: 9,
    created_at: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Improve Communication Skills',
    description: 'Develop better written and verbal communication abilities.',
    category: 'Soft Skills',
    priority: 'medium',
    status: 'active',
    progress: 45,
    assigned_count: 8,
    completed_count: 3,
    created_at: new Date('2024-02-01'),
  },
  {
    id: '3',
    title: 'Data Analysis Certification',
    description: 'Complete the data analysis course and obtain certification.',
    category: 'Professional Development',
    priority: 'high',
    status: 'completed',
    progress: 100,
    assigned_count: 5,
    completed_count: 5,
    created_at: new Date('2024-01-10'),
  },
];

const categories = [
  'Technical Skills',
  'Soft Skills',
  'Professional Development',
  'Academic Performance',
  'Personal Growth',
];

export default function GoalsPage() {
  const { currentOrg, getUserRole } = useOrgContext();
  const { toast } = useToast();
  const userRole = getUserRole();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      priority: 'medium',
    },
  });

  if (!currentOrg) {
    return (
      <div className="w-full max-w-6xl mx-auto px-6 py-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Organization Selected</h1>
          <p className="text-muted-foreground">Please select an organization to view goals.</p>
        </div>
      </div>
    );
  }

  const canManageGoals = userRole === 'owner' || userRole === 'instructor';
  console.log('🔐 Goals permissions:', { userRole, canManageGoals, hasOrg: !!currentOrg });
  
  const filteredGoals = mockGoals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         goal.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateGoal = (data: GoalFormData) => {
    // This would normally call an API
    console.log('🎯 Creating goal:', data);
    toast({
      title: "Success",
      description: "Goal created successfully.",
    });
    
    form.reset();
    setShowCreateDialog(false);
  };

  const handleEditGoal = (goal: Goal) => {
    console.log('✏️ Edit goal clicked:', goal.id, goal.title);
    setEditingGoal(goal);
    form.reset({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      priority: goal.priority,
    });
  };

  const handleUpdateGoal = (data: GoalFormData) => {
    if (!editingGoal) return;
    
    console.log('Updating goal:', editingGoal.id, data);
    toast({
      title: "Success",
      description: "Goal updated successfully.",
    });
    
    form.reset();
    setEditingGoal(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50 border-yellow-200';
      default:
        return 'text-green-500 bg-green-50 border-green-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-50 border-green-200';
      case 'paused':
        return 'text-gray-500 bg-gray-50 border-gray-200';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200';
    }
  };

  const activeGoals = mockGoals.filter(g => g.status === 'active');
  const completedGoals = mockGoals.filter(g => g.status === 'completed');
  const totalProgress = mockGoals.reduce((sum, goal) => sum + goal.progress, 0) / mockGoals.length;

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Goals</h1>
            <p className="text-muted-foreground">
              Set and track student learning objectives
            </p>
          </div>
        </div>
        
        {canManageGoals && (
          <Button onClick={() => {
            console.log('➕ Create Goal button clicked');
            setShowCreateDialog(true);
          }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Goal
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Active Goals</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{activeGoals.length}</div>
            <p className="text-xs text-purple-200">In progress</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Completed</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-green-400">{completedGoals.length}</div>
            <p className="text-xs text-purple-200">Successfully achieved</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Average Progress</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">{Math.round(totalProgress)}%</div>
            <p className="text-xs text-purple-200">Across all goals</p>
          </OrgCardContent>
        </OrgCard>
        
        <OrgCard>
          <OrgCardHeader className="pb-2">
            <OrgCardTitle className="text-sm font-medium text-purple-100">Total Students</OrgCardTitle>
          </OrgCardHeader>
          <OrgCardContent>
            <div className="text-2xl font-bold text-white">18</div>
            <p className="text-xs text-purple-200">With assigned goals</p>
          </OrgCardContent>
        </OrgCard>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Goals</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Goals Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No goals match your search.' : 'Start by creating learning goals for your students.'}
            </p>
            {canManageGoals && !searchQuery && (
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredGoals.map((goal) => (
              <OrgCard key={goal.id} className="hover:shadow-md transition-shadow">
                <OrgCardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <OrgCardTitle className="text-lg line-clamp-1 text-white">{goal.title}</OrgCardTitle>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(goal.priority)}`}
                        >
                          {goal.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {goal.category}
                        </Badge>
                        <Badge 
                          variant="outline"
                          className={`text-xs ${getStatusColor(goal.status)}`}
                        >
                          {goal.status}
                        </Badge>
                      </div>
                      <OrgCardDescription className="line-clamp-2 text-purple-200">
                        {goal.description || 'No description provided'}
                      </OrgCardDescription>
                    </div>
                    {canManageGoals && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-purple-100 hover:bg-purple-800/50">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            console.log('👁️ View Details clicked for goal:', goal.id);
                            setSelectedGoal(goal);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.preventDefault();
                            console.log('✏️ Edit Goal clicked for goal:', goal.id);
                            handleEditGoal(goal);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Goal
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Goal
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                </OrgCardHeader>
                <OrgCardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-purple-100">Progress</span>
                        <span className="text-white">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-purple-200">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          <span>{goal.assigned_count} assigned</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-400" />
                          <span>{goal.completed_count} completed</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{goal.created_at.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </OrgCardContent>
              </OrgCard>
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Goal Dialog */}
      <Dialog 
        open={showCreateDialog || !!editingGoal} 
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingGoal(null);
            form.reset();
          }
        }}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingGoal ? 'Edit Goal' : 'Create New Goal'}
            </DialogTitle>
            <DialogDescription>
              {editingGoal ? 'Update goal information.' : 'Create a new learning goal for students.'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(editingGoal ? handleUpdateGoal : handleCreateGoal)} 
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal Title</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter goal title" />
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
                        placeholder="Describe the goal and success criteria..."
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
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
                    setEditingGoal(null);
                    form.reset();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGoal ? 'Update Goal' : 'Create Goal'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Goal Detail Sheet */}
      <Sheet open={!!selectedGoal} onOpenChange={() => setSelectedGoal(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>{selectedGoal?.title}</SheetTitle>
            <SheetDescription>Goal details and student progress</SheetDescription>
          </SheetHeader>
          
          {selectedGoal && (
            <div className="mt-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedGoal.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Category:</span>
                    <Badge variant="secondary">{selectedGoal.category}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Priority:</span>
                    <Badge 
                      variant="outline" 
                      className={getPriorityColor(selectedGoal.priority)}
                    >
                      {selectedGoal.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <Badge 
                      variant="outline"
                      className={getStatusColor(selectedGoal.status)}
                    >
                      {selectedGoal.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span>{selectedGoal.created_at.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Progress Overview</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{selectedGoal.progress}%</span>
                    </div>
                    <Progress value={selectedGoal.progress} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{selectedGoal.assigned_count}</div>
                      <div className="text-muted-foreground">Assigned</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-2xl font-bold text-green-500">{selectedGoal.completed_count}</div>
                      <div className="text-muted-foreground">Completed</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Student Progress</h3>
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