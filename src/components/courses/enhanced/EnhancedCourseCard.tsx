import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Eye, 
  UserPlus, 
  MoreVertical,
  Edit,
  Copy,
  BarChart3,
  Share,
  Tag,
  Play,
  Globe,
  Archive,
  Trash2,
  CheckCircle,
  Circle
} from 'lucide-react';
import { ConfirmModal } from './ConfirmModal';
import type { CourseCardModel, CourseCardActions, ConfirmModalData } from '@/types/enhanced-course-card';
import { useOrgPermissions } from '@/hooks/useOrgPermissions';
import { getCourseImage } from '@/utils/courseImages';
import { CollectionSelectionModal } from '@/components/collections/CollectionSelectionModal';

interface EnhancedCourseCardProps {
  course: CourseCardModel;
  actions: CourseCardActions;
  viewType?: 'grid' | 'list' | 'compact';
}

export function EnhancedCourseCard({ course, actions, viewType = 'grid' }: EnhancedCourseCardProps) {
  const { canManageOrg } = useOrgPermissions();
  const [confirm, setConfirm] = useState<ConfirmModalData>({ kind: null, busy: false });
  const isMobile = useIsMobile();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-muted text-muted-foreground';
      case 'ready_for_review': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      case 'published': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200';
      case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'error': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOriginBadge = () => {
    if (course.origin === 'platform') {
      return <Badge variant="secondary" className="text-xs">Platform</Badge>;
    }
    return <Badge variant="outline" className="text-xs">Organization</Badge>;
  };

  const getFrameworkBadge = () => {
    if (course.framework === 'framework2') {
      return <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">Micro-learning</Badge>;
    }
    if (course.sourceType === 'scorm') {
      return <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">SCORM</Badge>;
    }
    return null;
  };

  const StatusRibbon = () => {
    const statusText = course.status === 'processing' && course.processingStage
      ? `Processing • ${course.processingStage}`
      : course.status.replace('_', ' ');
      
    return (
      <div className={`absolute top-3 right-3 rounded px-2 py-1 text-xs font-medium backdrop-blur-sm z-10 ${getStatusColor(course.status)}`}>
        {course.status === 'processing' && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
            {statusText}
          </div>
        )}
        {course.status !== 'processing' && statusText}
      </div>
    );
  };

  const handleConfirmAction = async () => {
    if (!confirm.kind) return;
    
    setConfirm(prev => ({ ...prev, busy: true }));
    
    try {
      let impact;
      switch (confirm.kind) {
        case 'publish':
          if (actions.onPublish) impact = await actions.onPublish(course.id);
          break;
        case 'unpublish':
          if (actions.onUnpublish) impact = await actions.onUnpublish(course.id);
          break;
        case 'delete':
          if (actions.onDelete) impact = await actions.onDelete(course.id);
          break;
      }
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setConfirm({ kind: null, busy: false });
    }
  };

  const isPlatformCourse = course.origin === 'platform';
  const isOrgCourse = course.origin === 'organization';
  const canEdit = isOrgCourse && canManageOrg();
  const canPublish = isOrgCourse && canManageOrg() && course.status !== 'published';
  const canUnpublish = isOrgCourse && canManageOrg() && course.status === 'published';
  const canDelete = isOrgCourse && canManageOrg();

  const courseImage = getCourseImage(course.id, course.title);

  // Render compact view with mobile optimization
  if (viewType === 'compact') {
    return (
      <>
        <div className={`relative ${isMobile ? 'flex flex-col space-y-3 px-3 py-3' : 'flex items-center px-4 py-2'} hover:bg-muted/50 transition-colors border-b border-border/40 last:border-b-0`}>
          {isMobile ? (
            // Mobile: Stacked layout
            <>
              {/* Top row: Status dot, title, and badges */}
              <div className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getStatusColor(course.status).replace('bg-', 'bg-').split(' ')[0]}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm leading-tight mb-1">{course.title}</h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {course.instructorName && (
                      <span className="truncate max-w-24">{course.instructorName}</span>
                    )}
                    {course.durationMinutes && (
                      <span>{course.durationMinutes}min</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {getOriginBadge()}
                    {getFrameworkBadge()}
                  </div>
                </div>
              </div>

              {/* Bottom row: Status and Actions */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/20">
                <div className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(course.status)} flex-shrink-0`}>
                  {course.status === 'processing' && course.processingStage
                    ? `Processing • ${course.processingStage}`
                    : course.status.replace('_', ' ')
                  }
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => actions.onPreview(course.id)}
                    className="h-8 px-3 text-xs"
                  >
                    Preview
                  </Button>
                  <Button
                    size="sm" 
                    onClick={() => actions.onStart(course.id)}
                    className="h-8 px-3 text-xs"
                  >
                    Start
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {isPlatformCourse && (
                        <>
                          {actions.onDuplicateToOrg && (
                            <DropdownMenuItem onClick={() => actions.onDuplicateToOrg!(course.id)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicate to Org
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Full Preview
                          </DropdownMenuItem>
                          {actions.onViewAnalytics && (
                            <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analytics (Read-only)
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      {isOrgCourse && (
                        <>
                          {canEdit && actions.onEdit && (
                            <DropdownMenuItem onClick={() => actions.onEdit(course.id)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Course
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                            <Play className="h-4 w-4 mr-2" />
                            Full Preview
                          </DropdownMenuItem>
                          {actions.onViewAnalytics && (
                            <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                              <BarChart3 className="h-4 w-4 mr-2" />
                              Analytics (Full)
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                      {actions.onSharePreview && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => actions.onSharePreview(course.id)}>
                            <Share className="h-4 w-4 mr-2" />
                            Share Preview Link
                          </DropdownMenuItem>
                        </>
                      )}
                    {actions.onAddToCollection && (
                      <DropdownMenuItem onClick={() => actions.onAddToCollection(course.id)}>
                        <Tag className="h-4 w-4 mr-2" />
                        Add to Collection
                      </DropdownMenuItem>
                    )}
                    {canManageOrg() && (
                      <DropdownMenuItem onClick={() => actions.onAssignToStudents?.(course.id, course.title)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign to Students
                      </DropdownMenuItem>
                    )}
                    {(canPublish || canUnpublish) && <DropdownMenuSeparator />}
                      {canPublish && (
                        <DropdownMenuItem 
                          onClick={() => setConfirm({ 
                            kind: 'publish', 
                            busy: false, 
                            courseTitle: course.title,
                            impactSummary: course.lastAssignment 
                          })}
                          className="text-emerald-600 dark:text-emerald-400"
                        >
                          <Circle className="h-4 w-4 mr-2" />
                          Publish
                        </DropdownMenuItem>
                      )}
                      {canUnpublish && (
                        <DropdownMenuItem 
                          onClick={() => setConfirm({ 
                            kind: 'unpublish', 
                            busy: false, 
                            courseTitle: course.title,
                            impactSummary: course.lastAssignment 
                          })}
                          className="text-amber-600 dark:text-amber-400"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Unpublish
                        </DropdownMenuItem>
                      )}
                      {canDelete && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => setConfirm({ 
                              kind: 'delete', 
                              busy: false, 
                              courseTitle: course.title,
                              impactSummary: course.lastAssignment 
                            })}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </>
          ) : (
            // Desktop: Original horizontal layout
            <>
              {/* Status indicator dot */}
              <div className={`w-2 h-2 rounded-full mr-3 flex-shrink-0 ${getStatusColor(course.status).replace('bg-', 'bg-').split(' ')[0]}`} />
              
              {/* Course info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm truncate">{course.title}</h3>
                  {course.instructorName && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground truncate">{course.instructorName}</span>
                    </>
                  )}
                  {course.durationMinutes && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">{course.durationMinutes}min</span>
                    </>
                  )}
                  <div className="flex gap-1 ml-2">
                    {getOriginBadge()}
                    {getFrameworkBadge()}
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                {/* Status badge before Preview button */}
                <div className={`rounded px-2 py-1 text-xs font-medium ${getStatusColor(course.status)} mr-1`}>
                  {course.status === 'processing' && course.processingStage
                    ? `Processing • ${course.processingStage}`
                    : course.status.replace('_', ' ')
                  }
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => actions.onPreview(course.id)}
                  className="h-7 px-2 text-xs"
                >
                  Preview
                </Button>
                <Button
                  size="sm" 
                  onClick={() => actions.onStart(course.id)}
                  className="h-7 px-2 text-xs"
                >
                  Start Course
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {isPlatformCourse && (
                      <>
                        {actions.onDuplicateToOrg && (
                          <DropdownMenuItem onClick={() => actions.onDuplicateToOrg!(course.id)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate to Org
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Full Preview
                        </DropdownMenuItem>
                        {actions.onViewAnalytics && (
                          <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics (Read-only)
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    {isOrgCourse && (
                      <>
                        {canEdit && actions.onEdit && (
                          <DropdownMenuItem onClick={() => actions.onEdit(course.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Course
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                          <Play className="h-4 w-4 mr-2" />
                          Full Preview
                        </DropdownMenuItem>
                        {actions.onViewAnalytics && (
                          <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Analytics (Full)
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                    {actions.onSharePreview && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => actions.onSharePreview(course.id)}>
                          <Share className="h-4 w-4 mr-2" />
                          Share Preview Link
                        </DropdownMenuItem>
                      </>
                    )}
                    {actions.onAddToCollection && (
                      <DropdownMenuItem onClick={() => actions.onAddToCollection(course.id)}>
                        <Tag className="h-4 w-4 mr-2" />
                        Add to Collection
                      </DropdownMenuItem>
                    )}
                    {canManageOrg() && (
                      <DropdownMenuItem onClick={() => actions.onAssignToStudents?.(course.id, course.title)}>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Assign to Students
                      </DropdownMenuItem>
                    )}
                    {(canPublish || canUnpublish) && <DropdownMenuSeparator />}
                    {canPublish && (
                      <DropdownMenuItem 
                        onClick={() => setConfirm({ 
                          kind: 'publish', 
                          busy: false, 
                          courseTitle: course.title,
                          impactSummary: course.lastAssignment 
                        })}
                        className="text-emerald-600 dark:text-emerald-400"
                      >
                        <Circle className="h-4 w-4 mr-2" />
                        Publish
                      </DropdownMenuItem>
                    )}
                    {canUnpublish && (
                      <DropdownMenuItem 
                        onClick={() => setConfirm({ 
                          kind: 'unpublish', 
                          busy: false, 
                          courseTitle: course.title,
                          impactSummary: course.lastAssignment 
                        })}
                        className="text-amber-600 dark:text-amber-400"
                      >
                        <Archive className="h-4 w-4 mr-2" />
                        Unpublish
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => setConfirm({ 
                            kind: 'delete', 
                            busy: false, 
                            courseTitle: course.title,
                            impactSummary: course.lastAssignment 
                          })}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        <ConfirmModal
          isOpen={confirm.kind !== null}
          confirm={confirm}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirm({ kind: null, busy: false })}
        />
      </>
    );
  }
  // Render list view
  if (viewType === 'list') {
    return (
      <>
        <Card className="relative flex items-center hover:shadow-lg transition-shadow overflow-hidden">
          <StatusRibbon />
          
          {/* Course Image - Left side */}
          <div 
            className="relative w-48 h-32 bg-cover bg-center flex-shrink-0"
            style={{ backgroundImage: `url(${courseImage})` }}
          >
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 p-3 h-full flex flex-col justify-between">
              <div className="flex flex-wrap gap-1">
                {getOriginBadge()}
                {getFrameworkBadge()}
              </div>
              <div className="flex flex-wrap gap-1">
                {course.isFeatured && (
                  <Badge variant="secondary" className="text-xs bg-amber-500/90 text-white backdrop-blur-sm border-0">Featured</Badge>
                )}
                {course.isNew && (
                  <Badge variant="secondary" className="text-xs bg-emerald-500/90 text-white backdrop-blur-sm border-0">New</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Content - Right side */}
          <div className="flex-1 p-4 flex flex-col">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
              
              {course.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {course.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
                {course.instructorName && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{course.instructorName}</span>
                  </div>
                )}
                
                {course.durationMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{course.durationMinutes} min</span>
                  </div>
                )}
                
                {typeof course.enrolledCount === 'number' && (
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{course.enrolledCount} enrolled</span>
                  </div>
                )}
                
                {typeof course.avgCompletionPct === 'number' && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>{course.avgCompletionPct}% avg completion</span>
                  </div>
                )}

                {course.difficulty && (
                  <Badge variant="outline" className="text-xs capitalize">
                    {course.difficulty}
                  </Badge>
                )}
              </div>

              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {course.tags.slice(0, 4).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {course.tags.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{course.tags.length - 4}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Actions - Bottom right */}
            <div className="flex items-center gap-2 mt-4 pt-3 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => actions.onPreview(course.id)}
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>

              <Button
                onClick={() => actions.onStart(course.id)}
                size="sm"
              >
                <Play className="h-4 w-4 mr-1" />
                Start Course
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {/* Same dropdown content as grid view */}
                  {isPlatformCourse && (
                    <>
                      {actions.onDuplicateToOrg && (
                        <DropdownMenuItem onClick={() => actions.onDuplicateToOrg!(course.id)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate to Org
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Full Preview
                      </DropdownMenuItem>
                      {actions.onViewAnalytics && (
                        <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics (Read-only)
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  {isOrgCourse && (
                    <>
                      {canEdit && actions.onEdit && (
                        <DropdownMenuItem onClick={() => actions.onEdit(course.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Course
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                        <Play className="h-4 w-4 mr-2" />
                        Full Preview
                      </DropdownMenuItem>
                      {actions.onViewAnalytics && (
                        <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analytics (Full)
                        </DropdownMenuItem>
                      )}
                    </>
                  )}

                  {actions.onSharePreview && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => actions.onSharePreview(course.id)}>
                        <Share className="h-4 w-4 mr-2" />
                        Share Preview Link
                      </DropdownMenuItem>
                    </>
                  )}

                  {actions.onAddToCollection && (
                    <DropdownMenuItem onClick={() => actions.onAddToCollection(course.id)}>
                      <Tag className="h-4 w-4 mr-2" />
                      Add to Collection
                    </DropdownMenuItem>
                  )}

                  {(canPublish || canUnpublish) && <DropdownMenuSeparator />}
                  
                  {canPublish && (
                    <DropdownMenuItem 
                      onClick={() => setConfirm({ 
                        kind: 'publish', 
                        busy: false, 
                        courseTitle: course.title,
                        impactSummary: course.lastAssignment 
                      })}
                      className="text-emerald-600 dark:text-emerald-400"
                    >
                      <Circle className="h-4 w-4 mr-2" />
                      Publish
                    </DropdownMenuItem>
                  )}

                  {canUnpublish && (
                    <DropdownMenuItem 
                      onClick={() => setConfirm({ 
                        kind: 'unpublish', 
                        busy: false, 
                        courseTitle: course.title,
                        impactSummary: course.lastAssignment 
                      })}
                      className="text-amber-600 dark:text-amber-400"
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      Unpublish
                    </DropdownMenuItem>
                  )}

                  {canDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => setConfirm({ 
                          kind: 'delete', 
                          busy: false, 
                          courseTitle: course.title,
                          impactSummary: course.lastAssignment 
                        })}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </Card>

        <ConfirmModal
          isOpen={confirm.kind !== null}
          confirm={confirm}
          onConfirm={handleConfirmAction}
          onCancel={() => setConfirm({ kind: null, busy: false })}
        />
      </>
    );
  }

  // Render grid view with mobile optimization
  return (
    <>
      <Card className={cn(
        "relative h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden",
        isMobile ? "min-h-[280px]" : "min-h-[320px]"
      )}>
        <StatusRibbon />
        
        {/* Course Image Header */}
        <div 
          className={cn(
            "relative bg-cover bg-center",
            isMobile ? "h-32" : "h-40"
          )}
          style={{ backgroundImage: `url(${courseImage})` }}
        >
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Header content */}
          <div className={cn(
            "relative z-10 h-full flex flex-col justify-between",
            isMobile ? "p-3" : "p-4"
          )}>
            {/* Top badges */}
            <div className="flex justify-between items-start">
              <div className="flex flex-wrap gap-1">
                {getOriginBadge()}
                {getFrameworkBadge()}
              </div>
              <div className="flex flex-wrap gap-1">
                {course.isFeatured && (
                  <Badge variant="secondary" className="text-xs bg-amber-500/90 text-white backdrop-blur-sm border-0">Featured</Badge>
                )}
                {course.isNew && (
                  <Badge variant="secondary" className="text-xs bg-emerald-500/90 text-white backdrop-blur-sm border-0">New</Badge>
                )}
              </div>
            </div>
            
            {/* Course title */}
            <div className="flex-1 flex items-end">
              <h3 className={cn(
                "text-white font-bold leading-tight drop-shadow-lg line-clamp-2",
                isMobile ? "text-base" : "text-lg"
              )}>
                {course.title}
              </h3>
            </div>
          </div>
        </div>

        <CardHeader className={cn(
          "flex-1 pb-2",
          isMobile ? "p-3" : "pb-3"
        )}>
          {/* Description */}
          {course.description && (
            <p className={cn(
              "text-muted-foreground line-clamp-2 mb-3",
              isMobile ? "text-xs" : "text-sm"
            )}>
              {course.description}
            </p>
          )}

          {/* Metadata */}
          <div className={cn(
            "flex flex-wrap gap-2 text-muted-foreground",
            isMobile ? "text-xs gap-2" : "text-xs gap-3"
          )}>
            {course.instructorName && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{course.instructorName}</span>
              </div>
            )}
            
            {course.durationMinutes && (
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span>{course.durationMinutes} min</span>
              </div>
            )}
            
            {course.difficulty && (
              <Badge variant="outline" className="text-xs capitalize">
                {course.difficulty}
              </Badge>
            )}
            
            {typeof course.enrolledCount === 'number' && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3 flex-shrink-0" />
                <span>{course.enrolledCount} enrolled</span>
              </div>
            )}
            
            {typeof course.avgCompletionPct === 'number' && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3 flex-shrink-0" />
                <span>{course.avgCompletionPct}% avg completion</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {course.tags.slice(0, isMobile ? 2 : 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > (isMobile ? 2 : 3) && (
                <Badge variant="outline" className="text-xs">
                  +{course.tags.length - (isMobile ? 2 : 3)}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow" />

        {/* Actions */}
        <div className={cn(
          "border-t flex items-center gap-2 bg-card/50 backdrop-blur-sm",
          isMobile ? "p-2" : "p-3"
        )}>
          {/* Primary Actions */}
          <Button
            variant="outline"
            size={isMobile ? "sm" : "sm"}
            onClick={() => actions.onPreview(course.id)}
            className={cn(
              "flex-1 min-w-0",
              isMobile ? "h-8 px-2 text-xs" : "h-9"
            )}
          >
            <Eye className={cn(
              "mr-1 flex-shrink-0",
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span className="truncate">Preview</span>
          </Button>

          <Button
            onClick={() => actions.onStart(course.id)}
            size={isMobile ? "sm" : "sm"}
            className={cn(
              "flex-1 min-w-0",
              isMobile ? "h-8 px-2 text-xs" : "h-9"
            )}
          >
            <Play className={cn(
              "mr-1 flex-shrink-0",
              isMobile ? "h-3 w-3" : "h-4 w-4"
            )} />
            <span className="truncate">Start Course</span>
          </Button>

          {/* Secondary Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size={isMobile ? "sm" : "sm"}
                className={cn(
                  "flex-shrink-0",
                  isMobile ? "h-8 w-8 p-0" : "h-9 w-9 p-0"
                )}
              >
                <MoreVertical className={cn(
                  isMobile ? "h-3 w-3" : "h-4 w-4"
                )} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {/* Platform Course Actions */}
              {isPlatformCourse && (
                <>
                  {actions.onDuplicateToOrg && (
                    <DropdownMenuItem onClick={() => actions.onDuplicateToOrg!(course.id)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate to Org
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Full Preview
                  </DropdownMenuItem>
                  {actions.onViewAnalytics && (
                    <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics (Read-only)
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {/* Organization Course Actions */}
              {isOrgCourse && (
                <>
                  {canEdit && actions.onEdit && (
                    <DropdownMenuItem onClick={() => actions.onEdit(course.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => actions.onPreview(course.id)}>
                    <Play className="h-4 w-4 mr-2" />
                    Full Preview
                  </DropdownMenuItem>
                  {actions.onViewAnalytics && (
                    <DropdownMenuItem onClick={() => actions.onViewAnalytics(course.id)}>
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Analytics (Full)
                    </DropdownMenuItem>
                  )}
                </>
              )}

              {/* Common Actions */}
              {actions.onSharePreview && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => actions.onSharePreview(course.id)}>
                    <Share className="h-4 w-4 mr-2" />
                    Share Preview Link
                  </DropdownMenuItem>
                </>
              )}

              {actions.onAddToCollection && (
                <DropdownMenuItem onClick={() => actions.onAddToCollection(course.id)}>
                  <Tag className="h-4 w-4 mr-2" />
                  Add to Collection
                </DropdownMenuItem>
              )}

              {/* Publishing Actions */}
              {(canPublish || canUnpublish) && <DropdownMenuSeparator />}
              
              {canPublish && (
                <DropdownMenuItem 
                  onClick={() => setConfirm({ 
                    kind: 'publish', 
                    busy: false, 
                    courseTitle: course.title,
                    impactSummary: course.lastAssignment 
                  })}
                  className="text-emerald-600 dark:text-emerald-400"
                >
                  <Circle className="h-4 w-4 mr-2" />
                  Publish
                </DropdownMenuItem>
              )}

              {canUnpublish && (
                <DropdownMenuItem 
                  onClick={() => setConfirm({ 
                    kind: 'unpublish', 
                    busy: false, 
                    courseTitle: course.title,
                    impactSummary: course.lastAssignment 
                  })}
                  className="text-amber-600 dark:text-amber-400"
                >
                  <Archive className="h-4 w-4 mr-2" />
                  Unpublish
                </DropdownMenuItem>
              )}

              {canDelete && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => setConfirm({ 
                      kind: 'delete', 
                      busy: false, 
                      courseTitle: course.title,
                      impactSummary: course.lastAssignment 
                    })}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirm.kind !== null}
        confirm={confirm}
        onConfirm={handleConfirmAction}
        onCancel={() => setConfirm({ kind: null, busy: false })}
      />
    </>
  );
}