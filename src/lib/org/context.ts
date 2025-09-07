// Organization Context Helpers
export function getActiveOrgId(): string | null {
  // Check URL search params first (?org=...)
  const urlParams = new URLSearchParams(window.location.search);
  const orgId = urlParams.get('org');
  
  if (orgId) {
    return orgId;
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