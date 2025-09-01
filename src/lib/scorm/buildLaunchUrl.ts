export function buildLaunchUrl(edgeBase: string, pkgId: string, scoHref: string): string {
  // scoHref might be 'module1/index.html' or 'content/index.html'
  const path = scoHref.startsWith("/") ? scoHref.slice(1) : scoHref;
  const u = new URL(`${edgeBase.replace(/\/$/, "")}/scorm-content-proxy`);
  u.searchParams.set("pkg", pkgId);
  u.searchParams.set("path", path);
  return u.toString();
}