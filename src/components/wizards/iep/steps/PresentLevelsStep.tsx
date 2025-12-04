import { WizardStepProps } from '@/lib/wizards/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdvocateCommentary } from '@/components/wizards/shared/AdvocateCommentary';

export const PresentLevelsStep = ({ data, onUpdate }: WizardStepProps) => {
  const handleDomainUpdate = (domain: string, field: string, value: string) => {
    onUpdate({
      ...data,
      [domain]: {
        ...data[domain],
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <AdvocateCommentary
        what="Present Levels of Academic Achievement and Functional Performance (PLAAFP) document the student's current abilities across all relevant domains."
        why="This data-driven baseline is legally required and forms the foundation for all IEP goals and services."
        how="Document current performance, strengths, needs, supporting data, and impact on general education for each relevant domain."
      />

      <Tabs defaultValue="academic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="functional">Functional</TabsTrigger>
          <TabsTrigger value="cognitive">Cognitive & Other</TabsTrigger>
        </TabsList>

        <TabsContent value="academic" className="space-y-6 mt-4">
          {/* Reading */}
          <div className="space-y-3 border-b pb-6">
            <h3 className="font-semibold text-lg">Reading</h3>
            <div className="grid gap-3">
              <div>
                <Label>Performance Level</Label>
                <Textarea
                  value={data.reading?.performanceLevel || ''}
                  onChange={(e) => handleDomainUpdate('reading', 'performanceLevel', e.target.value)}
                  placeholder="Current reading level, grade equivalency, standardized test scores..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={data.reading?.strengths || ''}
                    onChange={(e) => handleDomainUpdate('reading', 'strengths', e.target.value)}
                    placeholder="What reading skills are strengths?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Needs</Label>
                  <Textarea
                    value={data.reading?.needs || ''}
                    onChange={(e) => handleDomainUpdate('reading', 'needs', e.target.value)}
                    placeholder="What reading skills need support?"
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Supporting Data</Label>
                <Textarea
                  value={data.reading?.supportingData || ''}
                  onChange={(e) => handleDomainUpdate('reading', 'supportingData', e.target.value)}
                  placeholder="Assessment results, work samples, observation data..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Impact on General Education</Label>
                <Textarea
                  value={data.reading?.impactOnGeneralEd || ''}
                  onChange={(e) => handleDomainUpdate('reading', 'impactOnGeneralEd', e.target.value)}
                  placeholder="How does reading performance affect access to general education curriculum?"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Mathematics */}
          <div className="space-y-3 border-b pb-6">
            <h3 className="font-semibold text-lg">Mathematics</h3>
            <div className="grid gap-3">
              <div>
                <Label>Performance Level</Label>
                <Textarea
                  value={data.mathematics?.performanceLevel || ''}
                  onChange={(e) => handleDomainUpdate('mathematics', 'performanceLevel', e.target.value)}
                  placeholder="Current math level, grade equivalency, standardized test scores..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={data.mathematics?.strengths || ''}
                    onChange={(e) => handleDomainUpdate('mathematics', 'strengths', e.target.value)}
                    placeholder="What math skills are strengths?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Needs</Label>
                  <Textarea
                    value={data.mathematics?.needs || ''}
                    onChange={(e) => handleDomainUpdate('mathematics', 'needs', e.target.value)}
                    placeholder="What math skills need support?"
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Supporting Data</Label>
                <Textarea
                  value={data.mathematics?.supportingData || ''}
                  onChange={(e) => handleDomainUpdate('mathematics', 'supportingData', e.target.value)}
                  placeholder="Assessment results, work samples, observation data..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Impact on General Education</Label>
                <Textarea
                  value={data.mathematics?.impactOnGeneralEd || ''}
                  onChange={(e) => handleDomainUpdate('mathematics', 'impactOnGeneralEd', e.target.value)}
                  placeholder="How does math performance affect access to general education curriculum?"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Written Expression */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Written Expression</h3>
            <div className="grid gap-3">
              <div>
                <Label>Performance Level</Label>
                <Textarea
                  value={data.writtenExpression?.performanceLevel || ''}
                  onChange={(e) => handleDomainUpdate('writtenExpression', 'performanceLevel', e.target.value)}
                  placeholder="Current writing level, grade equivalency, standardized test scores..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={data.writtenExpression?.strengths || ''}
                    onChange={(e) => handleDomainUpdate('writtenExpression', 'strengths', e.target.value)}
                    placeholder="What writing skills are strengths?"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Needs</Label>
                  <Textarea
                    value={data.writtenExpression?.needs || ''}
                    onChange={(e) => handleDomainUpdate('writtenExpression', 'needs', e.target.value)}
                    placeholder="What writing skills need support?"
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Supporting Data</Label>
                <Textarea
                  value={data.writtenExpression?.supportingData || ''}
                  onChange={(e) => handleDomainUpdate('writtenExpression', 'supportingData', e.target.value)}
                  placeholder="Assessment results, work samples, observation data..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Impact on General Education</Label>
                <Textarea
                  value={data.writtenExpression?.impactOnGeneralEd || ''}
                  onChange={(e) => handleDomainUpdate('writtenExpression', 'impactOnGeneralEd', e.target.value)}
                  placeholder="How does writing performance affect access to general education curriculum?"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="functional" className="space-y-6 mt-4">
          {/* Communication */}
          <div className="space-y-3 border-b pb-6">
            <h3 className="font-semibold text-lg">Communication</h3>
            <div className="grid gap-3">
              <div>
                <Label>Performance Level</Label>
                <Textarea
                  value={data.communication?.performanceLevel || ''}
                  onChange={(e) => handleDomainUpdate('communication', 'performanceLevel', e.target.value)}
                  placeholder="Expressive and receptive language skills, pragmatic language..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={data.communication?.strengths || ''}
                    onChange={(e) => handleDomainUpdate('communication', 'strengths', e.target.value)}
                    placeholder="Communication strengths"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Needs</Label>
                  <Textarea
                    value={data.communication?.needs || ''}
                    onChange={(e) => handleDomainUpdate('communication', 'needs', e.target.value)}
                    placeholder="Communication needs"
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Supporting Data</Label>
                <Textarea
                  value={data.communication?.supportingData || ''}
                  onChange={(e) => handleDomainUpdate('communication', 'supportingData', e.target.value)}
                  placeholder="Speech-language evaluation, observations..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Impact on General Education</Label>
                <Textarea
                  value={data.communication?.impactOnGeneralEd || ''}
                  onChange={(e) => handleDomainUpdate('communication', 'impactOnGeneralEd', e.target.value)}
                  placeholder="How do communication skills affect classroom participation?"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Social/Emotional/Behavioral */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Social/Emotional/Behavioral</h3>
            <div className="grid gap-3">
              <div>
                <Label>Performance Level</Label>
                <Textarea
                  value={data.socialEmotional?.performanceLevel || ''}
                  onChange={(e) => handleDomainUpdate('socialEmotional', 'performanceLevel', e.target.value)}
                  placeholder="Peer relationships, self-regulation, emotional expression..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={data.socialEmotional?.strengths || ''}
                    onChange={(e) => handleDomainUpdate('socialEmotional', 'strengths', e.target.value)}
                    placeholder="Social/emotional strengths"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Needs</Label>
                  <Textarea
                    value={data.socialEmotional?.needs || ''}
                    onChange={(e) => handleDomainUpdate('socialEmotional', 'needs', e.target.value)}
                    placeholder="Social/emotional needs"
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Supporting Data</Label>
                <Textarea
                  value={data.socialEmotional?.supportingData || ''}
                  onChange={(e) => handleDomainUpdate('socialEmotional', 'supportingData', e.target.value)}
                  placeholder="Behavioral observations, rating scales, FBA data..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Impact on General Education</Label>
                <Textarea
                  value={data.socialEmotional?.impactOnGeneralEd || ''}
                  onChange={(e) => handleDomainUpdate('socialEmotional', 'impactOnGeneralEd', e.target.value)}
                  placeholder="How do social/emotional/behavioral needs affect learning and participation?"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cognitive" className="space-y-6 mt-4">
          {/* Cognitive */}
          <div className="space-y-3 border-b pb-6">
            <h3 className="font-semibold text-lg">Cognitive</h3>
            <div className="grid gap-3">
              <div>
                <Label>Performance Level</Label>
                <Textarea
                  value={data.cognitive?.performanceLevel || ''}
                  onChange={(e) => handleDomainUpdate('cognitive', 'performanceLevel', e.target.value)}
                  placeholder="Processing speed, working memory, executive functioning..."
                  rows={2}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Strengths</Label>
                  <Textarea
                    value={data.cognitive?.strengths || ''}
                    onChange={(e) => handleDomainUpdate('cognitive', 'strengths', e.target.value)}
                    placeholder="Cognitive strengths"
                    rows={2}
                  />
                </div>
                <div>
                  <Label>Needs</Label>
                  <Textarea
                    value={data.cognitive?.needs || ''}
                    onChange={(e) => handleDomainUpdate('cognitive', 'needs', e.target.value)}
                    placeholder="Cognitive needs"
                    rows={2}
                  />
                </div>
              </div>
              <div>
                <Label>Supporting Data</Label>
                <Textarea
                  value={data.cognitive?.supportingData || ''}
                  onChange={(e) => handleDomainUpdate('cognitive', 'supportingData', e.target.value)}
                  placeholder="Psychoeducational testing, cognitive assessments..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Impact on General Education</Label>
                <Textarea
                  value={data.cognitive?.impactOnGeneralEd || ''}
                  onChange={(e) => handleDomainUpdate('cognitive', 'impactOnGeneralEd', e.target.value)}
                  placeholder="How do cognitive factors affect learning?"
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Additional Considerations */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Additional Considerations</h3>
            <div className="grid gap-3">
              <div>
                <Label>Environmental Factors</Label>
                <Textarea
                  value={data.environmentalFactors || ''}
                  onChange={(e) => onUpdate({ ...data, environmentalFactors: e.target.value })}
                  placeholder="Factors in home, school, or community that impact learning..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Cultural/Linguistic Considerations</Label>
                <Textarea
                  value={data.culturalLinguistic || ''}
                  onChange={(e) => onUpdate({ ...data, culturalLinguistic: e.target.value })}
                  placeholder="Language background, cultural factors relevant to education..."
                  rows={2}
                />
              </div>
              <div>
                <Label>Assistive Technology Needs</Label>
                <Textarea
                  value={data.assistiveTechnology || ''}
                  onChange={(e) => onUpdate({ ...data, assistiveTechnology: e.target.value })}
                  placeholder="Current or potential assistive technology to support learning..."
                  rows={2}
                />
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};