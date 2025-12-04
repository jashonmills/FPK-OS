-- Update Snugz logo to use local asset
UPDATE partner_resources 
SET logo_url = '/partners/snugz-logo.png'
WHERE name = 'Snugz';