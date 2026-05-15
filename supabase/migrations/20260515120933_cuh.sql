create type "public"."activity_type" as enum ('training', 'seminar', 'workshop', 'forum');

create type "public"."award_type" as enum ('academic_institutional', 'national', 'international');

create type "public"."partnership_agreement_type" as enum ('moa', 'mou', 'other');

create type "public"."stakeholder_category" as enum ('government-lgu', 'government-nga', 'government-educational', 'private-ngo', 'private-industry', 'private-educational', 'private-sme-cooperative', 'foreign');

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

alter table "public"."isip_authorship_forms" alter column "attachments" set not null;

alter table "public"."isip_authorship_forms" alter column "author" set not null;

alter table "public"."isip_authorship_forms" alter column "material_title" set not null;

alter table "public"."isip_authorship_forms" alter column "year" set not null;

alter table "public"."isip_awards_forms" alter column "attachments" set not null;

alter table "public"."isip_awards_forms" alter column "award" set not null;

alter table "public"."isip_awards_forms" alter column "details" set not null;

alter table "public"."isip_awards_forms" alter column "end_date" set not null;

alter table "public"."isip_awards_forms" alter column "source" set not null;

alter table "public"."isip_awards_forms" alter column "start_date" set not null;

alter table "public"."isip_awards_forms" alter column "type" set not null;

alter table "public"."isip_awards_forms" alter column "type" set data type public.award_type using "type"::public.award_type;

alter table "public"."isip_extension_programs_forms" alter column "community_outreach" set not null;

alter table "public"."isip_extension_programs_forms" alter column "community_outreach" set data type boolean using "community_outreach"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "end_date" set not null;

alter table "public"."isip_extension_programs_forms" alter column "extension_title" set not null;

alter table "public"."isip_extension_programs_forms" alter column "external_clients_consultancy" set not null;

alter table "public"."isip_extension_programs_forms" alter column "external_clients_consultancy" set data type boolean using "external_clients_consultancy"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "external_clients_technical" set not null;

alter table "public"."isip_extension_programs_forms" alter column "external_clients_technical" set data type boolean using "external_clients_technical"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "information_dissemination" set not null;

alter table "public"."isip_extension_programs_forms" alter column "information_dissemination" set data type boolean using "information_dissemination"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "knowledge_transfer" set not null;

alter table "public"."isip_extension_programs_forms" alter column "knowledge_transfer" set data type boolean using "knowledge_transfer"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "organizing" set not null;

alter table "public"."isip_extension_programs_forms" alter column "organizing" set data type boolean using "organizing"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "program_description" set not null;

alter table "public"."isip_extension_programs_forms" alter column "start_date" set not null;

alter table "public"."isip_extension_programs_forms" alter column "target_beneficiary_group" set not null;

alter table "public"."isip_extension_programs_forms" alter column "training_courses" set not null;

alter table "public"."isip_extension_programs_forms" alter column "training_courses" set data type boolean using "training_courses"::boolean;

alter table "public"."isip_extension_programs_forms" alter column "work_scope" set not null;

alter table "public"."isip_partnership_forms" add column "training_scope" text not null;

alter table "public"."isip_partnership_forms" alter column "advisory_service" set not null;

alter table "public"."isip_partnership_forms" alter column "advisory_service" set data type boolean using "advisory_service"::boolean;

alter table "public"."isip_partnership_forms" alter column "community_outreach" set not null;

alter table "public"."isip_partnership_forms" alter column "community_outreach" set data type boolean using "community_outreach"::boolean;

alter table "public"."isip_partnership_forms" alter column "consultancy" set not null;

alter table "public"."isip_partnership_forms" alter column "consultancy" set data type boolean using "consultancy"::boolean;

alter table "public"."isip_partnership_forms" alter column "information_dissemination" set not null;

alter table "public"."isip_partnership_forms" alter column "information_dissemination" set data type boolean using "information_dissemination"::boolean;

alter table "public"."isip_partnership_forms" alter column "knowledge_transfer" set not null;

alter table "public"."isip_partnership_forms" alter column "knowledge_transfer" set data type boolean using "knowledge_transfer"::boolean;

alter table "public"."isip_partnership_forms" alter column "organizing_events" set not null;

alter table "public"."isip_partnership_forms" alter column "organizing_events" set data type boolean using "organizing_events"::boolean;

alter table "public"."isip_partnership_forms" alter column "partnership_title" set not null;

alter table "public"."isip_partnership_forms" alter column "training_courses" set not null;

alter table "public"."isip_partnership_forms" alter column "training_courses" set data type boolean using "training_courses"::boolean;

alter table "public"."isip_trainings_forms" alter column "activity_type" set not null;

alter table "public"."isip_trainings_forms" alter column "activity_type" set data type public.activity_type using "activity_type"::public.activity_type;

alter table "public"."isip_trainings_forms" alter column "attachments" set not null;

alter table "public"."isip_trainings_forms" alter column "end_date" set not null;

alter table "public"."isip_trainings_forms" alter column "start_date" set not null;

alter table "public"."isip_trainings_forms" alter column "training_title" set not null;

alter table "public"."isip_trainings_forms" alter column "venue" set not null;

alter table "public"."pbms_extension_programs_forms" alter column "contributing_unit" set not null;

alter table "public"."pbms_extension_programs_forms" alter column "contributing_unit" set data type public.contributing_unit using "contributing_unit"::public.contributing_unit;

alter table "public"."pbms_extension_programs_forms" alter column "majority_share_funding" set not null;

alter table "public"."pbms_extension_programs_forms" alter column "majority_share_funding" set data type public.majority_source_of_funds using "majority_share_funding"::public.majority_source_of_funds;

alter table "public"."pbms_extension_programs_forms" alter column "no_of_beneficiary_groups" set not null;

alter table "public"."pbms_extension_programs_forms" alter column "no_of_beneficiary_groups" set data type smallint using "no_of_beneficiary_groups"::smallint;

alter table "public"."pbms_partnerships_forms" alter column "contributing_unit" set not null;

alter table "public"."pbms_partnerships_forms" alter column "contributing_unit" set data type public.contributing_unit using "contributing_unit"::public.contributing_unit;

alter table "public"."pbms_partnerships_forms" alter column "partner_stakeholder_name" set not null;

alter table "public"."pbms_partnerships_forms" alter column "partnership_agreement" set not null;

alter table "public"."pbms_partnerships_forms" alter column "partnership_agreement_type" set not null;

alter table "public"."pbms_partnerships_forms" alter column "partnership_agreement_type" set data type public.partnership_agreement_type using "partnership_agreement_type"::public.partnership_agreement_type;

alter table "public"."pbms_partnerships_forms" alter column "partnership_effectivity_end_date" set not null;

alter table "public"."pbms_partnerships_forms" alter column "partnership_effectivity_start_date" set not null;

alter table "public"."pbms_partnerships_forms" alter column "stakeholder_category" set not null;

alter table "public"."pbms_partnerships_forms" alter column "stakeholder_category" set data type public.stakeholder_category using "stakeholder_category"::public.stakeholder_category;

alter table "public"."pbms_trainings_forms" add column "no_of_responses_very_satisfactory" smallint not null;

alter table "public"."pbms_trainings_forms" alter column "no_of_responses_fair" set not null;

alter table "public"."pbms_trainings_forms" alter column "no_of_responses_outsanding" set not null;

alter table "public"."pbms_trainings_forms" alter column "no_of_responses_poor" set not null;

alter table "public"."pbms_trainings_forms" alter column "no_of_responses_satisfactory" set not null;

alter table "public"."pbms_trainings_forms" alter column "part_extension_program" set not null;

alter table "public"."pbms_trainings_forms" alter column "part_extension_program" set data type boolean using "part_extension_program"::boolean;

alter table "public"."pbms_trainings_forms" alter column "sample_size" set not null;

alter table "public"."pbms_trainings_forms" alter column "special_notes_schedule" set not null;

alter table "public"."pbms_trainings_forms" alter column "total_trainees_number" set not null;

alter table "public"."pbms_trainings_forms" alter column "training_hours_required" set not null;


