-- Create function to sync auth users to our users table
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to execute the function after auth user creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_auth_user();

-- Insert existing auth user
INSERT INTO public.users (id, email)
SELECT id, email
FROM auth.users
WHERE id = 'd7e4f588-66e0-47b8-afb5-02a2d9d883ea'
ON CONFLICT (id) DO NOTHING;
