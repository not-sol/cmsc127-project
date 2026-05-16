create type "public"."activity_type" as enum ('training', 'seminar', 'workshop', 'forum');

create type "public"."award_type" as enum ('academic_institutional', 'national', 'international');

create type "public"."partnership_agreement_type" as enum ('moa', 'mou', 'other');

create type "public"."stakeholder_category" as enum ('government-lgu', 'government-nga', 'government-educational', 'private-ngo', 'private-industry', 'private-educational', 'private-sme-cooperative', 'foreign');


DO $$ 
DECLARE
    t text;
    tables text[] := ARRAY[
        'form_a_publications',
        'form_b_grants_and_fellowships',
        'form_c_presentations',
        'form_d_patents',
        'form_e_creative_work_outputs',
        'form_f_awards_and_grants',
        'form_g_trainings',
        'form_h_extension_programs',
        'form_i_partnerships',
        'form_j_authorships',
        'form_k_other_accomplishments'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = t) THEN
            EXECUTE format('DROP TABLE public.%I CASCADE', t);
        END IF;
    END LOOP;
END $$;

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


