-- Migration to allow service_role full access to all tables
-- This ensures the backend (using service role) can perform all operations
-- while keeping the tables protected from anonymous or unauthorized access.

DO $$ 
DECLARE
    t text;
    tables text[] := ARRAY[
        'users', 
        'teachers', 
        'subjects', 
        'teacher_subjects', 
        'students', 
        'enrollments', 
        'schedules', 
        'attendance', 
        'attendance_records'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        -- Drop existing policy if it exists to avoid errors
        EXECUTE format('DROP POLICY IF EXISTS "Service role full access" ON %I', t);
        
        -- Create the policy for the service_role
        EXECUTE format('CREATE POLICY "Service role full access" ON %I FOR ALL TO service_role USING (true) WITH CHECK (true)', t);
        
        -- Ensure RLS is enabled (should already be, but just in case)
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;
