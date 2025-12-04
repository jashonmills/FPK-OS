import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FPKGovernanceBadgeProps {
  isCollapsed?: boolean;
  className?: string;
}

const GOVERNANCE_DESCRIPTION = "All AI interactions in this organization are monitored, logged, and governed by FPK's educational AI safety policies to ensure appropriate, secure, and compliant usage.";

export function FPKGovernanceBadge({ isCollapsed = false, className }: FPKGovernanceBadgeProps) {
  const badgeContent = (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm transition-all cursor-help",
        isCollapsed ? "p-2 justify-center" : "px-3 py-2",
        className
      )}
    >
      <ShieldCheck className="h-4 w-4 text-emerald-400 flex-shrink-0" />
      {!isCollapsed && (
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-emerald-300/90 leading-tight">
            Protected by
          </span>
          <span className="text-[11px] font-semibold text-emerald-200 leading-tight">
            FPK AI Governance
          </span>
        </div>
      )}
    </div>
  );

  return (
    <Tooltip delayDuration={300}>
      <TooltipTrigger asChild>
        {badgeContent}
      </TooltipTrigger>
      <TooltipContent 
        side="right" 
        className="max-w-[240px] bg-emerald-900 text-emerald-100 border-emerald-700"
      >
        {isCollapsed && <p className="font-medium mb-1">Protected by FPK AI Governance</p>}
        <p className="text-xs text-emerald-200/90">{GOVERNANCE_DESCRIPTION}</p>
      </TooltipContent>
    </Tooltip>
  );
}
