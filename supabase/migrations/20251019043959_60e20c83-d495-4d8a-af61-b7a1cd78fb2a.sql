-- First add unique constraint on source_name
ALTER TABLE ai_knowledge_sources ADD CONSTRAINT ai_knowledge_sources_source_name_key UNIQUE (source_name);

-- Now add all knowledge base sources
INSERT INTO ai_knowledge_sources (source_name, url, description, is_active) VALUES
-- Tier 2: Clinical & Educational Resources
('National Autistic Society UK', 'https://www.autism.org.uk/', 'UK''s leading charity for autistic people and families with extensive practical advice', true),
('British Dyslexia Association', 'https://www.bdadyslexia.org.uk/', 'Primary voice for dyslexic people in UK with resources for educators and parents', true),
('ADHD Foundation UK', 'https://www.adhdfoundation.org.uk/', 'Europe''s largest user-led ADHD agency providing training and therapy models', true),
('ASHA', 'https://www.asha.org/', 'Professional association for speech-language pathologists and audiologists', true),
('WFOT', 'https://wfot.org/', 'Global standard-setter for occupational therapy and sensory integration', true),
('NIMH', 'https://www.nimh.nih.gov/', 'National Institute of Mental Health - leading US research institution', true),
('CHADD', 'https://chadd.org/', 'Leading ADHD advocacy organization providing resources and support', true),
('CDC', 'https://www.cdc.gov/', 'Centers for Disease Control and Prevention - US health authority', true),
-- Tier 3: Institutional & Community Resources  
('Hanen Centre', 'http://www.hanen.org/', 'Global leader in early childhood language intervention programs', true),
('Autism CRC Australia', 'https://www.autismcrc.com.au/', 'World''s first national cooperative research center focused on autism', true),
('NCSE Ireland', 'https://ncse.ie/', 'Ireland''s primary statutory body for special education', true),
('AsIAm Ireland', 'https://asiam.ie/', 'Ireland''s leading autism advocacy organization', true),
('LD OnLine', 'https://www.ldonline.org/', 'Comprehensive US website on learning disabilities and ADHD', true),
('CPIR', 'https://www.parentcenterhub.org/', 'US Department of Education hub connecting parents to disability resources', true),
('The Arc', 'https://thearc.org/', 'Largest US community organization for intellectual and developmental disabilities', true),
('Dyslexia Association Ireland', 'https://www.dyslexia.ie/', 'Primary Irish resource for dyslexia information and support', true),
('HSE Ireland', 'https://www.hse.ie/', 'Ireland''s Health Service Executive disability services division', true),
-- Tier 4: Specialized Resources & Methodologies
('ADDitude Magazine', 'https://www.additudemag.com/', 'Leading publication providing practical ADHD strategies and support', true),
('Council for Exceptional Children', 'https://exceptionalchildren.org/', 'Professional association advancing success of children with exceptionalities', true),
('MIT OpenCourseWare', 'https://ocw.mit.edu/', 'MIT''s free educational resources on brain and cognitive sciences', true),
('Autism Society', 'https://autismsociety.org/', 'Leading US grassroots autism organization', true),
('Learning Disabilities Association', 'https://ldaamerica.org/', 'US national organization supporting individuals with learning disabilities', true),
('National Center for LD', 'https://www.ncld.org/', 'US advocacy organization for learning disabilities and differences', true)
ON CONFLICT (source_name) DO NOTHING;