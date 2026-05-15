drop policy "Faculty and reviewers can delete reports" on "public"."accomplishment_reports";

drop policy "Enable select for authenticated users only" on "public"."form_a_publications";

drop policy "Users can insert their own records" on "public"."form_a_publications";

drop policy "Users can update their own records" on "public"."form_a_publications";

drop policy "Enable select for authenticated users only" on "public"."form_b_grants_and_fellowships";

drop policy "Users can insert their own records" on "public"."form_b_grants_and_fellowships";

drop policy "Users can update their own records" on "public"."form_b_grants_and_fellowships";

drop policy "Enable select for authenticated users only" on "public"."form_c_presentations";

drop policy "Users can insert their own records" on "public"."form_c_presentations";

drop policy "Users can update their own records" on "public"."form_c_presentations";

drop policy "Enable select for authenticated users only" on "public"."form_d_patents";

drop policy "Users can insert their own records" on "public"."form_d_patents";

drop policy "Users can update their own records" on "public"."form_d_patents";

drop policy "Enable select for authenticated users only" on "public"."form_e_creative_work_outputs";

drop policy "Users can insert their own records" on "public"."form_e_creative_work_outputs";

drop policy "Users can update their own records" on "public"."form_e_creative_work_outputs";

drop policy "Enable select for authenticated users only" on "public"."form_f_awards_and_grants";

drop policy "Users can insert their own records" on "public"."form_f_awards_and_grants";

drop policy "Users can update their own records" on "public"."form_f_awards_and_grants";

drop policy "Enable select for authenticated users only" on "public"."form_g_trainings";

drop policy "Users can insert their own records" on "public"."form_g_trainings";

drop policy "Users can update their own records" on "public"."form_g_trainings";

drop policy "Enable select for authenticated users only" on "public"."form_h_extension_programs";

drop policy "Users can insert their own records" on "public"."form_h_extension_programs";

drop policy "Users can update their own records" on "public"."form_h_extension_programs";

drop policy "Enable select for authenticated users only" on "public"."form_i_partnerships";

drop policy "Users can insert their own records" on "public"."form_i_partnerships";

drop policy "Users can update their own records" on "public"."form_i_partnerships";

drop policy "Enable select for authenticated users only" on "public"."form_j_authorships";

drop policy "Users can insert their own records" on "public"."form_j_authorships";

drop policy "Users can update their own records" on "public"."form_j_authorships";

drop policy "Enable select for authenticated users only" on "public"."form_k_other_accomplishments";

drop policy "Users can insert their own records" on "public"."form_k_other_accomplishments";

drop policy "Users can update their own records" on "public"."form_k_other_accomplishments";

revoke delete on table "public"."form_a_publications" from "anon";

revoke insert on table "public"."form_a_publications" from "anon";

revoke references on table "public"."form_a_publications" from "anon";

revoke select on table "public"."form_a_publications" from "anon";

revoke trigger on table "public"."form_a_publications" from "anon";

revoke truncate on table "public"."form_a_publications" from "anon";

revoke update on table "public"."form_a_publications" from "anon";

revoke delete on table "public"."form_a_publications" from "authenticated";

revoke insert on table "public"."form_a_publications" from "authenticated";

revoke references on table "public"."form_a_publications" from "authenticated";

revoke select on table "public"."form_a_publications" from "authenticated";

revoke trigger on table "public"."form_a_publications" from "authenticated";

revoke truncate on table "public"."form_a_publications" from "authenticated";

revoke update on table "public"."form_a_publications" from "authenticated";

revoke delete on table "public"."form_a_publications" from "service_role";

revoke insert on table "public"."form_a_publications" from "service_role";

revoke references on table "public"."form_a_publications" from "service_role";

revoke select on table "public"."form_a_publications" from "service_role";

revoke trigger on table "public"."form_a_publications" from "service_role";

revoke truncate on table "public"."form_a_publications" from "service_role";

revoke update on table "public"."form_a_publications" from "service_role";

revoke delete on table "public"."form_b_grants_and_fellowships" from "anon";

revoke insert on table "public"."form_b_grants_and_fellowships" from "anon";

revoke references on table "public"."form_b_grants_and_fellowships" from "anon";

revoke select on table "public"."form_b_grants_and_fellowships" from "anon";

revoke trigger on table "public"."form_b_grants_and_fellowships" from "anon";

revoke truncate on table "public"."form_b_grants_and_fellowships" from "anon";

revoke update on table "public"."form_b_grants_and_fellowships" from "anon";

revoke delete on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke insert on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke references on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke select on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke trigger on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke truncate on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke update on table "public"."form_b_grants_and_fellowships" from "authenticated";

revoke delete on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke insert on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke references on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke select on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke trigger on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke truncate on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke update on table "public"."form_b_grants_and_fellowships" from "service_role";

revoke delete on table "public"."form_c_presentations" from "anon";

revoke insert on table "public"."form_c_presentations" from "anon";

revoke references on table "public"."form_c_presentations" from "anon";

revoke select on table "public"."form_c_presentations" from "anon";

revoke trigger on table "public"."form_c_presentations" from "anon";

revoke truncate on table "public"."form_c_presentations" from "anon";

revoke update on table "public"."form_c_presentations" from "anon";

revoke delete on table "public"."form_c_presentations" from "authenticated";

revoke insert on table "public"."form_c_presentations" from "authenticated";

revoke references on table "public"."form_c_presentations" from "authenticated";

revoke select on table "public"."form_c_presentations" from "authenticated";

revoke trigger on table "public"."form_c_presentations" from "authenticated";

revoke truncate on table "public"."form_c_presentations" from "authenticated";

revoke update on table "public"."form_c_presentations" from "authenticated";

revoke delete on table "public"."form_c_presentations" from "service_role";

revoke insert on table "public"."form_c_presentations" from "service_role";

revoke references on table "public"."form_c_presentations" from "service_role";

revoke select on table "public"."form_c_presentations" from "service_role";

revoke trigger on table "public"."form_c_presentations" from "service_role";

revoke truncate on table "public"."form_c_presentations" from "service_role";

revoke update on table "public"."form_c_presentations" from "service_role";

revoke delete on table "public"."form_d_patents" from "anon";

revoke insert on table "public"."form_d_patents" from "anon";

revoke references on table "public"."form_d_patents" from "anon";

revoke select on table "public"."form_d_patents" from "anon";

revoke trigger on table "public"."form_d_patents" from "anon";

revoke truncate on table "public"."form_d_patents" from "anon";

revoke update on table "public"."form_d_patents" from "anon";

revoke delete on table "public"."form_d_patents" from "authenticated";

revoke insert on table "public"."form_d_patents" from "authenticated";

revoke references on table "public"."form_d_patents" from "authenticated";

revoke select on table "public"."form_d_patents" from "authenticated";

revoke trigger on table "public"."form_d_patents" from "authenticated";

revoke truncate on table "public"."form_d_patents" from "authenticated";

revoke update on table "public"."form_d_patents" from "authenticated";

revoke delete on table "public"."form_d_patents" from "service_role";

revoke insert on table "public"."form_d_patents" from "service_role";

revoke references on table "public"."form_d_patents" from "service_role";

revoke select on table "public"."form_d_patents" from "service_role";

revoke trigger on table "public"."form_d_patents" from "service_role";

revoke truncate on table "public"."form_d_patents" from "service_role";

revoke update on table "public"."form_d_patents" from "service_role";

revoke delete on table "public"."form_e_creative_work_outputs" from "anon";

revoke insert on table "public"."form_e_creative_work_outputs" from "anon";

revoke references on table "public"."form_e_creative_work_outputs" from "anon";

revoke select on table "public"."form_e_creative_work_outputs" from "anon";

revoke trigger on table "public"."form_e_creative_work_outputs" from "anon";

revoke truncate on table "public"."form_e_creative_work_outputs" from "anon";

revoke update on table "public"."form_e_creative_work_outputs" from "anon";

revoke delete on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke insert on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke references on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke select on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke trigger on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke truncate on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke update on table "public"."form_e_creative_work_outputs" from "authenticated";

revoke delete on table "public"."form_e_creative_work_outputs" from "service_role";

revoke insert on table "public"."form_e_creative_work_outputs" from "service_role";

revoke references on table "public"."form_e_creative_work_outputs" from "service_role";

revoke select on table "public"."form_e_creative_work_outputs" from "service_role";

revoke trigger on table "public"."form_e_creative_work_outputs" from "service_role";

revoke truncate on table "public"."form_e_creative_work_outputs" from "service_role";

revoke update on table "public"."form_e_creative_work_outputs" from "service_role";

revoke delete on table "public"."form_f_awards_and_grants" from "anon";

revoke insert on table "public"."form_f_awards_and_grants" from "anon";

revoke references on table "public"."form_f_awards_and_grants" from "anon";

revoke select on table "public"."form_f_awards_and_grants" from "anon";

revoke trigger on table "public"."form_f_awards_and_grants" from "anon";

revoke truncate on table "public"."form_f_awards_and_grants" from "anon";

revoke update on table "public"."form_f_awards_and_grants" from "anon";

revoke delete on table "public"."form_f_awards_and_grants" from "authenticated";

revoke insert on table "public"."form_f_awards_and_grants" from "authenticated";

revoke references on table "public"."form_f_awards_and_grants" from "authenticated";

revoke select on table "public"."form_f_awards_and_grants" from "authenticated";

revoke trigger on table "public"."form_f_awards_and_grants" from "authenticated";

revoke truncate on table "public"."form_f_awards_and_grants" from "authenticated";

revoke update on table "public"."form_f_awards_and_grants" from "authenticated";

revoke delete on table "public"."form_f_awards_and_grants" from "service_role";

revoke insert on table "public"."form_f_awards_and_grants" from "service_role";

revoke references on table "public"."form_f_awards_and_grants" from "service_role";

revoke select on table "public"."form_f_awards_and_grants" from "service_role";

revoke trigger on table "public"."form_f_awards_and_grants" from "service_role";

revoke truncate on table "public"."form_f_awards_and_grants" from "service_role";

revoke update on table "public"."form_f_awards_and_grants" from "service_role";

revoke delete on table "public"."form_g_trainings" from "anon";

revoke insert on table "public"."form_g_trainings" from "anon";

revoke references on table "public"."form_g_trainings" from "anon";

revoke select on table "public"."form_g_trainings" from "anon";

revoke trigger on table "public"."form_g_trainings" from "anon";

revoke truncate on table "public"."form_g_trainings" from "anon";

revoke update on table "public"."form_g_trainings" from "anon";

revoke delete on table "public"."form_g_trainings" from "authenticated";

revoke insert on table "public"."form_g_trainings" from "authenticated";

revoke references on table "public"."form_g_trainings" from "authenticated";

revoke select on table "public"."form_g_trainings" from "authenticated";

revoke trigger on table "public"."form_g_trainings" from "authenticated";

revoke truncate on table "public"."form_g_trainings" from "authenticated";

revoke update on table "public"."form_g_trainings" from "authenticated";

revoke delete on table "public"."form_g_trainings" from "service_role";

revoke insert on table "public"."form_g_trainings" from "service_role";

revoke references on table "public"."form_g_trainings" from "service_role";

revoke select on table "public"."form_g_trainings" from "service_role";

revoke trigger on table "public"."form_g_trainings" from "service_role";

revoke truncate on table "public"."form_g_trainings" from "service_role";

revoke update on table "public"."form_g_trainings" from "service_role";

revoke delete on table "public"."form_h_extension_programs" from "anon";

revoke insert on table "public"."form_h_extension_programs" from "anon";

revoke references on table "public"."form_h_extension_programs" from "anon";

revoke select on table "public"."form_h_extension_programs" from "anon";

revoke trigger on table "public"."form_h_extension_programs" from "anon";

revoke truncate on table "public"."form_h_extension_programs" from "anon";

revoke update on table "public"."form_h_extension_programs" from "anon";

revoke delete on table "public"."form_h_extension_programs" from "authenticated";

revoke insert on table "public"."form_h_extension_programs" from "authenticated";

revoke references on table "public"."form_h_extension_programs" from "authenticated";

revoke select on table "public"."form_h_extension_programs" from "authenticated";

revoke trigger on table "public"."form_h_extension_programs" from "authenticated";

revoke truncate on table "public"."form_h_extension_programs" from "authenticated";

revoke update on table "public"."form_h_extension_programs" from "authenticated";

revoke delete on table "public"."form_h_extension_programs" from "service_role";

revoke insert on table "public"."form_h_extension_programs" from "service_role";

revoke references on table "public"."form_h_extension_programs" from "service_role";

revoke select on table "public"."form_h_extension_programs" from "service_role";

revoke trigger on table "public"."form_h_extension_programs" from "service_role";

revoke truncate on table "public"."form_h_extension_programs" from "service_role";

revoke update on table "public"."form_h_extension_programs" from "service_role";

revoke delete on table "public"."form_i_partnerships" from "anon";

revoke insert on table "public"."form_i_partnerships" from "anon";

revoke references on table "public"."form_i_partnerships" from "anon";

revoke select on table "public"."form_i_partnerships" from "anon";

revoke trigger on table "public"."form_i_partnerships" from "anon";

revoke truncate on table "public"."form_i_partnerships" from "anon";

revoke update on table "public"."form_i_partnerships" from "anon";

revoke delete on table "public"."form_i_partnerships" from "authenticated";

revoke insert on table "public"."form_i_partnerships" from "authenticated";

revoke references on table "public"."form_i_partnerships" from "authenticated";

revoke select on table "public"."form_i_partnerships" from "authenticated";

revoke trigger on table "public"."form_i_partnerships" from "authenticated";

revoke truncate on table "public"."form_i_partnerships" from "authenticated";

revoke update on table "public"."form_i_partnerships" from "authenticated";

revoke delete on table "public"."form_i_partnerships" from "service_role";

revoke insert on table "public"."form_i_partnerships" from "service_role";

revoke references on table "public"."form_i_partnerships" from "service_role";

revoke select on table "public"."form_i_partnerships" from "service_role";

revoke trigger on table "public"."form_i_partnerships" from "service_role";

revoke truncate on table "public"."form_i_partnerships" from "service_role";

revoke update on table "public"."form_i_partnerships" from "service_role";

revoke delete on table "public"."form_j_authorships" from "anon";

revoke insert on table "public"."form_j_authorships" from "anon";

revoke references on table "public"."form_j_authorships" from "anon";

revoke select on table "public"."form_j_authorships" from "anon";

revoke trigger on table "public"."form_j_authorships" from "anon";

revoke truncate on table "public"."form_j_authorships" from "anon";

revoke update on table "public"."form_j_authorships" from "anon";

revoke delete on table "public"."form_j_authorships" from "authenticated";

revoke insert on table "public"."form_j_authorships" from "authenticated";

revoke references on table "public"."form_j_authorships" from "authenticated";

revoke select on table "public"."form_j_authorships" from "authenticated";

revoke trigger on table "public"."form_j_authorships" from "authenticated";

revoke truncate on table "public"."form_j_authorships" from "authenticated";

revoke update on table "public"."form_j_authorships" from "authenticated";

revoke delete on table "public"."form_j_authorships" from "service_role";

revoke insert on table "public"."form_j_authorships" from "service_role";

revoke references on table "public"."form_j_authorships" from "service_role";

revoke select on table "public"."form_j_authorships" from "service_role";

revoke trigger on table "public"."form_j_authorships" from "service_role";

revoke truncate on table "public"."form_j_authorships" from "service_role";

revoke update on table "public"."form_j_authorships" from "service_role";

revoke delete on table "public"."form_k_other_accomplishments" from "anon";

revoke insert on table "public"."form_k_other_accomplishments" from "anon";

revoke references on table "public"."form_k_other_accomplishments" from "anon";

revoke select on table "public"."form_k_other_accomplishments" from "anon";

revoke trigger on table "public"."form_k_other_accomplishments" from "anon";

revoke truncate on table "public"."form_k_other_accomplishments" from "anon";

revoke update on table "public"."form_k_other_accomplishments" from "anon";

revoke delete on table "public"."form_k_other_accomplishments" from "authenticated";

revoke insert on table "public"."form_k_other_accomplishments" from "authenticated";

revoke references on table "public"."form_k_other_accomplishments" from "authenticated";

revoke select on table "public"."form_k_other_accomplishments" from "authenticated";

revoke trigger on table "public"."form_k_other_accomplishments" from "authenticated";

revoke truncate on table "public"."form_k_other_accomplishments" from "authenticated";

revoke update on table "public"."form_k_other_accomplishments" from "authenticated";

revoke delete on table "public"."form_k_other_accomplishments" from "service_role";

revoke insert on table "public"."form_k_other_accomplishments" from "service_role";

revoke references on table "public"."form_k_other_accomplishments" from "service_role";

revoke select on table "public"."form_k_other_accomplishments" from "service_role";

revoke trigger on table "public"."form_k_other_accomplishments" from "service_role";

revoke truncate on table "public"."form_k_other_accomplishments" from "service_role";

revoke update on table "public"."form_k_other_accomplishments" from "service_role";

alter table "public"."form_a_publications" drop constraint "form_a_publications_submitted_by_fkey";

alter table "public"."form_b_grants_and_fellowships" drop constraint "form_b_grants_and_fellowships_submitted_by_fkey";

alter table "public"."form_c_presentations" drop constraint "form_c_presentations_submitted_by_fkey";

alter table "public"."form_d_patents" drop constraint "form_d_patents_submitted_by_fkey";

alter table "public"."form_e_creative_work_outputs" drop constraint "form_e_creative_work_outputs_submitted_by_fkey";

alter table "public"."form_f_awards_and_grants" drop constraint "form_f_awards_and_grants_submitted_by_fkey";

alter table "public"."form_g_trainings" drop constraint "form_g_trainings_submitted_by_fkey";

alter table "public"."form_h_extension_programs" drop constraint "form_h_extension_programs_submitted_by_fkey";

alter table "public"."form_i_partnerships" drop constraint "form_i_partnerships_submitted_by_fkey";

alter table "public"."form_j_authorships" drop constraint "form_j_authorships_submitted_by_fkey";

alter table "public"."form_k_other_accomplishments" drop constraint "form_k_other_accomplishments_submitted_by_fkey";

alter table "public"."form_a_publications" drop constraint "form_a_publications_pkey";

alter table "public"."form_b_grants_and_fellowships" drop constraint "form_b_grants_and_fellowships_pkey";

alter table "public"."form_c_presentations" drop constraint "form_c_presentations_pkey";

alter table "public"."form_d_patents" drop constraint "form_d_patents_pkey";

alter table "public"."form_e_creative_work_outputs" drop constraint "form_e_creative_work_outputs_pkey";

alter table "public"."form_f_awards_and_grants" drop constraint "form_f_awards_and_grants_pkey";

alter table "public"."form_g_trainings" drop constraint "form_g_trainings_pkey";

alter table "public"."form_h_extension_programs" drop constraint "form_h_extension_programs_pkey";

alter table "public"."form_i_partnerships" drop constraint "form_i_partnerships_pkey";

alter table "public"."form_j_authorships" drop constraint "form_j_authorships_pkey";

alter table "public"."form_k_other_accomplishments" drop constraint "form_k_other_accomplishments_pkey";

drop index if exists "public"."form_a_publications_pkey";

drop index if exists "public"."form_b_grants_and_fellowships_pkey";

drop index if exists "public"."form_c_presentations_pkey";

drop index if exists "public"."form_d_patents_pkey";

drop index if exists "public"."form_e_creative_work_outputs_pkey";

drop index if exists "public"."form_f_awards_and_grants_pkey";

drop index if exists "public"."form_g_trainings_pkey";

drop index if exists "public"."form_h_extension_programs_pkey";

drop index if exists "public"."form_i_partnerships_pkey";

drop index if exists "public"."form_j_authorships_pkey";

drop index if exists "public"."form_k_other_accomplishments_pkey";

drop index if exists "public"."one_chair_per_dept";

drop table "public"."form_a_publications";

drop table "public"."form_b_grants_and_fellowships";

drop table "public"."form_c_presentations";

drop table "public"."form_d_patents";

drop table "public"."form_e_creative_work_outputs";

drop table "public"."form_f_awards_and_grants";

drop table "public"."form_g_trainings";

drop table "public"."form_h_extension_programs";

drop table "public"."form_i_partnerships";

drop table "public"."form_j_authorships";

drop table "public"."form_k_other_accomplishments";

CREATE INDEX accomplishment_reports_department_id_idx ON public.accomplishment_reports USING btree (department_id);

CREATE INDEX accomplishment_reports_faculty_id_idx ON public.accomplishment_reports USING btree (faculty_id);

CREATE INDEX accomplishment_reports_status_submitted_idx ON public.accomplishment_reports USING btree (status, date_submitted DESC, created_at DESC);

CREATE INDEX reviews_report_id_created_idx ON public.reviews USING btree (report_id, created_at DESC, reviews_id DESC);

CREATE INDEX reviews_reviewed_by_idx ON public.reviews USING btree (reviewed_by);

CREATE INDEX users_department_id_idx ON public.users USING btree (department_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_submitted_reports()
 RETURNS TABLE(report_id bigint, created_at timestamp with time zone, start_date date, end_date date, date_submitted date, status text, remarks text, faculty_id uuid, department_id bigint, faculty_first_name text, faculty_last_name text, faculty_email text, department_name text, college_name text, entry_count bigint, latest_review_id bigint, latest_review_status text, latest_review_remarks text, latest_review_date date, latest_reviewed_by uuid)
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select
    ar.report_id,
    ar.created_at,
    ar.start_date,
    ar.end_date,
    ar.date_submitted,
    ar.status,
    ar.remarks,
    ar.faculty_id,
    coalesce(ar.department_id, u.department_id) as department_id,
    u.first_name as faculty_first_name,
    u.last_name as faculty_last_name,
    u.email as faculty_email,
    d.department_name,
    d.college_name,
    coalesce(entry_counts.entry_count, 0) as entry_count,
    latest_review.reviews_id as latest_review_id,
    latest_review.status as latest_review_status,
    latest_review.remarks as latest_review_remarks,
    latest_review.review_date as latest_review_date,
    latest_review.reviewed_by as latest_reviewed_by
  from public.accomplishment_reports ar
  left join public.users u on u.id = ar.faculty_id
  left join public.departments d on d.department_id = coalesce(ar.department_id, u.department_id)
  left join lateral (
    select count(*)::bigint as entry_count
    from public.accomplishment_entries ae
    where ae.report_id = ar.report_id
  ) entry_counts on true
  left join lateral (
    select r.reviews_id, r.status, r.remarks, r.review_date, r.reviewed_by
    from public.reviews r
    where r.report_id = ar.report_id
    order by r.created_at desc, r.reviews_id desc
    limit 1
  ) latest_review on true
  where public.current_user_role() in ('department_chair', 'admin')
    and ar.status in ('pending', 'reviewed')
    and public.can_read_report(ar.report_id)
  order by ar.date_submitted desc nulls last, ar.created_at desc;
$function$
;

CREATE OR REPLACE FUNCTION public.update_review_decision(p_review_id bigint, p_status text, p_remarks text DEFAULT NULL::text)
 RETURNS public.reviews
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  updated_review public.reviews%rowtype;
begin
  if auth.uid() is null or not public.has_verified_profile() then
    raise exception 'An authenticated verified session is required'
      using errcode = '28000';
  end if;

  if p_status not in ('approved', 'partially_approved') then
    raise exception 'Review status must be approved or partially_approved'
      using errcode = '23514';
  end if;

  if not public.can_edit_review(p_review_id) then
    raise exception 'Not allowed to update this review'
      using errcode = '42501';
  end if;

  update public.reviews
  set status = p_status,
      remarks = nullif(p_remarks, ''),
      review_date = current_date,
      reviewed_by = auth.uid()
  where reviews_id = p_review_id
  returning * into updated_review;

  if updated_review.reviews_id is null then
    raise exception 'Review not found'
      using errcode = 'P0002';
  end if;

  return updated_review;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_submitted_report(p_report_id bigint, p_start_date date DEFAULT NULL::date, p_end_date date DEFAULT NULL::date, p_remarks text DEFAULT NULL::text)
 RETURNS public.accomplishment_reports
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  updated_report public.accomplishment_reports%rowtype;
begin
  if auth.uid() is null or not public.has_verified_profile() then
    raise exception 'An authenticated verified session is required'
      using errcode = '28000';
  end if;

  if not public.can_manage_department(public.report_department_id(p_report_id)) then
    raise exception 'Not allowed to update this report'
      using errcode = '42501';
  end if;

  update public.accomplishment_reports
  set start_date = p_start_date,
      end_date = p_end_date,
      remarks = nullif(p_remarks, '')
  where report_id = p_report_id
    and status in ('pending', 'reviewed')
  returning * into updated_report;

  if updated_report.report_id is null then
    raise exception 'Submitted report not found'
      using errcode = 'P0002';
  end if;

  return updated_report;
end;
$function$
;


  create policy "Faculty can delete own draft reports"
  on "public"."accomplishment_reports"
  as permissive
  for delete
  to authenticated
using ((( SELECT public.has_verified_profile() AS has_verified_profile) AND (faculty_id = ( SELECT auth.uid() AS uid)) AND (status = 'draft'::text)));



  create policy "Review RPC can insert reviews"
  on "public"."reviews"
  as permissive
  for insert
  to authenticated
with check ((( SELECT public.has_verified_profile() AS has_verified_profile) AND (reviewed_by = ( SELECT auth.uid() AS uid)) AND ( SELECT public.can_manage_department(public.report_department_id(reviews.report_id)) AS can_manage_department)));



  create policy "Department chairs can read department users"
  on "public"."users"
  as permissive
  for select
  to authenticated
using (((public.current_user_role() = 'department_chair'::text) AND (department_id IS NOT NULL) AND (department_id = public.current_user_department_id())));



