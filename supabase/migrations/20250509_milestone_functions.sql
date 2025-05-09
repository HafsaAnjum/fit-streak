
-- Function to get all milestones
CREATE OR REPLACE FUNCTION public.get_all_milestones()
RETURNS SETOF public.milestones
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM public.milestones 
  ORDER BY target_value ASC;
$$;

-- Function to get user milestones with their milestone details
CREATE OR REPLACE FUNCTION public.get_user_milestones(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  milestone_id UUID,
  achieved BOOLEAN,
  achieved_at TIMESTAMPTZ,
  progress INTEGER,
  milestone_title TEXT,
  milestone_description TEXT,
  milestone_type TEXT,
  milestone_target_value INTEGER,
  milestone_icon TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    um.id,
    um.user_id,
    um.milestone_id,
    um.achieved,
    um.achieved_at,
    um.progress,
    m.title AS milestone_title,
    m.description AS milestone_description,
    m.type AS milestone_type,
    m.target_value AS milestone_target_value,
    m.icon AS milestone_icon
  FROM 
    public.user_milestones um
  JOIN 
    public.milestones m ON um.milestone_id = m.id
  WHERE 
    um.user_id = p_user_id
  ORDER BY 
    m.type, m.target_value;
$$;

-- Function to update milestone progress
CREATE OR REPLACE FUNCTION public.update_milestone_progress(
  p_user_id UUID,
  p_type TEXT,
  p_value INTEGER
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  r_milestone RECORD;
BEGIN
  -- Process each milestone of the given type
  FOR r_milestone IN 
    SELECT * FROM public.milestones WHERE type = p_type
  LOOP
    -- Check if user already has a progress record for this milestone
    DECLARE
      r_user_milestone RECORD;
    BEGIN
      SELECT * INTO r_user_milestone 
      FROM public.user_milestones
      WHERE user_id = p_user_id AND milestone_id = r_milestone.id;
      
      IF FOUND THEN
        -- Skip if already achieved
        IF r_user_milestone.achieved THEN
          CONTINUE;
        END IF;
        
        -- Update progress
        UPDATE public.user_milestones
        SET 
          progress = LEAST(p_value, r_milestone.target_value),
          achieved = p_value >= r_milestone.target_value,
          achieved_at = CASE WHEN p_value >= r_milestone.target_value AND NOT r_user_milestone.achieved 
                         THEN NOW() 
                         ELSE r_user_milestone.achieved_at 
                         END,
          updated_at = NOW()
        WHERE id = r_user_milestone.id;
      ELSE
        -- Create new record
        INSERT INTO public.user_milestones (
          user_id,
          milestone_id,
          progress,
          achieved,
          achieved_at
        ) VALUES (
          p_user_id,
          r_milestone.id,
          LEAST(p_value, r_milestone.target_value),
          p_value >= r_milestone.target_value,
          CASE WHEN p_value >= r_milestone.target_value THEN NOW() ELSE NULL END
        );
      END IF;
    END;
  END LOOP;
END;
$$;

-- Function to get newly achieved milestones (for notifications)
CREATE OR REPLACE FUNCTION public.get_newly_achieved_milestones(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  type TEXT,
  target_value INTEGER,
  icon TEXT
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    m.id, 
    m.title, 
    m.description, 
    m.type, 
    m.target_value, 
    m.icon
  FROM 
    public.user_milestones um
  JOIN 
    public.milestones m ON um.milestone_id = m.id
  WHERE 
    um.user_id = p_user_id
    AND um.achieved = true
    AND um.achieved_at >= NOW() - INTERVAL '5 minutes';
$$;
