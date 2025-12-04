-- Enable RLS on new Phase 2 tables
ALTER TABLE extraction_circuit_breaker ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_telemetry ENABLE ROW LEVEL SECURITY;

-- RLS policies for extraction_circuit_breaker (admin-only access)
CREATE POLICY "Super admins can view circuit breaker" ON extraction_circuit_breaker
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'::app_role
    )
  );

CREATE POLICY "Super admins can modify circuit breaker" ON extraction_circuit_breaker
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'::app_role
    )
  );

-- RLS policies for extraction_telemetry (family members can view their own)
CREATE POLICY "Family members can view their extraction telemetry" ON extraction_telemetry
  FOR SELECT
  TO authenticated
  USING (
    family_id IN (
      SELECT family_id FROM family_members
      WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Super admins can view all extraction telemetry" ON extraction_telemetry
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid() AND role = 'super_admin'::app_role
    )
  );

CREATE POLICY "System can insert extraction telemetry" ON extraction_telemetry
  FOR INSERT
  TO authenticated
  WITH CHECK (true);