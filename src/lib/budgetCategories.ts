export const STANDARD_CATEGORIES = [
  'Labor Costs',
  'Software & Tools',
  'Marketing & Advertising',
  'Equipment & Hardware',
  'Professional Services',
] as const;

export type StandardCategory = typeof STANDARD_CATEGORIES[number];

export const CUSTOM_CATEGORY_VALUE = '__custom__';
