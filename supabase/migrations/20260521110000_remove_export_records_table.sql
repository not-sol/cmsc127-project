-- Migration to remove the legacy export_records table
-- This table is no longer used as exports are generated on-the-fly in the frontend

DROP TABLE IF EXISTS public.export_records CASCADE;
