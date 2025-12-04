import { XMLParser } from 'fast-xml-parser';

export interface ManifestResource {
  identifier: string;
  type: string;
  href: string;
  scormType?: string;
  adlcpScormType?: string;
  metadata?: unknown;
}

export interface ManifestItem {
  identifier: string;
  title: string;
  identifierref?: string;
  isVisible?: boolean;
  parameters?: string;
  masteryScore?: number;
  prerequisites?: string[];
  children?: ManifestItem[];
  resourceHref?: string;
  completionThreshold?: number;
  timeLimitAction?: string;
  dataFromLMS?: string;
  sequencing?: unknown;
}

export interface ManifestOrganization {
  identifier: string;
  title: string;
  structure?: string;
  items: ManifestItem[];
  objectives?: unknown[];
  sequencing?: unknown;
}

export interface ParsedManifest {
  version: string;
  standard: 'SCORM 1.2' | 'SCORM 2004';
  identifier: string;
  title: string;
  description?: string;
  organizations: ManifestOrganization[];
  resources: ManifestResource[];
  scos: Array<{
    id: string;
    identifier: string;
    title: string;
    launch_href: string;
    parameters?: string;
    mastery_score?: number;
    prerequisites?: string[];
    seq_order: number;
    resourceType?: string;
    scormType?: string;
    isLaunchable: boolean;
    sequencing?: any;
  }>;
  metadata?: any;
  defaultOrganization?: string;
  schemaLocation?: string;
  validation: {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  };
}

export class ScormManifestParser {
  private xmlParser: XMLParser;

  constructor() {
    this.xmlParser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@',
      textNodeName: '#text',
      parseAttributeValue: true,
      trimValues: true,
      alwaysCreateTextNode: false,
      processEntities: true,
      htmlEntities: true
    });
  }

  public parseManifest(xmlContent: string): ParsedManifest {
    try {
      const parsedXml = this.xmlParser.parse(xmlContent);
      const manifest = (parsedXml as Record<string, unknown>).manifest || (parsedXml as Record<string, unknown>)['imscp:manifest'];

      if (!manifest) {
        throw new Error('No manifest element found in XML');
      }

      const validation = this.validateManifest(manifest);
      const standard = this.detectStandard(manifest);
      const version = this.extractVersion(manifest, standard);

      // Extract basic manifest info
      const m = manifest as Record<string, unknown>;
      const identifier = (m['@identifier'] as string) || 'unknown';
      const title = this.extractTitle(manifest) || 'Untitled Package';
      const description = this.extractDescription(manifest);

      // Parse organizations
      const organizations = this.parseOrganizations(m.organizations, standard);
      
      // Parse resources
      const resources = this.parseResources(m.resources);
      
      // Extract SCOs by matching items with resources
      const scos = this.extractScos(organizations, resources, standard);

      // Extract metadata
      const metadata = this.extractMetadata(manifest);

      return {
        version,
        standard,
        identifier,
        title,
        description,
        organizations,
        resources,
        scos,
        metadata,
        defaultOrganization: (m.organizations as any)?.['@default'] || organizations[0]?.identifier,
        schemaLocation: (m['@schemaLocation'] as string) || (m['@xsi:schemaLocation'] as string),
        validation
      };
    } catch (error: unknown) {
      // Narrow error safely
      const msg = (error && typeof error === 'object' && 'message' in error) ? String((error as any).message) : String(error);
      console.error('Manifest parsing error:', msg);
      throw new Error(`Failed to parse manifest: ${msg}`);
    }
  }

  private detectStandard(manifest: unknown): 'SCORM 1.2' | 'SCORM 2004' {
    if (!manifest || typeof manifest !== 'object') return 'SCORM 1.2';
    const m = manifest as Record<string, unknown>;
    // Check namespaces and schema locations
    const xmlNamespaces = Object.keys(m).filter(key => key.startsWith('@xmlns'));
    const schemaLocation = (m['@schemaLocation'] as string) || (m['@xsi:schemaLocation'] as string) || '';

    // SCORM 2004 indicators
    if (
      xmlNamespaces.some(ns => typeof m[ns] === 'string' && String(m[ns]).includes('imsss')) ||
      schemaLocation.includes('imsss') ||
      schemaLocation.includes('2004') ||
      ((m.organizations as any)?.organization?.sequencing) ||
      ((m.resources as any)?.resource && Array.isArray((m.resources as any).resource) && ((m.resources as any).resource as any[]).some(r => (r as any)['@adlcp:scormType']))
    ) {
      return 'SCORM 2004';
    }

    // SCORM 1.2 indicators or default
    return 'SCORM 1.2';
  }

  private extractVersion(manifest: unknown, standard: 'SCORM 1.2' | 'SCORM 2004'): string {
    const m = manifest as Record<string, unknown>;
    if (standard === 'SCORM 2004') {
      const schemaLocation = (m['@schemaLocation'] as string) || (m['@xsi:schemaLocation'] as string) || '';
      if (schemaLocation.includes('2004_4th')) return '2004 4th Edition';
      if (schemaLocation.includes('2004_3rd')) return '2004 3rd Edition';
      if (schemaLocation.includes('2004')) return '2004';
    }
    
    return (m['@version'] as string) || (standard === 'SCORM 1.2' ? '1.2' : '2004');
  }

  private extractTitle(manifest: unknown): string {
    // Try multiple paths for title
    const m = manifest as Record<string, any>;
    const metadata = m.metadata;
    if (metadata?.lom?.general?.title) {
      const title = metadata.lom.general.title;
      return title.langstring?.["#text"] || title.langstring || title["#text"] || title;
    }
    
    if (metadata?.title) {
      return metadata.title["#text"] || metadata.title;
    }

    // Fallback to organization title
    const orgs = (m.organizations as any)?.organization;
    if (orgs) {
      const firstOrg = Array.isArray(orgs) ? orgs[0] : orgs;
      return firstOrg?.title?.["#text"] || firstOrg?.title || firstOrg?.["@title"];
    }

    return 'Untitled SCORM Package';
  }

  private extractDescription(manifest: unknown): string | undefined {
    const m = manifest as Record<string, any>;
    const metadata = m.metadata;
    if (metadata?.lom?.general?.description) {
      const desc = metadata.lom.general.description;
      return desc.langstring?.["#text"] || desc.langstring || desc["#text"] || desc;
    }
    
    if (metadata?.description) {
      return metadata.description["#text"] || metadata.description;
    }
    
    return undefined;
  }

  private extractMetadata(manifest: unknown): unknown {
    const m = manifest as Record<string, unknown>;
    return m.metadata || {};
  }

  private parseOrganizations(organizationsNode: unknown, standard: 'SCORM 1.2' | 'SCORM 2004'): ManifestOrganization[] {
    if (!organizationsNode) return [];

    const orgs = (organizationsNode as any).organization;
    if (!orgs) return [];

    const orgArray = Array.isArray(orgs) ? orgs : [orgs];
    
    return orgArray.map((org: any, index: number) => ({
      identifier: org['@identifier'] || `org_${index}`,
      title: org.title?.["#text"] || org.title || org["@title"] || `Organization ${index + 1}`,
      structure: org['@structure'] || 'hierarchical',
      items: this.parseItems(org.item, standard),
      objectives: org.objectives || [],
      sequencing: standard === 'SCORM 2004' ? org.sequencing : undefined
    }));
  }

  private parseItems(itemsNode: unknown, standard: 'SCORM 1.2' | 'SCORM 2004', level = 0): ManifestItem[] {
    if (!itemsNode) return [];

    const items = Array.isArray(itemsNode) ? itemsNode : [itemsNode];
    
    return items.map((item: any, index: number) => ({
      identifier: item['@identifier'] || `item_${level}_${index}`,
      title: item.title?.["#text"] || item.title || item["@title"] || `Item ${index + 1}`,
      identifierref: item['@identifierref'],
      isVisible: item['@isvisible'] !== 'false', // Default to true
      parameters: item['@parameters'],
      masteryScore: item.masteryScore ? parseFloat(item.masteryScore) : undefined,
      prerequisites: item.prerequisites?.split(',').map((p: string) => p.trim()) || [],
      children: this.parseItems(item.item, standard, level + 1),
      sequencing: standard === 'SCORM 2004' ? item.sequencing : undefined,
      completionThreshold: item.completionThreshold ? parseFloat(item.completionThreshold) : undefined,
      timeLimitAction: item.timeLimitAction,
      dataFromLMS: item.dataFromLMS
    }));
  }

  private parseResources(resourcesNode: unknown): ManifestResource[] {
    if (!(resourcesNode as any)?.resource) return [];

    const resources = Array.isArray((resourcesNode as any).resource) ? (resourcesNode as any).resource : [(resourcesNode as any).resource];
    
    return resources.map((resource: any) => ({
      identifier: resource['@identifier'] || '',
      type: resource['@type'] || 'webcontent',
      href: resource['@href'] || resource['@xml:base'] || '',
      scormType: resource['@scormtype'] || resource['@adlcp:scormType'],
      adlcpScormType: resource['@adlcp:scormType'],
      metadata: resource.metadata
    }));
  }

  private extractScos(
    organizations: ManifestOrganization[], 
    resources: ManifestResource[], 
    standard: 'SCORM 1.2' | 'SCORM 2004'
  ): ParsedManifest['scos'] {
    const scos: ParsedManifest['scos'] = [];
    let seqOrder = 1;

    const processItems = (items: ManifestItem[], orgId: string) => {
      items.forEach((item) => {
        if (item.identifierref) {
          const resource = resources.find(r => r.identifier === item.identifierref);
          if (resource) {
            const isLaunchable = this.isLaunchableResource(resource, standard);
            
            scos.push({
              id: `${orgId}_${item.identifier}`,
              identifier: item.identifier,
              title: item.title,
              launch_href: resource.href,
              parameters: item.parameters,
              mastery_score: item.masteryScore,
              prerequisites: item.prerequisites || [],
              seq_order: seqOrder++,
              resourceType: resource.type,
              scormType: resource.scormType || resource.adlcpScormType,
              isLaunchable,
              sequencing: item.sequencing
            });
          }
        }
        
        // Process child items recursively
        if (item.children && item.children.length > 0) {
          processItems(item.children, orgId);
        }
      });
    };

    organizations.forEach(org => {
      processItems(org.items, org.identifier);
    });

    return scos;
  }

  private isLaunchableResource(resource: ManifestResource, standard: 'SCORM 1.2' | 'SCORM 2004'): boolean {
    if (standard === 'SCORM 1.2') {
      return resource.scormType === 'sco' || resource.type === 'webcontent';
    } else {
      return resource.adlcpScormType === 'sco' || resource.scormType === 'sco';
    }
  }

  private validateManifest(manifest: any): { isValid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Basic structure validation
    if (!manifest['@identifier']) {
      errors.push('Manifest missing required identifier attribute');
    }

    if (!manifest.organizations) {
      errors.push('Manifest missing organizations element');
    }

    if (!manifest.resources) {
      errors.push('Manifest missing resources element');
    }

    // Organizations validation
    if (manifest.organizations && !manifest.organizations.organization) {
      errors.push('Organizations element contains no organization');
    }

    // Resources validation
    if (manifest.resources && !manifest.resources.resource) {
      warnings.push('Resources element contains no resource');
    }

    // Check for broken references
    if (manifest.organizations?.organization) {
      const orgs = Array.isArray(manifest.organizations.organization) ? 
        manifest.organizations.organization : [manifest.organizations.organization];
      
      const resources = manifest.resources?.resource || [];
      const resourceIds = Array.isArray(resources) ? 
        resources.map((r: any) => r['@identifier']) : [resources['@identifier']];

      const checkItemRefs = (items: any[]) => {
        if (!items) return;
        const itemArray = Array.isArray(items) ? items : [items];
        
        itemArray.forEach((item: any) => {
          if (item['@identifierref'] && !resourceIds.includes(item['@identifierref'])) {
            errors.push(`Item '${item['@identifier']}' references unknown resource '${item['@identifierref']}'`);
          }
          
          if (item.item) {
            checkItemRefs(item.item);
          }
        });
      };

      orgs.forEach((org: any) => {
        if (org.item) {
          checkItemRefs(org.item);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export singleton instance
export const manifestParser = new ScormManifestParser();

// Convenience function
export function parseScormManifest(xmlContent: string): ParsedManifest {
  return manifestParser.parseManifest(xmlContent);
}
