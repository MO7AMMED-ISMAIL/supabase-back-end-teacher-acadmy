-- Rename profiles table to users
ALTER TABLE profiles RENAME TO users;

-- Rename the trigger for updated_at
ALTER TRIGGER update_profiles_updated_at ON users RENAME TO update_users_updated_at;

-- The handle_new_user function needs to be updated to refer to 'users' table
CREATE OR REPLACE FUNCTION public.
()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, full_name, email, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'role', 'student')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
