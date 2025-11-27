import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Check, BookOpen } from 'lucide-react';

interface FpkUniversityAddonProps {
  selectedTier: 'basic' | 'pro' | 'pro_plus' | null;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
}

export function FpkUniversityAddon({ 
  selectedTier, 
  isChecked, 
  onToggle 
}: FpkUniversityAddonProps) {
  const getAddonPrice = () => {
    if (!selectedTier) return null;
    if (selectedTier === 'pro_plus') return 'free';
    if (selectedTier === 'pro') return '$2.99';
    return '$4.99';
  };
  
  const price = getAddonPrice();
  const isFree = selectedTier === 'pro_plus';
  
  return (
    <Card className="bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/30 transition-all p-6">
      <div className="flex items-start gap-4">
        {!isFree && (
          <div className="mt-1">
            <Checkbox
              checked={isChecked}
              onCheckedChange={onToggle}
              disabled={!selectedTier || isFree}
              className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-primary"
            />
          </div>
        )}
        {isFree && (
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 mt-1">
            <Check className="w-3 h-3 text-white" />
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-5 h-5 text-white" />
            <h3 className="text-xl font-semibold text-white">
              Add Full FPK University Platform Access
            </h3>
            {isFree && (
              <Badge className="bg-green-500 text-white border-0">
                Included Free!
              </Badge>
            )}
          </div>
          
          <p className="text-white/80 mb-3 text-sm leading-relaxed">
            Unlock our complete catalog of 50+ interactive courses, advanced learning tools, 
            and community features on the FPK University platform.
          </p>
          
          <div className="flex items-baseline gap-2">
            {price && (
              <>
                <span className="text-2xl font-bold text-white">
                  {price}
                </span>
                {!isFree && <span className="text-white/60">/month</span>}
              </>
            )}
            {!selectedTier && (
              <span className="text-white/60 text-sm">
                Select a plan above to see pricing
              </span>
            )}
          </div>

          {selectedTier && !isFree && (
            <div className="mt-3 pt-3 border-t border-white/20">
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>50+ interactive courses</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Advanced analytics & progress tracking</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  <span>Community forums & study groups</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
