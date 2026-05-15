alter table "public"."pbms_trainings_forms" add column "no_of_responses_very_satisfactory" smallint;

alter table "public"."isip_research_forms" add constraint "isip_research_forms_funding_amount_check" CHECK ((funding_amount >= 0.00)) not valid;

alter table "public"."isip_research_forms" validate constraint "isip_research_forms_funding_amount_check";

alter table "public"."isip_research_forms" add constraint "isip_research_forms_research_grant_check" CHECK ((research_grant >= 0.00)) not valid;

alter table "public"."isip_research_forms" validate constraint "isip_research_forms_research_grant_check";

alter table "public"."isip_research_forms" add constraint "isip_research_forms_total_funding_check" CHECK ((total_funding >= 0.00)) not valid;

alter table "public"."isip_research_forms" validate constraint "isip_research_forms_total_funding_check";


