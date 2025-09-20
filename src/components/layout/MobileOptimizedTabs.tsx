/**
 * Mobile-Optimized Tab Components
 * Enhanced tab navigation that works seamlessly across all device sizes
 */

import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileTabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface MobileOptimizedTabsProps {
  tabs: MobileTabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export const MobileOptimizedTabs: React.FC<MobileOptimizedTabsProps> = ({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  orientation = 'horizontal'
}) => {
  const isMobile = useIsMobile();
  
  // Force horizontal orientation on mobile for better UX
  const effectiveOrientation = isMobile ? 'horizontal' : orientation;
  
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      orientation={effectiveOrientation}
      className={cn('w-full', className)}
    >
      {isMobile ? (
        <ScrollArea className="w-full">
          <TabsList className="inline-flex h-12 items-center justify-start rounded-md bg-muted p-1 text-muted-foreground min-w-max mobile-tab-list">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="mobile-tab-trigger whitespace-nowrap"
              >
                <div className="flex items-center gap-2">
                  {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                  <span className="mobile-safe-text">{tab.label}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      ) : (
        <TabsList className={cn(
          effectiveOrientation === 'vertical' 
            ? 'flex flex-col h-auto w-full space-y-1'
            : `grid w-full grid-cols-${tabs.length}`
        )}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2 mobile-safe-text"
            >
              {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      )}

      <div className="mt-6">
        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value} className="mobile-section-spacing">
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
};

/**
 * Mobile-friendly tab navigation component for complex layouts
 */
interface MobileTabNavigationProps {
  tabs: Omit<MobileTabItem, 'content'>[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export const MobileTabNavigation: React.FC<MobileTabNavigationProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <ScrollArea className="w-full">
        <div className={cn('mobile-tab-list', className)}>
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                'mobile-tab-trigger whitespace-nowrap',
                activeTab === tab.value && 'bg-background text-foreground shadow-sm'
              )}
            >
              <div className="flex items-center gap-2">
                {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
                <span className="mobile-safe-text">{tab.label}</span>
              </div>
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    );
  }

  return (
    <div className={cn('flex gap-1 p-1 bg-muted rounded-lg', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onTabChange(tab.value)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors mobile-touch-target',
            activeTab === tab.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
          )}
        >
          {tab.icon && <span className="flex-shrink-0">{tab.icon}</span>}
          <span className="mobile-safe-text">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default MobileOptimizedTabs;