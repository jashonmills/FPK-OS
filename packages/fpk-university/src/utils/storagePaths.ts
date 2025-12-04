export const courseAssetPath = (orgId: string, courseId: string, filename: string) =>
  `org-assets/${orgId}/courses/${courseId}/${Date.now()}-${filename}`;

export const courseBackgroundPath = (orgId: string, courseId: string, filename: string) =>
  `org-assets/${orgId}/courses/${courseId}/background-${Date.now()}-${filename}`;

export const slideAssetPath = (orgId: string, courseId: string, slideId: string, filename: string) =>
  `org-assets/${orgId}/courses/${courseId}/slides/${slideId}/${Date.now()}-${filename}`;