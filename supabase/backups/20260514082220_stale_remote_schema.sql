alter table "public"."accomplishment_entries" drop constraint "accomplishment_entries_form_type_id_fkey";

alter table "public"."accomplishment_entries" drop constraint "accomplishment_entries_report_id_fkey";

alter table "public"."accomplishment_reports" drop constraint "accomplishment_reports_faculty_id_fkey";

alter table "public"."export_records" drop constraint "export_records_generated_by_fkey";

alter table "public"."faculties" drop constraint "faculties_department_id_fkey";

alter table "public"."isip_authorship_forms" drop constraint "isip_authorship_forms_entry_id_fkey";

alter table "public"."isip_awards_forms" drop constraint "isip_awards_forms_entry_id_fkey";

alter table "public"."isip_creative_work_forms" drop constraint "isip_creative_work_forms_entry_id_fkey";

alter table "public"."isip_extension_programs_forms" drop constraint "isip_extension_programs_forms_entry_id_fkey";

alter table "public"."isip_oral_forms" drop constraint "isip_oral_forms_entry_id_fkey";

alter table "public"."isip_other_accomplishments_forms" drop constraint "isip_other_accomplishments_forms_entry_id_fkey";

alter table "public"."isip_partnership_forms" drop constraint "isip_partnership_forms_entry_id_fkey";

alter table "public"."isip_patents_forms" drop constraint "isip_patents_forms_entry_id_fkey";

alter table "public"."isip_publication_forms" drop constraint "isip_publication_forms_entry_id_fkey";

alter table "public"."isip_research_forms" drop constraint "isip_research_forms_entry_id_fkey";

alter table "public"."isip_trainings_forms" drop constraint "isip_trainings_forms_entry_id_fkey";

alter table "public"."pbms_creative_work_forms" drop constraint "pbms_creative_work_forms_entry_id_fkey";

alter table "public"."pbms_extension_programs_forms" drop constraint "pbms_extension_programs_forms_entry_id_fkey";

alter table "public"."pbms_oral_forms" drop constraint "pbms_oral_forms_entry_id_fkey";

alter table "public"."pbms_other_accomplishments_forms" drop constraint "pbms_other_accomplishments_forms_entry_id_fkey";

alter table "public"."pbms_partnerships_forms" drop constraint "pbms_partnerships_forms_entry_id_fkey";

alter table "public"."pbms_patents_forms" drop constraint "pbms_patents_forms_entry_id_fkey";

alter table "public"."pbms_publication_forms" drop constraint "pbms_publication_forms_entry_id_fkey";

alter table "public"."pbms_research_forms" drop constraint "pbms_research_forms_entry_id_fkey";

alter table "public"."pbms_trainings_forms" drop constraint "pbms_trainings_forms_entry_id_fkey";

alter table "public"."reviews" drop constraint "reviews_report_id_fkey";

alter table "public"."reviews" drop constraint "reviews_reviewed_by_fkey";

alter table "public"."supporting_documents" drop constraint "supporting_documents_entry_id_fkey";

alter table "public"."accomplishment_entries" drop column "end_date";

alter table "public"."accomplishment_entries" drop column "participation";

alter table "public"."accomplishment_entries" drop column "start_date";

alter table "public"."accomplishment_entries" drop column "venue";

alter table "public"."faculties" add column "roles" text;

alter table "public"."faculties" add column "status" text default 'pending'::text;

alter table "public"."isip_oral_forms" alter column "event_type" set data type public.event_type using "event_type"::text::public.event_type;

alter table "public"."isip_oral_forms" alter column "presentation_type" set data type public.presentation_type using "presentation_type"::text::public.presentation_type;

alter table "public"."isip_publication_forms" alter column "publication_type" set data type public.publication_type using "publication_type"::text::public.publication_type;

alter table "public"."isip_research_forms" alter column "research_type" set data type public.research_type using "research_type"::text::public.research_type;

alter table "public"."pbms_creative_work_forms" alter column "event_scope" set data type public.event_scope using "event_scope"::text::public.event_scope;

alter table "public"."pbms_creative_work_forms" alter column "output_type" set data type public.output_type using "output_type"::text::public.output_type;

alter table "public"."pbms_creative_work_forms" alter column "public_event_type" set data type public.public_event_type using "public_event_type"::text::public.public_event_type;

alter table "public"."pbms_creative_work_forms" alter column "utilization_research_output" set data type public.utilization_research_output using "utilization_research_output"::text::public.utilization_research_output;

alter table "public"."pbms_oral_forms" alter column "conference_location" set data type public.conference_location using "conference_location"::text::public.conference_location;

alter table "public"."pbms_patents_forms" alter column "patent_type" set data type public.patent_type using "patent_type"::text::public.patent_type;

alter table "public"."pbms_patents_forms" alter column "research_utilization_output" set data type public.research_utilization_output using "research_utilization_output"::text::public.research_utilization_output;

alter table "public"."pbms_publication_forms" alter column "publisher_location" set data type public.publisher_location using "publisher_location"::text::public.publisher_location;

alter table "public"."pbms_publication_forms" alter column "publisher_type" set data type public.publisher_type using "publisher_type"::text::public.publisher_type;

alter table "public"."pbms_research_forms" alter column "contributing_unit" set data type public.contributing_unit using "contributing_unit"::text::public.contributing_unit;

alter table "public"."pbms_research_forms" alter column "majority_source_of_funds" set data type public.majority_source_of_funds using "majority_source_of_funds"::text::public.majority_source_of_funds;

alter table "public"."faculties" add constraint "faculties_roles_check" CHECK ((roles = ANY (ARRAY['faculty'::text, 'department_chair'::text]))) not valid;

alter table "public"."faculties" validate constraint "faculties_roles_check";

alter table "public"."faculties" add constraint "faculties_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text]))) not valid;

alter table "public"."faculties" validate constraint "faculties_status_check";

alter table "public"."accomplishment_entries" add constraint "accomplishment_entries_form_type_id_fkey" FOREIGN KEY (form_type_id) REFERENCES public.form_types(form_type_id) not valid;

alter table "public"."accomplishment_entries" validate constraint "accomplishment_entries_form_type_id_fkey";

alter table "public"."accomplishment_entries" add constraint "accomplishment_entries_report_id_fkey" FOREIGN KEY (report_id) REFERENCES public.accomplishment_reports(report_id) not valid;

alter table "public"."accomplishment_entries" validate constraint "accomplishment_entries_report_id_fkey";

alter table "public"."accomplishment_reports" add constraint "accomplishment_reports_faculty_id_fkey" FOREIGN KEY (faculty_id) REFERENCES public.faculties(faculty_id) not valid;

alter table "public"."accomplishment_reports" validate constraint "accomplishment_reports_faculty_id_fkey";

alter table "public"."export_records" add constraint "export_records_generated_by_fkey" FOREIGN KEY (generated_by) REFERENCES public.faculties(faculty_id) ON UPDATE CASCADE not valid;

alter table "public"."export_records" validate constraint "export_records_generated_by_fkey";

alter table "public"."faculties" add constraint "faculties_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public.departments(department_id) not valid;

alter table "public"."faculties" validate constraint "faculties_department_id_fkey";

alter table "public"."isip_authorship_forms" add constraint "isip_authorship_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_authorship_forms" validate constraint "isip_authorship_forms_entry_id_fkey";

alter table "public"."isip_awards_forms" add constraint "isip_awards_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_awards_forms" validate constraint "isip_awards_forms_entry_id_fkey";

alter table "public"."isip_creative_work_forms" add constraint "isip_creative_work_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_creative_work_forms" validate constraint "isip_creative_work_forms_entry_id_fkey";

alter table "public"."isip_extension_programs_forms" add constraint "isip_extension_programs_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_extension_programs_forms" validate constraint "isip_extension_programs_forms_entry_id_fkey";

alter table "public"."isip_oral_forms" add constraint "isip_oral_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_oral_forms" validate constraint "isip_oral_forms_entry_id_fkey";

alter table "public"."isip_other_accomplishments_forms" add constraint "isip_other_accomplishments_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_other_accomplishments_forms" validate constraint "isip_other_accomplishments_forms_entry_id_fkey";

alter table "public"."isip_partnership_forms" add constraint "isip_partnership_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_partnership_forms" validate constraint "isip_partnership_forms_entry_id_fkey";

alter table "public"."isip_patents_forms" add constraint "isip_patents_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_patents_forms" validate constraint "isip_patents_forms_entry_id_fkey";

alter table "public"."isip_publication_forms" add constraint "isip_publication_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_publication_forms" validate constraint "isip_publication_forms_entry_id_fkey";

alter table "public"."isip_research_forms" add constraint "isip_research_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_research_forms" validate constraint "isip_research_forms_entry_id_fkey";

alter table "public"."isip_trainings_forms" add constraint "isip_trainings_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."isip_trainings_forms" validate constraint "isip_trainings_forms_entry_id_fkey";

alter table "public"."pbms_creative_work_forms" add constraint "pbms_creative_work_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_creative_work_forms" validate constraint "pbms_creative_work_forms_entry_id_fkey";

alter table "public"."pbms_extension_programs_forms" add constraint "pbms_extension_programs_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_extension_programs_forms" validate constraint "pbms_extension_programs_forms_entry_id_fkey";

alter table "public"."pbms_oral_forms" add constraint "pbms_oral_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_oral_forms" validate constraint "pbms_oral_forms_entry_id_fkey";

alter table "public"."pbms_other_accomplishments_forms" add constraint "pbms_other_accomplishments_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_other_accomplishments_forms" validate constraint "pbms_other_accomplishments_forms_entry_id_fkey";

alter table "public"."pbms_partnerships_forms" add constraint "pbms_partnerships_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_partnerships_forms" validate constraint "pbms_partnerships_forms_entry_id_fkey";

alter table "public"."pbms_patents_forms" add constraint "pbms_patents_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_patents_forms" validate constraint "pbms_patents_forms_entry_id_fkey";

alter table "public"."pbms_publication_forms" add constraint "pbms_publication_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_publication_forms" validate constraint "pbms_publication_forms_entry_id_fkey";

alter table "public"."pbms_research_forms" add constraint "pbms_research_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_research_forms" validate constraint "pbms_research_forms_entry_id_fkey";

alter table "public"."pbms_trainings_forms" add constraint "pbms_trainings_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_trainings_forms" validate constraint "pbms_trainings_forms_entry_id_fkey";

alter table "public"."reviews" add constraint "reviews_report_id_fkey" FOREIGN KEY (report_id) REFERENCES public.accomplishment_reports(report_id) not valid;

alter table "public"."reviews" validate constraint "reviews_report_id_fkey";

alter table "public"."reviews" add constraint "reviews_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.faculties(faculty_id) ON UPDATE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_reviewed_by_fkey";

alter table "public"."supporting_documents" add constraint "supporting_documents_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."supporting_documents" validate constraint "supporting_documents_entry_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.faculties (
    auth_id,
    email,
    roles,
    status
  )
  values (
    new.id,
    new.email,
    'faculty',
    'pending'
  );

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.is_approved()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  select exists (
    select 1
    from public.faculties
    where faculty_id = auth.uid()
      and status = 'approved'
  );
$function$
;

CREATE OR REPLACE FUNCTION public.is_department_chair()
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
AS $function$
  select exists (
    select 1
    from public.faculties
    where faculty_id = auth.uid()
      and roles = 'department_chair'
  );
$function$
;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


