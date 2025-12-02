import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Play, 
  Loader2, 
  Database, 
  BookOpen, 
  Key, 
  Shield, 
  CheckCircle2, 
  XCircle,
  Clock,
  Cpu,
  FileText
} from 'lucide-react';
import { PlatformAdminOrgSelector } from './PlatformAdminOrgSelector';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useOrgKnowledgeBase } from '@/hooks/useOrgKnowledgeBase';
import { useOrgApiKeys } from '@/hooks/useOrgApiKeys';

interface TestResponse {
  response: string;
  model: string;
  latencyMs: number;
  governanceRulesApplied: number;
  knowledgeBaseUsed: boolean;
  toolCalls?: any[];
  error?: string;
}

const AIGovernanceTestPanel: React.FC = () => {
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [testMessage, setTestMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [testResponse, setTestResponse] = useState<TestResponse | null>(null);
  const [seedingKB, setSeedingKB] = useState(false);
  const [seedingRule, setSeedingRule] = useState(false);
  const [seedingBYOK, setSeedingBYOK] = useState(false);

  // Fetch available AI tools
  const { data: aiTools = [] } = useQuery({
    queryKey: ['ai-tools-for-testing'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_tools')
        .select('id, display_name, description')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) throw error;
      return data || [];
    }
  });

  // Get KB and BYOK status for selected org
  const { documents: kbDocs } = useOrgKnowledgeBase(selectedOrgId);
  const { keys: apiKeys } = useOrgApiKeys(selectedOrgId);

  // Fetch governance rules for selected org
  const { data: governanceRules = [] } = useQuery({
    queryKey: ['governance-rules-for-testing', selectedOrgId],
    queryFn: async () => {
      if (!selectedOrgId) return [];
      const { data, error } = await supabase
        .from('ai_governance_rules')
        .select('*')
        .or(`org_id.eq.${selectedOrgId},org_id.is.null`);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!selectedOrgId
  });

  const handleSendTest = async () => {
    if (!selectedToolId || !testMessage.trim()) {
      toast.error('Please select a tool and enter a message');
      return;
    }

    setIsLoading(true);
    setTestResponse(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('Not authenticated');
      }

      const response = await supabase.functions.invoke('unified-ai-gateway', {
        body: {
          toolId: selectedToolId,
          orgId: selectedOrgId,
          message: testMessage,
          messageHistory: []
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      setTestResponse(response.data);
      toast.success('Test completed successfully');
    } catch (error: any) {
      console.error('Test failed:', error);
      setTestResponse({
        response: '',
        model: '',
        latencyMs: 0,
        governanceRulesApplied: 0,
        knowledgeBaseUsed: false,
        error: error.message
      });
      toast.error('Test failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const seedTestKnowledgeBase = async () => {
    if (!selectedOrgId) {
      toast.error('Please select an organization first');
      return;
    }

    setSeedingKB(true);
    try {
      const testContent = `# Organization Curriculum Guidelines

## Teaching Standards
Our organization follows evidence-based teaching practices with a focus on:
- Student-centered learning approaches
- Formative assessment strategies
- Differentiated instruction methods

## Subject Area Standards

### Mathematics
- Emphasis on problem-solving and mathematical reasoning
- Use of manipulatives and visual representations
- Integration of real-world applications

### English Language Arts
- Balanced literacy approach
- Focus on reading comprehension strategies
- Writing across the curriculum

## Assessment Policies
- Regular formative assessments to guide instruction
- Summative assessments aligned with learning objectives
- Student self-assessment and reflection opportunities

## Technology Integration
- Responsible use of AI tools in education
- Digital literacy skills development
- Blended learning approaches where appropriate`;

      const { error } = await supabase
        .from('org_knowledge_base')
        .insert({
          org_id: selectedOrgId,
          title: 'Test Curriculum Guidelines',
          file_name: 'test-curriculum-guidelines.md',
          file_type: 'text/markdown',
          content: testContent,
          content_chunks: testContent.split('\n\n').filter(c => c.trim()),
          is_active: true
        });

      if (error) throw error;
      toast.success('Test knowledge base document added');
    } catch (error: any) {
      toast.error('Failed to seed KB: ' + error.message);
    } finally {
      setSeedingKB(false);
    }
  };

  const seedTestGovernanceRule = async () => {
    if (!selectedOrgId) {
      toast.error('Please select an organization first');
      return;
    }

    setSeedingRule(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('ai_governance_rules')
        .insert({
          org_id: selectedOrgId,
          name: 'Test Block: Creative Fiction',
          description: 'AI should not generate creative fiction or fantasy stories for testing purposes',
          category: 'Content Generation',
          allowed: false,
          applicable_roles: ['student', 'viewer'],
          created_by: user?.id
        });

      if (error) throw error;
      toast.success('Test governance rule added');
    } catch (error: any) {
      toast.error('Failed to seed rule: ' + error.message);
    } finally {
      setSeedingRule(false);
    }
  };

  const seedTestBYOK = async () => {
    if (!selectedOrgId) {
      toast.error('Please select an organization first');
      return;
    }

    setSeedingBYOK(true);
    try {
      // Add a placeholder BYOK entry (key is fake - just for testing the routing logic)
      const { error } = await supabase
        .from('org_api_keys')
        .upsert({
          org_id: selectedOrgId,
          provider: 'openai',
          encrypted_key: btoa('sk-test-placeholder-key-for-routing-validation'),
          is_active: false, // Inactive so it won't break actual requests
          display_name: 'OpenAI (Test Key)'
        }, {
          onConflict: 'org_id,provider'
        });

      if (error) throw error;
      toast.success('Test BYOK entry added (inactive for safety)');
    } catch (error: any) {
      toast.error('Failed to seed BYOK: ' + error.message);
    } finally {
      setSeedingBYOK(false);
    }
  };

  const blockedRules = governanceRules.filter(r => !r.allowed);
  const activeKBDocs = kbDocs.filter(d => d.is_active);
  const activeKeys = apiKeys.filter(k => k.is_active);

  return (
    <div className="space-y-6">
      <PlatformAdminOrgSelector
        selectedOrgId={selectedOrgId}
        onOrgChange={setSelectedOrgId}
      />

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Knowledge Base</p>
                <p className="text-lg font-semibold">
                  {activeKBDocs.length} Active Document{activeKBDocs.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <Shield className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Governance Rules</p>
                <p className="text-lg font-semibold">
                  {blockedRules.length} Blocked Rule{blockedRules.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <Key className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">BYOK Keys</p>
                <p className="text-lg font-semibold">
                  {activeKeys.length} Active Key{activeKeys.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seed Test Data */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Seed Test Data
          </CardTitle>
          <CardDescription>
            Add sample data to test governance features. Select an organization first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={seedTestKnowledgeBase}
              disabled={!selectedOrgId || seedingKB}
            >
              {seedingKB ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <BookOpen className="h-4 w-4 mr-2" />}
              Add Test KB Document
            </Button>
            <Button
              variant="outline"
              onClick={seedTestGovernanceRule}
              disabled={!selectedOrgId || seedingRule}
            >
              {seedingRule ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
              Add Test Governance Rule
            </Button>
            <Button
              variant="outline"
              onClick={seedTestBYOK}
              disabled={!selectedOrgId || seedingBYOK}
            >
              {seedingBYOK ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Key className="h-4 w-4 mr-2" />}
              Add Test BYOK Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Request Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Gateway Test Request
          </CardTitle>
          <CardDescription>
            Send a test request through the Unified AI Gateway to verify governance features.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>AI Tool</Label>
              <Select value={selectedToolId} onValueChange={setSelectedToolId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an AI tool" />
                </SelectTrigger>
                <SelectContent>
                  {aiTools.map(tool => (
                    <SelectItem key={tool.id} value={tool.id}>
                      {tool.display_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Organization Context</Label>
              <div className="h-10 px-3 py-2 bg-muted rounded-md text-sm flex items-center">
                {selectedOrgId ? 'Organization-scoped request' : 'Platform-level request (no org)'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Test Message</Label>
            <Textarea
              placeholder="Enter your test message here... Try messages that might trigger governance rules or benefit from KB context."
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSendTest} 
              disabled={isLoading || !selectedToolId || !testMessage.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Send Test Request
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Response */}
      {testResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Test Response
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResponse.error ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 text-destructive font-medium mb-2">
                  <XCircle className="h-5 w-5" />
                  Error
                </div>
                <p className="text-sm">{testResponse.error}</p>
              </div>
            ) : (
              <>
                {/* Metadata Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Cpu className="h-3 w-3" />
                      Model
                    </div>
                    <p className="font-mono text-sm truncate">{testResponse.model}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Clock className="h-3 w-3" />
                      Latency
                    </div>
                    <p className="font-mono text-sm">{testResponse.latencyMs}ms</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <Shield className="h-3 w-3" />
                      Rules Applied
                    </div>
                    <p className="font-mono text-sm">{testResponse.governanceRulesApplied}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">
                      <BookOpen className="h-3 w-3" />
                      KB Used
                    </div>
                    <div className="flex items-center gap-1">
                      {testResponse.knowledgeBaseUsed ? (
                        <Badge variant="default" className="bg-green-500">Yes</Badge>
                      ) : (
                        <Badge variant="secondary">No</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Response Content */}
                <div>
                  <Label className="text-muted-foreground text-xs">AI Response</Label>
                  <div className="mt-2 p-4 bg-muted/50 rounded-lg border">
                    <p className="whitespace-pre-wrap text-sm">{testResponse.response}</p>
                  </div>
                </div>

                {testResponse.toolCalls && testResponse.toolCalls.length > 0 && (
                  <div>
                    <Label className="text-muted-foreground text-xs">Tool Calls</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg border">
                      <pre className="text-xs overflow-auto">
                        {JSON.stringify(testResponse.toolCalls, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Test Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Suggested Test Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">1. Basic Request (No Org)</p>
              <p className="text-muted-foreground">Clear the organization, select any tool, send a simple message. Should use default model.</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">2. Knowledge Base Injection</p>
              <p className="text-muted-foreground">Select an org with KB docs, use "Lesson Planner" or "Research Assistant", ask about curriculum. Response should reference KB content.</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">3. Governance Rule Enforcement</p>
              <p className="text-muted-foreground">Add a rule blocking "creative fiction", then ask AI to "write a fantasy story". Should politely decline.</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-medium">4. BYOK Routing</p>
              <p className="text-muted-foreground">Add an active OpenAI BYOK key, send a request. Check edge function logs to verify BYOK routing.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIGovernanceTestPanel;
