


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."conference_location" AS ENUM (
    'institutionalInhouse',
    'localRegional',
    'national',
    'international'
);


ALTER TYPE "public"."conference_location" OWNER TO "postgres";


CREATE TYPE "public"."contributing_unit" AS ENUM (
    'csmod',
    'dbses',
    'dfsc',
    'dmpcs'
);


ALTER TYPE "public"."contributing_unit" OWNER TO "postgres";


CREATE TYPE "public"."event_scope" AS ENUM (
    'institutional_in_house',
    'local_regional',
    'national',
    'international'
);


ALTER TYPE "public"."event_scope" OWNER TO "postgres";


CREATE TYPE "public"."event_type" AS ENUM (
    'conference',
    'forum',
    'seminar',
    'workshop'
);


ALTER TYPE "public"."event_type" OWNER TO "postgres";


CREATE TYPE "public"."majority_source_of_funds" AS ENUM (
    'genFundCurYr',
    'genFundSup',
    'revolFund',
    'intGenFund',
    'rpGovtTrustFund',
    'rpGovtDirFund',
    'rpPrivTrustFund',
    'forTrustFund',
    'forDirFund'
);


ALTER TYPE "public"."majority_source_of_funds" OWNER TO "postgres";


CREATE TYPE "public"."output_type" AS ENUM (
    'performing_arts',
    'visual_arts',
    'literary_work',
    'textbook',
    'computer_software',
    'product_process_method_technology_innovation',
    'other'
);


ALTER TYPE "public"."output_type" OWNER TO "postgres";


CREATE TYPE "public"."patent_type" AS ENUM (
    'invention',
    'utilityModel',
    'industrialDesign'
);


ALTER TYPE "public"."patent_type" OWNER TO "postgres";


CREATE TYPE "public"."presentation_type" AS ENUM (
    'oral',
    'poster'
);


ALTER TYPE "public"."presentation_type" OWNER TO "postgres";


CREATE TYPE "public"."public_event_type" AS ENUM (
    'exhibition',
    'performance',
    'publication'
);


ALTER TYPE "public"."public_event_type" OWNER TO "postgres";


CREATE TYPE "public"."publication_type" AS ENUM (
    'book',
    'bookChapter',
    'journalArticle',
    'peerReviewed',
    'conferencePaper',
    'other'
);


ALTER TYPE "public"."publication_type" OWNER TO "postgres";


CREATE TYPE "public"."publisher_location" AS ENUM (
    'Local',
    'International'
);


ALTER TYPE "public"."publisher_location" OWNER TO "postgres";


CREATE TYPE "public"."publisher_type" AS ENUM (
    'Commercial',
    'Learned Society / Association',
    'University Press'
);


ALTER TYPE "public"."publisher_type" OWNER TO "postgres";


CREATE TYPE "public"."research_type" AS ENUM (
    'basic',
    'applied',
    'policy'
);


ALTER TYPE "public"."research_type" OWNER TO "postgres";


CREATE TYPE "public"."research_utilization_output" AS ENUM (
    'nAUtil',
    'techDev',
    'servProv',
    'endProduct'
);


ALTER TYPE "public"."research_utilization_output" OWNER TO "postgres";


CREATE TYPE "public"."utilization_research_output" AS ENUM (
    'not_applicable',
    'development_of_technology',
    'service_provision',
    'end_product'
);


ALTER TYPE "public"."utilization_research_output" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_edit_report"("p_report_id" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.accomplishment_reports ar
      where ar.report_id = p_report_id
        and (
          public.is_admin()
          or ar.faculty_id = auth.uid()
          or (
            public.current_user_role() = 'department_chair'
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;


ALTER FUNCTION "public"."can_edit_report"("p_report_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_edit_review"("p_review_id" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.reviews r
      join public.accomplishment_reports ar on ar.report_id = r.report_id
      where r.reviews_id = p_review_id
        and (
          public.is_admin()
          or (
            public.current_user_role() = 'department_chair'
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;


ALTER FUNCTION "public"."can_edit_review"("p_review_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_manage_department"("p_department_id" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.is_admin()
    or (
      public.current_user_role() = 'department_chair'
      and p_department_id is not null
      and p_department_id = public.current_user_department_id()
    );
$$;


ALTER FUNCTION "public"."can_manage_department"("p_department_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_read_report"("p_report_id" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.accomplishment_reports ar
      where ar.report_id = p_report_id
        and (
          public.is_admin()
          or ar.faculty_id = auth.uid()
          or (
            public.current_user_role() = 'department_chair'
            and ar.status in ('pending', 'reviewed')
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;


ALTER FUNCTION "public"."can_read_report"("p_report_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."can_read_review"("p_review_id" bigint) RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.has_verified_profile()
    and exists (
      select 1
      from public.reviews r
      join public.accomplishment_reports ar on ar.report_id = r.report_id
      where r.reviews_id = p_review_id
        and (
          public.is_admin()
          or ar.faculty_id = auth.uid()
          or (
            public.current_user_role() = 'department_chair'
            and public.report_department_id(ar.report_id) = public.current_user_department_id()
          )
        )
    );
$$;


ALTER FUNCTION "public"."can_read_review"("p_review_id" bigint) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_department_id"() RETURNS bigint
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select u.department_id
  from public.users u
  where u.id = auth.uid();
$$;


ALTER FUNCTION "public"."current_user_department_id"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."current_user_role"() RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select u.role
  from public.users u
  where u.id = auth.uid();
$$;


ALTER FUNCTION "public"."current_user_role"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "username" "text",
    "first_name" "text",
    "last_name" "text",
    "email" "text" NOT NULL,
    "employment_type" "text",
    "department_id" bigint,
    "id" "uuid" NOT NULL,
    "role" "text" DEFAULT '''''''admin''''::text'::"text" NOT NULL,
    CONSTRAINT "users_role_check" CHECK (("role" = ANY (ARRAY['faculty'::"text", 'department_chair'::"text", 'admin'::"text"])))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ensure_user_profile"() RETURNS "public"."users"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
declare
  auth_user auth.users%rowtype;
  app_user public.users%rowtype;
  selected_department_id bigint;
begin
  if auth.uid() is null then
    raise exception 'An authenticated session is required'
      using errcode = '28000';
  end if;

  select *
  into auth_user
  from auth.users
  where id = auth.uid();

  if auth_user.id is null or auth_user.email_confirmed_at is null then
    raise exception 'Email verification is required before creating an application user'
      using errcode = '28000';
  end if;

  if nullif(auth_user.raw_user_meta_data ->> 'department', '') is not null then
    select d.department_id
    into selected_department_id
    from public.departments d
    where d.department_name = auth_user.raw_user_meta_data ->> 'department';

    if selected_department_id is null then
      raise exception 'Invalid department selected'
        using errcode = '23514';
    end if;
  end if;

  insert into public.users (
    id,
    email,
    first_name,
    last_name,
    department_id,
    role
  )
  values (
    auth_user.id,
    auth_user.email,
    nullif(auth_user.raw_user_meta_data ->> 'first_name', ''),
    nullif(auth_user.raw_user_meta_data ->> 'last_name', ''),
    selected_department_id,
    'faculty'
  )
  on conflict (id) do update
    set email = excluded.email,
        first_name = coalesce(public.users.first_name, excluded.first_name),
        last_name = coalesce(public.users.last_name, excluded.last_name),
        department_id = coalesce(public.users.department_id, excluded.department_id);

  select *
  into app_user
  from public.users
  where id = auth_user.id;

  return app_user;
end;
$$;


ALTER FUNCTION "public"."ensure_user_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."has_verified_profile"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
  select auth.uid() is not null
    and exists (
      select 1
      from public.users u
      join auth.users au on au.id = u.id
      where u.id = auth.uid()
        and au.email_confirmed_at is not null
    );
$$;


ALTER FUNCTION "public"."has_verified_profile"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.current_user_role() = 'admin';
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_department_chair"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.current_user_role() in ('department_chair', 'admin');
$$;


ALTER FUNCTION "public"."is_department_chair"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_faculty"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select public.current_user_role() in ('faculty', 'department_chair', 'admin');
$$;


ALTER FUNCTION "public"."is_faculty"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."report_department_id"("p_report_id" bigint) RETURNS bigint
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  select coalesce(ar.department_id, u.department_id)
  from public.accomplishment_reports ar
  left join public.users u on u.id = ar.faculty_id
  where ar.report_id = p_report_id;
$$;


ALTER FUNCTION "public"."report_department_id"("p_report_id" bigint) OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "reviews_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "review_date" "date" DEFAULT CURRENT_DATE,
    "status" "text",
    "remarks" "text",
    "report_id" bigint,
    "reviewed_by" "uuid",
    CONSTRAINT "reviews_status_check" CHECK (("status" = ANY (ARRAY['approved'::"text", 'partially_approved'::"text"])))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."review_accomplishment_report"("p_report_id" bigint, "p_status" "text", "p_remarks" "text" DEFAULT NULL::"text") RETURNS "public"."reviews"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  target_report public.accomplishment_reports%rowtype;
  created_review public.reviews%rowtype;
begin
  if auth.uid() is null or not public.has_verified_profile() then
    raise exception 'An authenticated verified session is required'
      using errcode = '28000';
  end if;

  if p_status not in ('approved', 'partially_approved') then
    raise exception 'Review status must be approved or partially_approved'
      using errcode = '23514';
  end if;

  select *
  into target_report
  from public.accomplishment_reports
  where report_id = p_report_id
  for update;

  if target_report.report_id is null then
    raise exception 'Report not found'
      using errcode = 'P0002';
  end if;

  if target_report.status not in ('pending', 'reviewed') then
    raise exception 'Only pending or reviewed reports can be reviewed'
      using errcode = '23514';
  end if;

  if not (
    public.is_admin()
    or (
      public.current_user_role() = 'department_chair'
      and public.report_department_id(target_report.report_id) = public.current_user_department_id()
    )
  ) then
    raise exception 'Not allowed to review this report'
      using errcode = '42501';
  end if;

  update public.accomplishment_reports
  set status = 'reviewed'
  where report_id = target_report.report_id;

  insert into public.reviews (
    review_date,
    status,
    remarks,
    report_id,
    reviewed_by
  )
  values (
    current_date,
    p_status,
    nullif(p_remarks, ''),
    target_report.report_id,
    auth.uid()
  )
  returning * into created_review;

  return created_review;
end;
$$;


ALTER FUNCTION "public"."review_accomplishment_report"("p_report_id" bigint, "p_status" "text", "p_remarks" "text") OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."accomplishment_reports" (
    "report_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "start_date" "date",
    "end_date" "date",
    "date_submitted" "date",
    "status" "text",
    "remarks" "text",
    "faculty_id" "uuid",
    "department_id" bigint,
    CONSTRAINT "accomplishment_reports_status_check" CHECK (("status" = ANY (ARRAY['draft'::"text", 'pending'::"text", 'reviewed'::"text", 'archived'::"text"])))
);


ALTER TABLE "public"."accomplishment_reports" OWNER TO "postgres";


ALTER TABLE "public"."accomplishment_reports" ALTER COLUMN "report_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."accomplishment_entries_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."forms" (
    "entry_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "title" "text",
    "description" "text",
    "author" "text",
    "report_id" bigint,
    "form_type_id" bigint
);


ALTER TABLE "public"."forms" OWNER TO "postgres";


ALTER TABLE "public"."forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."accomplishment_entries_entry_id_seq1"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."departments" (
    "department_id" bigint NOT NULL,
    "department_name" "text",
    "college_name" "text"
);


ALTER TABLE "public"."departments" OWNER TO "postgres";


ALTER TABLE "public"."departments" ALTER COLUMN "department_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."departments_department_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."export_records" (
    "export_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "filter_used" "text",
    "format" "text",
    "generated_by" "uuid" DEFAULT "gen_random_uuid"()
);


ALTER TABLE "public"."export_records" OWNER TO "postgres";


ALTER TABLE "public"."export_records" ALTER COLUMN "export_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."export_records_export_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."form_types" (
    "form_type_id" bigint NOT NULL,
    "form_name" "text"
);


ALTER TABLE "public"."form_types" OWNER TO "postgres";


ALTER TABLE "public"."form_types" ALTER COLUMN "form_type_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."form_types_form_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_authorship_forms" (
    "entry_id" bigint NOT NULL,
    "material_title" "text",
    "author" "text",
    "year" "date",
    "attachments" "text",
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_authorship_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_authorship_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_authorship_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_awards_forms" (
    "entry_id" bigint NOT NULL,
    "type" "text",
    "award" "text",
    "source" "text",
    "details" "text",
    "start_date" "date",
    "end_date" "date",
    "attachments" "text",
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_awards_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_awards_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_awards_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_creative_work_forms" (
    "entry_id" bigint NOT NULL,
    "creative_work_title" "text" NOT NULL,
    "other_type" "text",
    "event_start_date" "date" NOT NULL,
    "event_end_date" "date" NOT NULL,
    "research_proof" "text" NOT NULL,
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_creative_work_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_creative_work_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_creative_work_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_extension_programs_forms" (
    "entry_id" bigint NOT NULL,
    "extension_title" "text",
    "training_courses" "text",
    "external_clients_technical" "text",
    "information_dissemination" "text",
    "external_clients_consultancy" "text",
    "community_outreach" "text",
    "knowledge_transfer" "text",
    "organizing" "text",
    "work_scope" "text",
    "start_date" "date",
    "end_date" "date",
    "target_beneficiary_group" "text",
    "program_description" "text",
    "remarks" "text"
);


ALTER TABLE "public"."isip_extension_programs_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_extension_programs_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_extension_programs_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_oral_forms" (
    "entry_id" bigint NOT NULL,
    "paper_title" "text" NOT NULL,
    "presentation_type" "public"."presentation_type" NOT NULL,
    "event_type" "public"."event_type" NOT NULL,
    "attachments" "text" NOT NULL,
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_oral_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_oral_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_oral_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_other_accomplishments_forms" (
    "entry_id" bigint NOT NULL,
    "activity_title" "text",
    "start_date" "date",
    "end_date" "date",
    "participation" "text",
    "venue" "text",
    "attachments" "text",
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_other_accomplishments_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_other_accomplishments_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_other_accomplishments_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_partnership_forms" (
    "entry_id" bigint NOT NULL,
    "partnership_title" "text",
    "training_courses" "text",
    "advisory_service" "text",
    "information_dissemination" "text",
    "consultancy" "text",
    "community_outreach" "text",
    "knowledge_transfer" "text",
    "organizing_events" "text",
    "remarks" "text"
);


ALTER TABLE "public"."isip_partnership_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_partnership_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_partnership_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_patents_forms" (
    "entry_id" bigint NOT NULL,
    "attachments" "text" NOT NULL,
    "remarks" "text"
);


ALTER TABLE "public"."isip_patents_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_patents_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_patents_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_publication_forms" (
    "entry_id" bigint NOT NULL,
    "publication_type" "public"."publication_type" NOT NULL,
    "publication_title" "text" NOT NULL,
    "publication_author" "text" NOT NULL,
    "publication_date_published" "date" NOT NULL,
    "publication_name" "text" NOT NULL,
    "isi" boolean NOT NULL,
    "scopus" boolean NOT NULL,
    "pubmed" boolean NOT NULL,
    "ched_recognized" boolean NOT NULL,
    "peer_reviewed" boolean NOT NULL,
    "other_reputable_database" "text",
    "publication_proof" "text" NOT NULL,
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_publication_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_publication_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_publications_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_research_forms" (
    "entry_id" bigint NOT NULL,
    "research_title" "text" NOT NULL,
    "research_type" "public"."research_type" NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "researcher_name" "text" NOT NULL,
    "research_grant" numeric NOT NULL,
    "funding_amount" numeric NOT NULL,
    "total_funding" numeric NOT NULL,
    "other_fund_source" "text",
    "attachments" "text" NOT NULL,
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_research_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_research_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_research_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."isip_trainings_forms" (
    "entry_id" bigint NOT NULL,
    "activity_type" "text",
    "training_title" "text",
    "venue" "text",
    "start_date" "date",
    "end_date" "date",
    "attachments" "text",
    "remarks" "text",
    "related_kras" "text"
);


ALTER TABLE "public"."isip_trainings_forms" OWNER TO "postgres";


ALTER TABLE "public"."isip_trainings_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."isip_trainings_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_creative_work_forms" (
    "entry_id" bigint NOT NULL,
    "linked_research" "text" NOT NULL,
    "output_type" "public"."output_type" NOT NULL,
    "public_event_type" "public"."public_event_type" NOT NULL,
    "organizer_name" "text" NOT NULL,
    "event_scope" "public"."event_scope" NOT NULL,
    "event_venue" "text" NOT NULL,
    "date_released" "date" NOT NULL,
    "utilization_research_output" "public"."utilization_research_output" NOT NULL,
    "utilization_proof" "text" NOT NULL,
    "event_title" "text" NOT NULL
);


ALTER TABLE "public"."pbms_creative_work_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_creative_work_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_creative_work_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_extension_programs_forms" (
    "entry_id" bigint NOT NULL,
    "contributing_unit" "text",
    "academic_degree" "text",
    "no_of_beneficiary_groups" "text",
    "majority_share_funding" "text"
);


ALTER TABLE "public"."pbms_extension_programs_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_extension_programs_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_extension_programs_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_oral_forms" (
    "entry_id" bigint NOT NULL,
    "linked_research" "text" NOT NULL,
    "conference_title" "text" NOT NULL,
    "organizer_name" "text" NOT NULL,
    "conference_location" "public"."conference_location" NOT NULL,
    "venue" "text" NOT NULL,
    "conference_start_date" "date" NOT NULL,
    "conference_end_date" "date",
    "presentation_date" "date" NOT NULL
);


ALTER TABLE "public"."pbms_oral_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_oral_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_oral_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_other_accomplishments_forms" (
    "entry_id" bigint NOT NULL,
    "sub_type" "text"
);


ALTER TABLE "public"."pbms_other_accomplishments_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_other_accomplishments_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_other_accomplishments_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_partnerships_forms" (
    "entry_id" bigint NOT NULL,
    "contributing_unit" "text",
    "partner_stakeholder_name" "text",
    "stakeholder_category" "text",
    "partnership_agreement_type" "text",
    "partnership_effectivity_start_date" "date",
    "partnership_effectivity_end_date" "date",
    "partnership_agreement" "text"
);


ALTER TABLE "public"."pbms_partnerships_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_partnerships_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_partnerships_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_patents_forms" (
    "entry_id" bigint NOT NULL,
    "linked_research" "text" NOT NULL,
    "patent_title" "text" NOT NULL,
    "patent_type" "public"."patent_type" NOT NULL,
    "application_no" numeric NOT NULL,
    "inventor_name" "text" NOT NULL,
    "applicant_name" "text" NOT NULL,
    "publication_date" "date" NOT NULL,
    "grant_date" "date",
    "registration_no" numeric,
    "commercial_product_name" "text",
    "research_utilization_output" "public"."research_utilization_output" NOT NULL
);


ALTER TABLE "public"."pbms_patents_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_patents_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_patents_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_publication_forms" (
    "publisher_name" "text" NOT NULL,
    "publisher_type" "public"."publisher_type" NOT NULL,
    "publisher_location" "public"."publisher_location" NOT NULL,
    "editor_name" "text",
    "volume_issue_no" "text",
    "doi" "text" NOT NULL,
    "isbn" "text",
    "number_of_citation" numeric,
    "utilization_proof" "text",
    "entry_id" bigint NOT NULL
);


ALTER TABLE "public"."pbms_publication_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_publication_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_publication_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_research_forms" (
    "entry_id" bigint NOT NULL,
    "contributing_unit" "public"."contributing_unit" NOT NULL,
    "original_timeframe_months" numeric NOT NULL,
    "majority_source_of_funds" "public"."majority_source_of_funds" NOT NULL
);


ALTER TABLE "public"."pbms_research_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_research_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_research_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."pbms_trainings_forms" (
    "entry_id" bigint NOT NULL,
    "contributing_unit" "text",
    "special_notes_schedule" "text",
    "training_hours_required" smallint,
    "total_trainees_number" integer,
    "majority_share_funding" "text",
    "sample_size" integer,
    "no_of_responses_poor" smallint,
    "no_of_responses_fair" smallint,
    "no_of_responses_satisfactory" smallint,
    "no_of_responses_outsanding" smallint,
    "part_extension_program" "text",
    "related_extension_program_title" "text"
);


ALTER TABLE "public"."pbms_trainings_forms" OWNER TO "postgres";


ALTER TABLE "public"."pbms_trainings_forms" ALTER COLUMN "entry_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."pbms_trainings_forms_entry_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."reviews" ALTER COLUMN "reviews_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reviews_reviews_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."supporting_documents" (
    "document_id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "file_name" "text",
    "entry_id" bigint
);


ALTER TABLE "public"."supporting_documents" OWNER TO "postgres";


ALTER TABLE "public"."supporting_documents" ALTER COLUMN "document_id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."supporting_documents_document_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "accomplishment_entries_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."accomplishment_reports"
    ADD CONSTRAINT "accomplishment_reports_pkey" PRIMARY KEY ("report_id");



ALTER TABLE ONLY "public"."departments"
    ADD CONSTRAINT "department_pkey" PRIMARY KEY ("department_id");



ALTER TABLE ONLY "public"."export_records"
    ADD CONSTRAINT "export_records_pkey" PRIMARY KEY ("export_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "faculties_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."form_types"
    ADD CONSTRAINT "form_types_pkey" PRIMARY KEY ("form_type_id");



ALTER TABLE ONLY "public"."isip_authorship_forms"
    ADD CONSTRAINT "isip_authorship_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_awards_forms"
    ADD CONSTRAINT "isip_awards_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_creative_work_forms"
    ADD CONSTRAINT "isip_creative_work_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_extension_programs_forms"
    ADD CONSTRAINT "isip_extension_programs_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_oral_forms"
    ADD CONSTRAINT "isip_oral_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_other_accomplishments_forms"
    ADD CONSTRAINT "isip_other_accomplishments_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_partnership_forms"
    ADD CONSTRAINT "isip_partnership_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_patents_forms"
    ADD CONSTRAINT "isip_patents_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_publication_forms"
    ADD CONSTRAINT "isip_publication_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_research_forms"
    ADD CONSTRAINT "isip_research_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."isip_trainings_forms"
    ADD CONSTRAINT "isip_trainings_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_creative_work_forms"
    ADD CONSTRAINT "pbms_creative_work_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_extension_programs_forms"
    ADD CONSTRAINT "pbms_extension_programs_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_oral_forms"
    ADD CONSTRAINT "pbms_oral_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_other_accomplishments_forms"
    ADD CONSTRAINT "pbms_other_accomplishments_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_partnerships_forms"
    ADD CONSTRAINT "pbms_partnerships_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_patents_forms"
    ADD CONSTRAINT "pbms_patents_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_publication_forms"
    ADD CONSTRAINT "pbms_publication_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_research_forms"
    ADD CONSTRAINT "pbms_research_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."pbms_trainings_forms"
    ADD CONSTRAINT "pbms_trainings_forms_pkey" PRIMARY KEY ("entry_id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("reviews_id");



ALTER TABLE ONLY "public"."supporting_documents"
    ADD CONSTRAINT "supporting_documents_pkey" PRIMARY KEY ("document_id");



CREATE UNIQUE INDEX "departments_department_name_key" ON "public"."departments" USING "btree" ("department_name");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "accomplishment_entries_form_type_id_fkey" FOREIGN KEY ("form_type_id") REFERENCES "public"."form_types"("form_type_id");



ALTER TABLE ONLY "public"."forms"
    ADD CONSTRAINT "accomplishment_entries_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."accomplishment_reports"("report_id");



ALTER TABLE ONLY "public"."accomplishment_reports"
    ADD CONSTRAINT "accomplishment_reports_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id") ON UPDATE CASCADE ON DELETE SET NULL;



ALTER TABLE ONLY "public"."accomplishment_reports"
    ADD CONSTRAINT "accomplishment_reports_faculty_id_fkey" FOREIGN KEY ("faculty_id") REFERENCES "public"."users"("id");



ALTER TABLE ONLY "public"."export_records"
    ADD CONSTRAINT "export_records_generated_by_fkey" FOREIGN KEY ("generated_by") REFERENCES "public"."users"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "faculties_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "public"."departments"("department_id");



ALTER TABLE ONLY "public"."isip_authorship_forms"
    ADD CONSTRAINT "isip_authorship_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_awards_forms"
    ADD CONSTRAINT "isip_awards_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_creative_work_forms"
    ADD CONSTRAINT "isip_creative_work_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_extension_programs_forms"
    ADD CONSTRAINT "isip_extension_programs_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_oral_forms"
    ADD CONSTRAINT "isip_oral_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_other_accomplishments_forms"
    ADD CONSTRAINT "isip_other_accomplishments_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_partnership_forms"
    ADD CONSTRAINT "isip_partnership_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_patents_forms"
    ADD CONSTRAINT "isip_patents_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_publication_forms"
    ADD CONSTRAINT "isip_publication_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_research_forms"
    ADD CONSTRAINT "isip_research_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."isip_trainings_forms"
    ADD CONSTRAINT "isip_trainings_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_creative_work_forms"
    ADD CONSTRAINT "pbms_creative_work_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_extension_programs_forms"
    ADD CONSTRAINT "pbms_extension_programs_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_oral_forms"
    ADD CONSTRAINT "pbms_oral_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_other_accomplishments_forms"
    ADD CONSTRAINT "pbms_other_accomplishments_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_partnerships_forms"
    ADD CONSTRAINT "pbms_partnerships_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_patents_forms"
    ADD CONSTRAINT "pbms_patents_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_publication_forms"
    ADD CONSTRAINT "pbms_publication_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_research_forms"
    ADD CONSTRAINT "pbms_research_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."pbms_trainings_forms"
    ADD CONSTRAINT "pbms_trainings_forms_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_report_id_fkey" FOREIGN KEY ("report_id") REFERENCES "public"."accomplishment_reports"("report_id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_reviewed_by_fkey" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON UPDATE CASCADE;



ALTER TABLE ONLY "public"."supporting_documents"
    ADD CONSTRAINT "supporting_documents_entry_id_fkey" FOREIGN KEY ("entry_id") REFERENCES "public"."forms"("entry_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



CREATE POLICY "Admins can delete users" ON "public"."users" FOR DELETE TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can read all users" ON "public"."users" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "Admins can update users" ON "public"."users" FOR UPDATE TO "authenticated" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());



CREATE POLICY "Faculty and reviewers can delete reports" ON "public"."accomplishment_reports" FOR DELETE TO "authenticated" USING ("public"."can_edit_report"("report_id"));



CREATE POLICY "Faculty and reviewers can read reports" ON "public"."accomplishment_reports" FOR SELECT TO "authenticated" USING ("public"."can_read_report"("report_id"));



CREATE POLICY "Faculty and reviewers can read reviews" ON "public"."reviews" FOR SELECT TO "authenticated" USING ("public"."can_read_review"("reviews_id"));



CREATE POLICY "Faculty and reviewers can update reports" ON "public"."accomplishment_reports" FOR UPDATE TO "authenticated" USING ("public"."can_edit_report"("report_id")) WITH CHECK (("public"."has_verified_profile"() AND ("public"."is_admin"() OR ("faculty_id" = "auth"."uid"()) OR "public"."can_manage_department"("public"."report_department_id"("report_id")))));



CREATE POLICY "Faculty can create own reports" ON "public"."accomplishment_reports" FOR INSERT TO "authenticated" WITH CHECK (("public"."has_verified_profile"() AND ("public"."is_admin"() OR (("faculty_id" = "auth"."uid"()) AND ("department_id" = "public"."current_user_department_id"())))));



CREATE POLICY "Reviewers can update reviews" ON "public"."reviews" FOR UPDATE TO "authenticated" USING ("public"."can_edit_review"("reviews_id")) WITH CHECK ("public"."can_edit_review"("reviews_id"));



CREATE POLICY "Users can read own profile" ON "public"."users" FOR SELECT TO "authenticated" USING ((("id" = "auth"."uid"()) AND "public"."has_verified_profile"()));



CREATE POLICY "Users can update own profile" ON "public"."users" FOR UPDATE TO "authenticated" USING ((("id" = "auth"."uid"()) AND "public"."has_verified_profile"())) WITH CHECK ((("id" = "auth"."uid"()) AND ("role" = "public"."current_user_role"()) AND (NOT ("department_id" IS DISTINCT FROM "public"."current_user_department_id"()))));



CREATE POLICY "Verified users can delete accomplishment_entries" ON "public"."forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete departments" ON "public"."departments" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete export_records" ON "public"."export_records" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete form_types" ON "public"."form_types" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_authorship_forms" ON "public"."isip_authorship_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_awards_forms" ON "public"."isip_awards_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_creative_work_forms" ON "public"."isip_creative_work_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_extension_programs_forms" ON "public"."isip_extension_programs_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_oral_forms" ON "public"."isip_oral_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_other_accomplishments_forms" ON "public"."isip_other_accomplishments_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_partnership_forms" ON "public"."isip_partnership_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_patents_forms" ON "public"."isip_patents_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_publication_forms" ON "public"."isip_publication_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_research_forms" ON "public"."isip_research_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete isip_trainings_forms" ON "public"."isip_trainings_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_creative_work_forms" ON "public"."pbms_creative_work_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_extension_programs_forms" ON "public"."pbms_extension_programs_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_oral_forms" ON "public"."pbms_oral_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_other_accomplishments_forms" ON "public"."pbms_other_accomplishments_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_partnerships_forms" ON "public"."pbms_partnerships_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_patents_forms" ON "public"."pbms_patents_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_publication_forms" ON "public"."pbms_publication_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_research_forms" ON "public"."pbms_research_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete pbms_trainings_forms" ON "public"."pbms_trainings_forms" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can delete supporting_documents" ON "public"."supporting_documents" FOR DELETE TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert accomplishment_entries" ON "public"."forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert departments" ON "public"."departments" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert export_records" ON "public"."export_records" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert form_types" ON "public"."form_types" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_authorship_forms" ON "public"."isip_authorship_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_awards_forms" ON "public"."isip_awards_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_creative_work_forms" ON "public"."isip_creative_work_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_extension_programs_forms" ON "public"."isip_extension_programs_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_oral_forms" ON "public"."isip_oral_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_other_accomplishments_forms" ON "public"."isip_other_accomplishments_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_partnership_forms" ON "public"."isip_partnership_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_patents_forms" ON "public"."isip_patents_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_publication_forms" ON "public"."isip_publication_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_research_forms" ON "public"."isip_research_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert isip_trainings_forms" ON "public"."isip_trainings_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_creative_work_forms" ON "public"."pbms_creative_work_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_extension_programs_forms" ON "public"."pbms_extension_programs_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_oral_forms" ON "public"."pbms_oral_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_other_accomplishments_forms" ON "public"."pbms_other_accomplishments_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_partnerships_forms" ON "public"."pbms_partnerships_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_patents_forms" ON "public"."pbms_patents_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_publication_forms" ON "public"."pbms_publication_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_research_forms" ON "public"."pbms_research_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert pbms_trainings_forms" ON "public"."pbms_trainings_forms" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can insert supporting_documents" ON "public"."supporting_documents" FOR INSERT TO "authenticated" WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read accomplishment_entries" ON "public"."forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read departments" ON "public"."departments" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read export_records" ON "public"."export_records" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read form_types" ON "public"."form_types" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_authorship_forms" ON "public"."isip_authorship_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_awards_forms" ON "public"."isip_awards_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_creative_work_forms" ON "public"."isip_creative_work_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_extension_programs_forms" ON "public"."isip_extension_programs_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_oral_forms" ON "public"."isip_oral_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_other_accomplishments_forms" ON "public"."isip_other_accomplishments_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_partnership_forms" ON "public"."isip_partnership_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_patents_forms" ON "public"."isip_patents_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_publication_forms" ON "public"."isip_publication_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_research_forms" ON "public"."isip_research_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read isip_trainings_forms" ON "public"."isip_trainings_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_creative_work_forms" ON "public"."pbms_creative_work_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_extension_programs_forms" ON "public"."pbms_extension_programs_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_oral_forms" ON "public"."pbms_oral_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_other_accomplishments_forms" ON "public"."pbms_other_accomplishments_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_partnerships_forms" ON "public"."pbms_partnerships_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_patents_forms" ON "public"."pbms_patents_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_publication_forms" ON "public"."pbms_publication_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_research_forms" ON "public"."pbms_research_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read pbms_trainings_forms" ON "public"."pbms_trainings_forms" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can read supporting_documents" ON "public"."supporting_documents" FOR SELECT TO "authenticated" USING ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update accomplishment_entries" ON "public"."forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update departments" ON "public"."departments" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update export_records" ON "public"."export_records" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update form_types" ON "public"."form_types" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_authorship_forms" ON "public"."isip_authorship_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_awards_forms" ON "public"."isip_awards_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_creative_work_forms" ON "public"."isip_creative_work_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_extension_programs_forms" ON "public"."isip_extension_programs_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_oral_forms" ON "public"."isip_oral_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_other_accomplishments_forms" ON "public"."isip_other_accomplishments_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_partnership_forms" ON "public"."isip_partnership_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_patents_forms" ON "public"."isip_patents_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_publication_forms" ON "public"."isip_publication_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_research_forms" ON "public"."isip_research_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update isip_trainings_forms" ON "public"."isip_trainings_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_creative_work_forms" ON "public"."pbms_creative_work_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_extension_programs_forms" ON "public"."pbms_extension_programs_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_oral_forms" ON "public"."pbms_oral_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_other_accomplishments_forms" ON "public"."pbms_other_accomplishments_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_partnerships_forms" ON "public"."pbms_partnerships_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_patents_forms" ON "public"."pbms_patents_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_publication_forms" ON "public"."pbms_publication_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_research_forms" ON "public"."pbms_research_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update pbms_trainings_forms" ON "public"."pbms_trainings_forms" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



CREATE POLICY "Verified users can update supporting_documents" ON "public"."supporting_documents" FOR UPDATE TO "authenticated" USING ("public"."has_verified_profile"()) WITH CHECK ("public"."has_verified_profile"());



ALTER TABLE "public"."accomplishment_reports" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."departments" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."export_records" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."form_types" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_authorship_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_awards_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_creative_work_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_extension_programs_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_oral_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_other_accomplishments_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_partnership_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_patents_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_publication_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_research_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."isip_trainings_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_creative_work_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_extension_programs_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_oral_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_other_accomplishments_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_partnerships_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_patents_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_publication_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_research_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."pbms_trainings_forms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."supporting_documents" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































REVOKE ALL ON FUNCTION "public"."can_edit_report"("p_report_id" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."can_edit_report"("p_report_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_edit_report"("p_report_id" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."can_edit_review"("p_review_id" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."can_edit_review"("p_review_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_edit_review"("p_review_id" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."can_manage_department"("p_department_id" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."can_manage_department"("p_department_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_manage_department"("p_department_id" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."can_read_report"("p_report_id" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."can_read_report"("p_report_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_read_report"("p_report_id" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."can_read_review"("p_review_id" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."can_read_review"("p_review_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."can_read_review"("p_review_id" bigint) TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_department_id"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_department_id"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_department_id"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."current_user_role"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."current_user_role"() TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



GRANT UPDATE("username") ON TABLE "public"."users" TO "authenticated";



GRANT UPDATE("first_name") ON TABLE "public"."users" TO "authenticated";



GRANT UPDATE("last_name") ON TABLE "public"."users" TO "authenticated";



GRANT UPDATE("employment_type") ON TABLE "public"."users" TO "authenticated";



GRANT UPDATE("department_id") ON TABLE "public"."users" TO "authenticated";



GRANT UPDATE("role") ON TABLE "public"."users" TO "authenticated";



REVOKE ALL ON FUNCTION "public"."ensure_user_profile"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ensure_user_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_user_profile"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."has_verified_profile"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."has_verified_profile"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."has_verified_profile"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_admin"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_department_chair"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_department_chair"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_department_chair"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."is_faculty"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."is_faculty"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_faculty"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."report_department_id"("p_report_id" bigint) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."report_department_id"("p_report_id" bigint) TO "authenticated";
GRANT ALL ON FUNCTION "public"."report_department_id"("p_report_id" bigint) TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



REVOKE ALL ON FUNCTION "public"."review_accomplishment_report"("p_report_id" bigint, "p_status" "text", "p_remarks" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."review_accomplishment_report"("p_report_id" bigint, "p_status" "text", "p_remarks" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."review_accomplishment_report"("p_report_id" bigint, "p_status" "text", "p_remarks" "text") TO "service_role";


















GRANT ALL ON TABLE "public"."accomplishment_reports" TO "authenticated";
GRANT ALL ON TABLE "public"."accomplishment_reports" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accomplishment_entries_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."accomplishment_entries_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accomplishment_entries_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."forms" TO "anon";
GRANT ALL ON TABLE "public"."forms" TO "authenticated";
GRANT ALL ON TABLE "public"."forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."accomplishment_entries_entry_id_seq1" TO "anon";
GRANT ALL ON SEQUENCE "public"."accomplishment_entries_entry_id_seq1" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."accomplishment_entries_entry_id_seq1" TO "service_role";



GRANT ALL ON TABLE "public"."departments" TO "authenticated";
GRANT ALL ON TABLE "public"."departments" TO "service_role";



GRANT ALL ON SEQUENCE "public"."departments_department_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."departments_department_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."departments_department_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."export_records" TO "anon";
GRANT ALL ON TABLE "public"."export_records" TO "authenticated";
GRANT ALL ON TABLE "public"."export_records" TO "service_role";



GRANT ALL ON SEQUENCE "public"."export_records_export_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."export_records_export_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."export_records_export_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."form_types" TO "anon";
GRANT ALL ON TABLE "public"."form_types" TO "authenticated";
GRANT ALL ON TABLE "public"."form_types" TO "service_role";



GRANT ALL ON SEQUENCE "public"."form_types_form_type_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."form_types_form_type_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."form_types_form_type_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_authorship_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_authorship_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_authorship_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_authorship_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_authorship_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_authorship_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_awards_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_awards_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_awards_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_awards_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_awards_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_awards_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_creative_work_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_creative_work_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_creative_work_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_creative_work_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_creative_work_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_creative_work_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_extension_programs_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_extension_programs_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_extension_programs_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_extension_programs_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_extension_programs_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_extension_programs_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_oral_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_oral_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_oral_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_oral_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_oral_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_oral_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_other_accomplishments_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_other_accomplishments_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_other_accomplishments_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_other_accomplishments_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_other_accomplishments_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_other_accomplishments_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_partnership_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_partnership_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_partnership_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_partnership_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_partnership_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_partnership_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_patents_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_patents_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_patents_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_patents_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_patents_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_patents_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_publication_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_publication_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_publication_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_publications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_publications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_publications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_research_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_research_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_research_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_research_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_research_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_research_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."isip_trainings_forms" TO "anon";
GRANT ALL ON TABLE "public"."isip_trainings_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."isip_trainings_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."isip_trainings_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."isip_trainings_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."isip_trainings_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_creative_work_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_creative_work_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_creative_work_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_creative_work_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_creative_work_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_creative_work_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_extension_programs_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_extension_programs_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_extension_programs_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_extension_programs_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_extension_programs_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_extension_programs_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_oral_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_oral_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_oral_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_oral_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_oral_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_oral_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_other_accomplishments_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_other_accomplishments_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_other_accomplishments_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_other_accomplishments_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_other_accomplishments_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_other_accomplishments_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_partnerships_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_partnerships_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_partnerships_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_partnerships_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_partnerships_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_partnerships_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_patents_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_patents_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_patents_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_patents_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_patents_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_patents_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_publication_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_publication_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_publication_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_publication_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_publication_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_publication_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_research_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_research_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_research_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_research_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_research_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_research_forms_entry_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."pbms_trainings_forms" TO "anon";
GRANT ALL ON TABLE "public"."pbms_trainings_forms" TO "authenticated";
GRANT ALL ON TABLE "public"."pbms_trainings_forms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."pbms_trainings_forms_entry_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."pbms_trainings_forms_entry_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."pbms_trainings_forms_entry_id_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reviews_reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reviews_reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reviews_reviews_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."supporting_documents" TO "anon";
GRANT ALL ON TABLE "public"."supporting_documents" TO "authenticated";
GRANT ALL ON TABLE "public"."supporting_documents" TO "service_role";



GRANT ALL ON SEQUENCE "public"."supporting_documents_document_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."supporting_documents_document_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."supporting_documents_document_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































