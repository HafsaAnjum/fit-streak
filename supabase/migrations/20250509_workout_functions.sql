
-- Function to create a workout plan with days
CREATE OR REPLACE FUNCTION public.create_workout_plan(
  p_user_id UUID,
  p_start_date TIMESTAMPTZ,
  p_end_date TIMESTAMPTZ,
  p_workout_days JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_id UUID;
  v_day JSONB;
BEGIN
  -- Create the workout plan
  INSERT INTO public.workout_plans (
    user_id,
    start_date,
    end_date
  ) VALUES (
    p_user_id,
    p_start_date,
    p_end_date
  ) RETURNING id INTO v_plan_id;
  
  -- Add the workout days
  FOR v_day IN SELECT * FROM jsonb_array_elements(p_workout_days)
  LOOP
    INSERT INTO public.workout_days (
      plan_id,
      day_date,
      workout_type,
      duration,
      difficulty,
      description
    ) VALUES (
      v_plan_id,
      (v_day->>'day_date')::TIMESTAMPTZ,
      v_day->>'workout_type',
      (v_day->>'duration')::INTEGER,
      v_day->>'difficulty',
      v_day->>'description'
    );
  END LOOP;
  
  RETURN v_plan_id;
END;
$$;

-- Function to get the current workout plan with days
CREATE OR REPLACE FUNCTION public.get_current_workout_plan(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  days JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_id UUID;
BEGIN
  -- Get the most recent plan
  SELECT id INTO v_plan_id
  FROM public.workout_plans
  WHERE user_id = p_user_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Return the plan with days
  RETURN QUERY
  SELECT 
    wp.id,
    wp.user_id,
    wp.start_date,
    wp.end_date,
    wp.created_at,
    wp.updated_at,
    (
      SELECT jsonb_agg(jsonb_build_object(
        'id', wd.id,
        'plan_id', wd.plan_id,
        'day_date', wd.day_date,
        'workout_type', wd.workout_type,
        'duration', wd.duration,
        'difficulty', wd.difficulty,
        'description', wd.description,
        'completed', wd.completed,
        'created_at', wd.created_at,
        'updated_at', wd.updated_at
      ))
      FROM public.workout_days wd
      WHERE wd.plan_id = wp.id
      ORDER BY wd.day_date ASC
    ) AS days
  FROM public.workout_plans wp
  WHERE wp.id = v_plan_id;
END;
$$;

-- Function to complete a workout day
CREATE OR REPLACE FUNCTION public.complete_workout_day(
  p_day_id UUID,
  p_completed BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_user_id UUID;
  v_current_user_id UUID;
BEGIN
  -- Get the user id of the plan
  SELECT wp.user_id INTO v_plan_user_id
  FROM public.workout_plans wp
  JOIN public.workout_days wd ON wd.plan_id = wp.id
  WHERE wd.id = p_day_id;
  
  -- Get current user id
  v_current_user_id := auth.uid();
  
  -- Check if current user owns the plan
  IF v_plan_user_id != v_current_user_id THEN
    RETURN false;
  END IF;
  
  -- Update the workout day
  UPDATE public.workout_days
  SET completed = p_completed
  WHERE id = p_day_id;
  
  RETURN true;
END;
$$;

-- Function to get today's workout
CREATE OR REPLACE FUNCTION public.get_todays_workout(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_plan_id UUID;
  v_today DATE := CURRENT_DATE;
  v_result JSONB;
BEGIN
  -- Get the current plan id
  SELECT id INTO v_plan_id
  FROM public.workout_plans
  WHERE user_id = p_user_id
    AND start_date <= v_today
    AND end_date >= v_today
  ORDER BY created_at DESC
  LIMIT 1;
  
  IF v_plan_id IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Get today's workout
  SELECT jsonb_build_object(
    'id', wd.id,
    'plan_id', wd.plan_id,
    'day_date', wd.day_date,
    'workout_type', wd.workout_type,
    'duration', wd.duration,
    'difficulty', wd.difficulty,
    'description', wd.description,
    'completed', wd.completed
  ) INTO v_result
  FROM public.workout_days wd
  WHERE wd.plan_id = v_plan_id
    AND DATE(wd.day_date) = v_today;
    
  RETURN v_result;
END;
$$;
