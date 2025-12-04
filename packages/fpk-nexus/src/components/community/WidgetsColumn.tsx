import { ScrollArea } from "@/components/ui/scroll-area";
import { MiniProfileWidget } from "./widgets/MiniProfileWidget";
import { WelcomeNewMembersWidget } from "./widgets/WelcomeNewMembersWidget";
import { TrendingCirclesWidget } from "./widgets/TrendingCirclesWidget";
import { MyBookmarksWidget } from "./widgets/MyBookmarksWidget";
import { UpcomingEventsWidget } from "./widgets/UpcomingEventsWidget";

interface WidgetsColumnProps {
  userId: string;
  onSelectCircle: (circleId: string) => void;
}

export const WidgetsColumn = ({ userId, onSelectCircle }: WidgetsColumnProps) => {
  return (
    <ScrollArea className="h-full w-full">
      <div className="p-4 space-y-4 max-w-full overflow-hidden">
        <MiniProfileWidget userId={userId} />
        <WelcomeNewMembersWidget />
        <TrendingCirclesWidget onSelectCircle={onSelectCircle} />
        <MyBookmarksWidget />
        <UpcomingEventsWidget />
      </div>
    </ScrollArea>
  );
};
