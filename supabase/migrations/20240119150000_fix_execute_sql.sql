-- Add secure version of execute_sql function with fixed search_path
CREATE OR REPLACE FUNCTION public.execute_sql(sql text) 
RETURNS void 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$ LANGUAGE plpgsql;

-- Update function permissions
REVOKE ALL ON FUNCTION public.execute_sql(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
