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

export function FPKGovernanceBadge({ isCollapsed = false, className }: FPKGovernanceBadgeProps) {
  const badgeContent = (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm transition-all",
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

  if (isCollapsed) {
    return (
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          {badgeContent}
        </TooltipTrigger>
        <TooltipContent side="right" className="bg-emerald-900 text-emerald-100 border-emerald-700">
          <p className="font-medium">Protected by FPK AI Governance</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return badgeContent;
}
