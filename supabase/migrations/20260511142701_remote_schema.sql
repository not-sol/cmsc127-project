create type "public"."conference_location" as enum ('institutionalInhouse', 'localRegional', 'national', 'international');

create type "public"."contributing_unit" as enum ('csmod', 'dbses', 'dfsc', 'dmpcs');

create type "public"."event_scope" as enum ('institutional_in_house', 'local_regional', 'national', 'international');

create type "public"."event_type" as enum ('conference', 'forum', 'seminar', 'workshop');

create type "public"."majority_source_of_funds" as enum ('genFundCurYr', 'genFundSup', 'revolFund', 'intGenFund', 'rpGovtTrustFund', 'rpGovtDirFund', 'rpPrivTrustFund', 'forTrustFund', 'forDirFund');

create type "public"."output_type" as enum ('performing_arts', 'visual_arts', 'literary_work', 'textbook', 'computer_software', 'product_process_method_technology_innovation', 'other');

create type "public"."patent_type" as enum ('invention', 'utilityModel', 'industrialDesign');

create type "public"."presentation_type" as enum ('oral', 'poster');

create type "public"."public_event_type" as enum ('exhibition', 'performance', 'publication');

create type "public"."publication_type" as enum ('book', 'bookChapter', 'journalArticle', 'peerReviewed', 'conferencePaper', 'other');

create type "public"."publisher_location" as enum ('Local', 'International');

create type "public"."publisher_type" as enum ('Commercial', 'Learned Society / Association', 'University Press');

create type "public"."research_type" as enum ('basic', 'applied', 'policy');

create type "public"."research_utilization_output" as enum ('nAUtil', 'techDev', 'servProv', 'endProduct');

create type "public"."utilization_research_output" as enum ('not_applicable', 'development_of_technology', 'service_provision', 'end_product');

alter table "public"."pbms_publication_forms" drop constraint "pbms_publication_forms_form_id_fkey";

alter table "public"."pbms_publication_forms" drop constraint "pbms_publication_forms_pkey";

drop index if exists "public"."pbms_publication_forms_pkey";

alter table "public"."isip_creative_work_forms" alter column "creative_work_title" set not null;

alter table "public"."isip_creative_work_forms" alter column "event_end_date" set not null;

alter table "public"."isip_creative_work_forms" alter column "event_start_date" set not null;

alter table "public"."isip_creative_work_forms" alter column "research_proof" set not null;

alter table "public"."isip_oral_forms" alter column "attachments" set not null;

alter table "public"."isip_oral_forms" alter column "event_type" set not null;

alter table "public"."isip_oral_forms" alter column "event_type" set data type public.event_type using "event_type"::public.event_type;

alter table "public"."isip_oral_forms" alter column "paper_title" set not null;

alter table "public"."isip_oral_forms" alter column "presentation_type" set not null;

alter table "public"."isip_oral_forms" alter column "presentation_type" set data type public.presentation_type using "presentation_type"::public.presentation_type;

alter table "public"."isip_patents_forms" alter column "attachments" set not null;

alter table "public"."isip_publication_forms" alter column "ched_recognized" set not null;

alter table "public"."isip_publication_forms" alter column "ched_recognized" set data type boolean using "ched_recognized"::boolean;

alter table "public"."isip_publication_forms" alter column "isi" set not null;

alter table "public"."isip_publication_forms" alter column "isi" set data type boolean using "isi"::boolean;

alter table "public"."isip_publication_forms" alter column "peer_reviewed" set not null;

alter table "public"."isip_publication_forms" alter column "peer_reviewed" set data type boolean using "peer_reviewed"::boolean;

alter table "public"."isip_publication_forms" alter column "publication_author" set not null;

alter table "public"."isip_publication_forms" alter column "publication_date_published" set not null;

alter table "public"."isip_publication_forms" alter column "publication_name" set not null;

alter table "public"."isip_publication_forms" alter column "publication_proof" set not null;

alter table "public"."isip_publication_forms" alter column "publication_title" set not null;

alter table "public"."isip_publication_forms" alter column "publication_type" set not null;

alter table "public"."isip_publication_forms" alter column "publication_type" set data type public.publication_type using "publication_type"::public.publication_type;

alter table "public"."isip_publication_forms" alter column "pubmed" set not null;

alter table "public"."isip_publication_forms" alter column "pubmed" set data type boolean using "pubmed"::boolean;

alter table "public"."isip_publication_forms" alter column "scopus" set not null;

alter table "public"."isip_publication_forms" alter column "scopus" set data type boolean using "scopus"::boolean;

alter table "public"."isip_research_forms" alter column "attachments" set not null;

alter table "public"."isip_research_forms" alter column "funding_amount" set not null;

alter table "public"."isip_research_forms" alter column "research_grant" set not null;

alter table "public"."isip_research_forms" alter column "research_title" set not null;

alter table "public"."isip_research_forms" alter column "research_type" set not null;

alter table "public"."isip_research_forms" alter column "research_type" set data type public.research_type using "research_type"::public.research_type;

alter table "public"."isip_research_forms" alter column "researcher_name" set not null;

alter table "public"."isip_research_forms" alter column "start_date" set not null;

alter table "public"."isip_research_forms" alter column "total_funding" set not null;

alter table "public"."pbms_creative_work_forms" drop column "event_type";

alter table "public"."pbms_creative_work_forms" add column "event_title" text not null;

alter table "public"."pbms_creative_work_forms" alter column "date_released" set not null;

alter table "public"."pbms_creative_work_forms" alter column "event_scope" set not null;

alter table "public"."pbms_creative_work_forms" alter column "event_scope" set data type public.event_scope using "event_scope"::public.event_scope;

alter table "public"."pbms_creative_work_forms" alter column "event_venue" set not null;

alter table "public"."pbms_creative_work_forms" alter column "linked_research" set not null;

alter table "public"."pbms_creative_work_forms" alter column "organizer_name" set not null;

alter table "public"."pbms_creative_work_forms" alter column "output_type" set not null;

alter table "public"."pbms_creative_work_forms" alter column "output_type" set data type public.output_type using "output_type"::public.output_type;

alter table "public"."pbms_creative_work_forms" alter column "public_event_type" set not null;

alter table "public"."pbms_creative_work_forms" alter column "public_event_type" set data type public.public_event_type using "public_event_type"::public.public_event_type;

alter table "public"."pbms_creative_work_forms" alter column "utilization_proof" set not null;

alter table "public"."pbms_creative_work_forms" alter column "utilization_research_output" set not null;

alter table "public"."pbms_creative_work_forms" alter column "utilization_research_output" set data type public.utilization_research_output using "utilization_research_output"::public.utilization_research_output;

alter table "public"."pbms_oral_forms" alter column "conference_location" set not null;

alter table "public"."pbms_oral_forms" alter column "conference_location" set data type public.conference_location using "conference_location"::public.conference_location;

alter table "public"."pbms_oral_forms" alter column "conference_start_date" set not null;

alter table "public"."pbms_oral_forms" alter column "conference_title" set not null;

alter table "public"."pbms_oral_forms" alter column "linked_research" set not null;

alter table "public"."pbms_oral_forms" alter column "organizer_name" set not null;

alter table "public"."pbms_oral_forms" alter column "presentation_date" set not null;

alter table "public"."pbms_oral_forms" alter column "venue" set not null;

alter table "public"."pbms_patents_forms" alter column "applicant_name" set not null;

alter table "public"."pbms_patents_forms" alter column "application_no" set not null;

alter table "public"."pbms_patents_forms" alter column "inventor_name" set not null;

alter table "public"."pbms_patents_forms" alter column "linked_research" set not null;

alter table "public"."pbms_patents_forms" alter column "patent_title" set not null;

alter table "public"."pbms_patents_forms" alter column "patent_type" set not null;

alter table "public"."pbms_patents_forms" alter column "patent_type" set data type public.patent_type using "patent_type"::public.patent_type;

alter table "public"."pbms_patents_forms" alter column "publication_date" set not null;

alter table "public"."pbms_patents_forms" alter column "research_utilization_output" set not null;

alter table "public"."pbms_patents_forms" alter column "research_utilization_output" set data type public.research_utilization_output using "research_utilization_output"::public.research_utilization_output;

alter table "public"."pbms_publication_forms" drop column "form_id";

alter table "public"."pbms_publication_forms" add column "entry_id" bigint generated by default as identity not null;

alter table "public"."pbms_publication_forms" alter column "doi" set not null;

alter table "public"."pbms_publication_forms" alter column "number_of_citation" set data type numeric using "number_of_citation"::numeric;

alter table "public"."pbms_publication_forms" alter column "publisher_location" set not null;

alter table "public"."pbms_publication_forms" alter column "publisher_location" set data type public.publisher_location using "publisher_location"::public.publisher_location;

alter table "public"."pbms_publication_forms" alter column "publisher_name" set not null;

alter table "public"."pbms_publication_forms" alter column "publisher_type" set not null;

alter table "public"."pbms_publication_forms" alter column "publisher_type" set data type public.publisher_type using "publisher_type"::public.publisher_type;

alter table "public"."pbms_research_forms" alter column "contributing_unit" set not null;

alter table "public"."pbms_research_forms" alter column "contributing_unit" set data type public.contributing_unit using "contributing_unit"::public.contributing_unit;

alter table "public"."pbms_research_forms" alter column "majority_source_of_funds" set not null;

alter table "public"."pbms_research_forms" alter column "majority_source_of_funds" set data type public.majority_source_of_funds using "majority_source_of_funds"::public.majority_source_of_funds;

alter table "public"."pbms_research_forms" alter column "original_timeframe_months" set not null;

alter table "public"."pbms_research_forms" alter column "original_timeframe_months" set data type numeric using "original_timeframe_months"::numeric;

CREATE UNIQUE INDEX pbms_publication_forms_pkey ON public.pbms_publication_forms USING btree (entry_id);

alter table "public"."pbms_publication_forms" add constraint "pbms_publication_forms_pkey" PRIMARY KEY using index "pbms_publication_forms_pkey";

alter table "public"."pbms_publication_forms" add constraint "pbms_publication_forms_entry_id_fkey" FOREIGN KEY (entry_id) REFERENCES public.accomplishment_entries(entry_id) not valid;

alter table "public"."pbms_publication_forms" validate constraint "pbms_publication_forms_entry_id_fkey";


  create policy "allow authenticated uploads ftos4x_0"
  on "storage"."objects"
  as permissive
  for insert
  to authenticated
with check ((bucket_id = 'publication_proof'::text));



  create policy "allow authenticated uploads ftos4x_1"
  on "storage"."objects"
  as permissive
  for select
  to authenticated
using ((bucket_id = 'publication_proof'::text));



  create policy "allow authenticated uploads ftos4x_2"
  on "storage"."objects"
  as permissive
  for delete
  to authenticated
using ((bucket_id = 'publication_proof'::text));



  create policy "allow authenticated uploads ftos4x_3"
  on "storage"."objects"
  as permissive
  for update
  to authenticated
using ((bucket_id = 'publication_proof'::text));



