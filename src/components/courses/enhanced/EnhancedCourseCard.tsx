import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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

interface EnhancedCourseCardProps {
  course: CourseCardModel;
  actions: CourseCardActions;
}

export function EnhancedCourseCard({ course, actions }: EnhancedCourseCardProps) {
  const { canManageOrg } = useOrgPermissions();
  const [confirm, setConfirm] = useState<ConfirmModalData>({ kind: null, busy: false });

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
      <div className={`absolute top-3 right-3 rounded px-2 py-1 text-xs font-medium ${getStatusColor(course.status)}`}>
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

  return (
    <>
      <Card className="relative h-full flex flex-col hover:shadow-lg transition-shadow">
        <StatusRibbon />
        
        <CardHeader className="pb-3">
          {/* Thumbnail */}
          <div className="aspect-video w-full overflow-hidden rounded-md mb-3">
            {course.thumbnailUrl ? (
              <img 
                src={course.thumbnailUrl} 
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-2">
            {getOriginBadge()}
            {getFrameworkBadge()}
            {course.difficulty && (
              <Badge variant="outline" className="text-xs capitalize">
                {course.difficulty}
              </Badge>
            )}
            {course.isFeatured && (
              <Badge variant="secondary" className="text-xs">Featured</Badge>
            )}
            {course.isNew && (
              <Badge variant="secondary" className="text-xs">New</Badge>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 mb-2">
            {course.title}
          </h3>

          {/* Description */}
          {course.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
              {course.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
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
          </div>

          {/* Tags */}
          {course.tags && course.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {course.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {course.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{course.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-grow" />

        {/* Actions */}
        <div className="border-t p-3 flex items-center gap-2">
          {/* Primary Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => actions.onPreview(course.id)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>

          <Button
            onClick={() => actions.onAssign(course.id)}
            size="sm"
            className="flex-1"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Assign
          </Button>

          {/* Secondary Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreVertical className="h-4 w-4" />
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