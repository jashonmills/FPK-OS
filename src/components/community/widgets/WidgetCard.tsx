import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface WidgetCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}

export const WidgetCard = ({ title, icon, children, action }: WidgetCardProps) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between min-w-0">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {icon}
            <CardTitle className="text-base break-words">{title}</CardTitle>
          </div>
          {action}
        </div>
      </CardHeader>
      <CardContent className="pt-0 min-w-0">
        {children}
      </CardContent>
    </Card>
  );
};
