alter table "public"."export_records" drop constraint "export_records_generated_by_fkey";

alter table "public"."reviews" drop constraint "reviews_reviewed_by_fkey";

alter table "public"."accomplishment_reports" alter column "faculty_id" set default gen_random_uuid();

alter table "public"."accomplishment_reports" alter column "faculty_id" set data type uuid using "faculty_id"::uuid;

alter table "public"."export_records" alter column "generated_by" set default gen_random_uuid();

alter table "public"."export_records" alter column "generated_by" set data type uuid using "generated_by"::uuid;

alter table "public"."faculties" alter column "email" set not null;

alter table "public"."faculties" alter column "faculty_id" set default gen_random_uuid();

alter table "public"."faculties" alter column "faculty_id" drop identity;

alter table "public"."faculties" alter column "faculty_id" set data type uuid using "faculty_id"::uuid;

alter table "public"."reviews" alter column "reviewed_by" set default gen_random_uuid();

alter table "public"."reviews" alter column "reviewed_by" set data type uuid using "reviewed_by"::uuid;

alter table "public"."export_records" add constraint "export_records_generated_by_fkey" FOREIGN KEY (generated_by) REFERENCES public.faculties(faculty_id) ON UPDATE CASCADE not valid;

alter table "public"."export_records" validate constraint "export_records_generated_by_fkey";

alter table "public"."reviews" add constraint "reviews_reviewed_by_fkey" FOREIGN KEY (reviewed_by) REFERENCES public.faculties(faculty_id) ON UPDATE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_reviewed_by_fkey";


