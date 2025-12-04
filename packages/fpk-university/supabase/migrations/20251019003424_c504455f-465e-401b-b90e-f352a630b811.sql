-- Update Snugz partner resource with new description and brand image
UPDATE partner_resources 
SET 
  description = 'Our products are thoughtfully designed to be more than just gifts—they''re emotional support tools. These tools encourage children to express their feelings, build resilience, and navigate emotions in a safe, playful way.',
  logo_url = '/partners/snugz-brand-image.png'
WHERE name = 'Snugz';