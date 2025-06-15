
import { useEffect, useRef } from 'react';
import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';

export const useViewportAnalytics = (
  widgetType: 'apod' | 'visual3d',
  itemId?: string
) => {
  const { publishEvent } = useAnalyticsEventBus();
  const elementRef = useRef<HTMLDivElement>(null);
  const hasTrackedView = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasTrackedView.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTrackedView.current) {
          publishEvent('discovery.widget.view', {
            widget: widgetType,
            itemId: itemId || 'default'
          });
          hasTrackedView.current = true;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [widgetType, itemId, publishEvent]);

  const trackClick = (clickItemId?: string) => {
    publishEvent('discovery.widget.click', {
      widget: widgetType,
      itemId: clickItemId || itemId || 'default'
    });
  };

  return { elementRef, trackClick };
};
