drop function if exists public.is_approved();

revoke execute on function public.ensure_user_profile() from public, anon;
revoke execute on function public.has_verified_profile() from public, anon;
revoke execute on function public.current_user_role() from public, anon;
revoke execute on function public.is_admin() from public, anon;
revoke execute on function public.is_department_chair() from public, anon;

grant execute on function public.ensure_user_profile() to authenticated;
grant execute on function public.has_verified_profile() to authenticated;
grant execute on function public.current_user_role() to authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.is_department_chair() to authenticated;;
