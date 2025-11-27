
import { useEffect, useRef } from 'react';
import { useAnalyticsEventBus } from '@/hooks/useAnalyticsEventBus';

export const useViewportAnalytics = (
  widgetType: 'apod' | 'visual3d' | 'weather',
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
          if (widgetType === 'weather') {
            publishEvent('weather.widget.view', {
              widget: widgetType,
              itemId: itemId || 'default'
            });
          } else {
            publishEvent('discovery.widget.view', {
              widget: widgetType,
              itemId: itemId || 'default'
            });
          }
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
    if (widgetType === 'weather') {
      if (clickItemId === 'chart') {
        publishEvent('weather.chart.interact', {
          widget: widgetType,
          itemId: clickItemId
        });
      } else if (clickItemId === 'lesson_generate') {
        publishEvent('weather.lesson.generate', {
          widget: widgetType,
          itemId: clickItemId
        });
      } else {
        publishEvent('weather.widget.view', {
          widget: widgetType,
          itemId: clickItemId || itemId || 'default'
        });
      }
    } else {
      publishEvent('discovery.widget.click', {
        widget: widgetType,
        itemId: clickItemId || itemId || 'default'
      });
    }
  };

  return { elementRef, trackClick };
};
