import { XMLParser } from 'fast-xml-parser';

export interface ManifestResource {
  identifier: string;
  type: string;
  href: string;
  scormType?: string;
  adlcpScormType?: string;
  metadata?: any;
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
  sequencing?: any;
}

export interface ManifestOrganization {
  identifier: string;
  title: string;
  structure?: string;
  items: ManifestItem[];
  objectives?: any[];
  sequencing?: any;
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
      const manifest = parsedXml.manifest || parsedXml['imscp:manifest'];

      if (!manifest) {
        throw new Error('No manifest element found in XML');
      }

      const validation = this.validateManifest(manifest);
      const standard = this.detectStandard(manifest);
      const version = this.extractVersion(manifest, standard);

      // Extract basic manifest info
      const identifier = manifest['@identifier'] || 'unknown';
      const title = this.extractTitle(manifest) || 'Untitled Package';
      const description = this.extractDescription(manifest);

      // Parse organizations
      const organizations = this.parseOrganizations(manifest.organizations, standard);
      
      // Parse resources
      const resources = this.parseResources(manifest.resources);
      
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
        defaultOrganization: manifest.organizations?.['@default'] || organizations[0]?.identifier,
        schemaLocation: manifest['@schemaLocation'] || manifest['@xsi:schemaLocation'],
        validation
      };
    } catch (error) {
      console.error('Manifest parsing error:', error);
      throw new Error(`Failed to parse manifest: ${error.message}`);
    }
  }

  private detectStandard(manifest: any): 'SCORM 1.2' | 'SCORM 2004' {
    // Check namespaces and schema locations
    const xmlNamespaces = Object.keys(manifest).filter(key => key.startsWith('@xmlns'));
    const schemaLocation = manifest['@schemaLocation'] || manifest['@xsi:schemaLocation'] || '';

    // SCORM 2004 indicators
    if (xmlNamespaces.some(ns => manifest[ns]?.includes('imsss')) ||
        schemaLocation.includes('imsss') ||
        schemaLocation.includes('2004') ||
        manifest.organizations?.organization?.sequencing ||
        manifest.resources?.resource?.some((r: any) => r['@adlcp:scormType'])) {
      return 'SCORM 2004';
    }

    // SCORM 1.2 indicators or default
    return 'SCORM 1.2';
  }

  private extractVersion(manifest: any, standard: 'SCORM 1.2' | 'SCORM 2004'): string {
    if (standard === 'SCORM 2004') {
      const schemaLocation = manifest['@schemaLocation'] || manifest['@xsi:schemaLocation'] || '';
      if (schemaLocation.includes('2004_4th')) return '2004 4th Edition';
      if (schemaLocation.includes('2004_3rd')) return '2004 3rd Edition';
      if (schemaLocation.includes('2004')) return '2004';
    }
    
    return manifest['@version'] || (standard === 'SCORM 1.2' ? '1.2' : '2004');
  }

  private extractTitle(manifest: any): string {
    // Try multiple paths for title
    const metadata = manifest.metadata;
    if (metadata?.lom?.general?.title) {
      const title = metadata.lom.general.title;
      return title.langstring?.["#text"] || title.langstring || title["#text"] || title;
    }
    
    if (metadata?.title) {
      return metadata.title["#text"] || metadata.title;
    }

    // Fallback to organization title
    const orgs = manifest.organizations?.organization;
    if (orgs) {
      const firstOrg = Array.isArray(orgs) ? orgs[0] : orgs;
      return firstOrg?.title?.["#text"] || firstOrg?.title || firstOrg?.["@title"];
    }

    return 'Untitled SCORM Package';
  }

  private extractDescription(manifest: any): string | undefined {
    const metadata = manifest.metadata;
    if (metadata?.lom?.general?.description) {
      const desc = metadata.lom.general.description;
      return desc.langstring?.["#text"] || desc.langstring || desc["#text"] || desc;
    }
    
    if (metadata?.description) {
      return metadata.description["#text"] || metadata.description;
    }
    
    return undefined;
  }

  private extractMetadata(manifest: any): any {
    return manifest.metadata || {};
  }

  private parseOrganizations(organizationsNode: any, standard: 'SCORM 1.2' | 'SCORM 2004'): ManifestOrganization[] {
    if (!organizationsNode) return [];

    const orgs = organizationsNode.organization;
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

  private parseItems(itemsNode: any, standard: 'SCORM 1.2' | 'SCORM 2004', level = 0): ManifestItem[] {
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

  private parseResources(resourcesNode: any): ManifestResource[] {
    if (!resourcesNode?.resource) return [];

    const resources = Array.isArray(resourcesNode.resource) ? resourcesNode.resource : [resourcesNode.resource];
    
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