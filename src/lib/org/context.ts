// Organization Context Helpers
export function getActiveOrgId(): string | null {
  // Check URL search params first (?org=...)
  const urlParams = new URLSearchParams(window.location.search);
  const orgId = urlParams.get('org');
  
  if (orgId) {
    return orgId;
  }
  
  // Check URL path pattern /org/{orgId}/...
  const pathMatch = window.location.pathname.match(/\/org\/([^\/]+)/);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }
  
  return null;
}

export function assertOrg(): string {
  const orgId = getActiveOrgId();
  if (!orgId) {
    throw new Error('No active organization context found');
  }
  return orgId;
}

export function buildOrgRoute(path: string): string {
  const orgId = getActiveOrgId();
  if (!orgId) {
    throw new Error('No active organization context for route building');
  }
  
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}org=${orgId}`;
}

export function isInOrgMode(): boolean {
  return getActiveOrgId() !== null;
}