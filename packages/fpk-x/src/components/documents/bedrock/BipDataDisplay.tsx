import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BIPSpecificData } from "@/types/bedrock-insights";
import { Target, AlertTriangle, CheckCircle2, BookOpen, Shield, ClipboardList } from "lucide-react";

interface BipDataDisplayProps {
  data: BIPSpecificData;
}

export function BipDataDisplay({ data }: BipDataDisplayProps) {
  const renderSection = (
    title: string, 
    content: string | string[] | undefined, 
    icon: React.ReactNode,
    variant: 'default' | 'secondary' | 'outline' = 'default'
  ) => {
    if (!content) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {icon}
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
        </div>
        {Array.isArray(content) ? (
          <ul className="space-y-1 ml-6">
            {content.map((item, idx) => (
              <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-foreground ml-6 leading-relaxed bg-muted/50 p-3 rounded-md border border-border">
            {content}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            BIP-Specific Data
          </CardTitle>
          <Badge variant="default">Behavior Intervention Plan</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {renderSection(
          "Behavior Hypothesis",
          data.behavior_hypothesis,
          <AlertTriangle className="h-4 w-4 text-primary" />
        )}
        
        {data.behavior_hypothesis && <Separator />}
        
        {renderSection(
          "Target Behavior",
          data.target_behavior_description,
          <Target className="h-4 w-4 text-destructive" />,
          'secondary'
        )}
        
        {data.target_behavior_description && <Separator />}
        
        {renderSection(
          "Antecedent Modifications",
          data.antecedent_modification,
          <AlertTriangle className="h-4 w-4 text-orange-500" />
        )}
        
        {data.antecedent_modification && <Separator />}
        
        {renderSection(
          "Consequence Modifications",
          data.consequence_modification,
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
        
        {data.consequence_modification && <Separator />}
        
        {renderSection(
          "Replacement Behavior",
          data.replacement_behavior,
          <CheckCircle2 className="h-4 w-4 text-primary" />
        )}
        
        {data.replacement_behavior && <Separator />}
        
        {renderSection(
          "Teaching Strategies",
          data.teaching_strategies,
          <BookOpen className="h-4 w-4 text-blue-500" />
        )}
        
        {data.teaching_strategies && <Separator />}
        
        {renderSection(
          "Crisis Plan",
          data.crisis_plan,
          <Shield className="h-4 w-4 text-red-500" />
        )}
        
        {data.crisis_plan && <Separator />}
        
        {renderSection(
          "Data Collection Method",
          data.data_collection_method,
          <ClipboardList className="h-4 w-4 text-purple-500" />
        )}
      </CardContent>
    </Card>
  );
}
