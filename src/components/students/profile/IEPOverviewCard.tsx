import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Target, 
  Stethoscope, 
  Shield, 
  BookOpen,
  Users,
  Calendar
} from 'lucide-react';
import { StudentIEPData } from '@/hooks/useStudentIEP';

interface IEPOverviewCardProps {
  iepData: StudentIEPData;
}

export function IEPOverviewCard({ iepData }: IEPOverviewCardProps) {
  const isMobile = useIsMobile();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          IEP Overview & Summary
        </CardTitle>
        <CardDescription>
          Comprehensive overview of {iepData.suspected_disability_categories?.[0] || 'Special Education'} services and support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Information */}
        {iepData.referral_reason && (
          <div>
            <h4 className="font-medium text-sm mb-2">Referral Reason</h4>
            <p className="text-sm text-muted-foreground">{iepData.referral_reason}</p>
          </div>
        )}

        {/* Disability Categories */}
        {iepData.suspected_disability_categories && iepData.suspected_disability_categories.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Disability Categories</h4>
            <div className="flex flex-wrap gap-2">
              {iepData.suspected_disability_categories.map((category, index) => (
                <Badge key={index} variant="secondary">{category}</Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Summary Grid */}
        <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-3'}`}>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              {iepData.goals?.length || 0} Active Goals
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              {iepData.services?.length || 0} Services
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">
              {iepData.accommodations?.length || 0} Accommodations
            </span>
          </div>
        </div>

        <Separator />

        {/* Jurisdiction */}
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Jurisdiction: {iepData.jurisdiction === 'US_IDEA' ? 'US IDEA' : iepData.jurisdiction}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}