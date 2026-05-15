-- Enforce one department_chair per department
CREATE UNIQUE INDEX IF NOT EXISTS one_chair_per_dept 
ON public.users (department_id) 
WHERE (role = 'department_chair');
