alter table "public"."isip_research_forms" drop constraint "isip_research_forms_funding_amount_check";

alter table "public"."isip_research_forms" drop constraint "isip_research_forms_research_grant_check";

alter table "public"."isip_research_forms" drop constraint "isip_research_forms_total_funding_check";

alter table "public"."pbms_trainings_forms" drop column "no_of_responses_very_satisfactory";

alter table "public"."pbms_trainings_forms" alter column "contributing_unit" set not null;

alter table "public"."pbms_trainings_forms" alter column "contributing_unit" set data type public.contributing_unit using "contributing_unit"::public.contributing_unit;

alter table "public"."pbms_trainings_forms" alter column "majority_share_funding" set not null;

alter table "public"."pbms_trainings_forms" alter column "majority_share_funding" set data type public.majority_source_of_funds using "majority_share_funding"::public.majority_source_of_funds;


