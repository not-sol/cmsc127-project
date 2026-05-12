SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict IhZVg0RprBCoE73fokuo6s699NxLx6s9a3WZsheXFuaLnaBQAz9vbjIdr7xLAnF

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: faculties; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: accomplishment_reports; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: form_types; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: accomplishment_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."accomplishment_entries" ("entry_id", "created_at", "title", "description", "venue", "participation", "author", "start_date", "end_date", "report_id", "form_type_id") VALUES
	(1, '2026-05-09 16:09:02.55422+00', 'sus', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(2, '2026-05-09 16:09:28.810231+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(3, '2026-05-09 16:09:45.840192+00', NULL, NULL, 'Hell, Michigan', NULL, NULL, NULL, NULL, NULL, NULL),
	(4, '2026-05-09 16:53:53.168688+00', 'weird thingn', 'yuh', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(5, '2026-05-09 16:54:17.178694+00', '', 'i am the angry pumpkin', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(7, '2026-05-10 13:59:55.015146+00', NULL, 'description', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(8, '2026-05-10 14:00:13.761596+00', NULL, '', NULL, 'PARTICIPAYSHUN', NULL, NULL, NULL, NULL, NULL),
	(6, '2026-05-10 13:59:49.082524+00', 'title', 'description', NULL, NULL, 'ijnoonp', '2022-02-22', NULL, NULL, NULL),
	(9, '2026-05-10 17:14:47.517703+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(10, '2026-05-10 17:14:51.767281+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(11, '2026-05-10 17:14:54.834745+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(12, '2026-05-10 17:14:57.646152+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(13, '2026-05-10 17:15:00.369274+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(14, '2026-05-10 17:15:03.07487+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(15, '2026-05-10 17:15:06.110163+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(16, '2026-05-10 17:15:08.702152+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(17, '2026-05-10 17:15:11.435136+00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
	(18, '2026-05-10 17:15:26.832688+00', 'title', 'not title', 'place', NULL, NULL, NULL, '2023-04-25', NULL, NULL);


--
-- Data for Name: export_records; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isip_authorship_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isip_awards_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isip_creative_work_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isip_creative_work_forms" ("entry_id", "creative_work_title", "other_type", "event_start_date", "event_end_date", "research_proof", "remarks", "related_kras") VALUES
	(5, 'Nunizer', NULL, '2025-11-30', '2025-12-13', 'Even more proof', 'yeah', NULL);


--
-- Data for Name: isip_extension_programs_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isip_oral_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isip_oral_forms" ("entry_id", "paper_title", "presentation_type", "event_type", "attachments", "remarks", "related_kras") VALUES
	(4, 'Alliteration at an aggressively astronomical amount', 'poster', 'forum', 'image', 'mid af burhh', NULL);


--
-- Data for Name: isip_other_accomplishments_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isip_partnership_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: isip_patents_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isip_patents_forms" ("entry_id", "attachments", "remarks") VALUES
	(5, 'lookie here', 'important');


--
-- Data for Name: isip_publication_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isip_publication_forms" ("entry_id", "publication_type", "publication_title", "publication_author", "publication_date_published", "publication_name", "isi", "scopus", "pubmed", "ched_recognized", "peer_reviewed", "other_reputable_database", "publication_proof", "remarks", "related_kras") VALUES
	(1, 'book', 'Sdakfghilfasd: What is this paper', 'Becilio I, Ird W', '2021-10-10', 'The Journal', false, true, false, false, false, NULL, 'meow', NULL, NULL),
	(2, 'bookChapter', 'Chapter VII: Wait wasn''t this 6', 'Fasd S', '2025-05-13', 'The Booke of Miseries', true, true, true, true, true, NULL, 'look at ts', 'bro what', NULL),
	(12, 'book', 'Sample Publication Title', 'Dela Cruz, Juan', '2026-10-10', 'Name of Publication', false, false, false, false, false, NULL, 'Heres a proof', NULL, NULL);


--
-- Data for Name: isip_research_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."isip_research_forms" ("entry_id", "research_title", "research_type", "start_date", "end_date", "researcher_name", "research_grant", "funding_amount", "total_funding", "other_fund_source", "attachments", "remarks", "related_kras") VALUES
	(4, 'Redundancy, like a whole lot', 'basic', '2025-12-06', '2026-05-07', 'Smetana S', 65, 65, 130, NULL, 'lord alvin redund''s biography', 'This is, in fact, truly, verily, indeed, actually, apparently, really, a paper, which is of research variety, that is used as a means, method, form, and procedure to convey the topic at hand', NULL),
	(5, 'The Adjective of Noun: How Noun Affects Noun', 'applied', '2025-11-26', NULL, 'Smetana S., Bazinga S', 159, 1, 160, NULL, 'look at this thing vro', NULL, NULL);


--
-- Data for Name: isip_trainings_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pbms_creative_work_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pbms_creative_work_forms" ("entry_id", "linked_research", "output_type", "public_event_type", "event_title", "organizer_name", "event_scope", "event_venue", "date_released", "utilization_research_output", "utilization_proof") VALUES
	(5, 'The Adjective of Noun: How Noun Affects Noun', 'visual_arts', 'exhibition', 'Random objects from who cares and wherever', 'Org Anne I. Zer', 'international', 'Utrecht, NL', '2025-11-25', 'development_of_technology', 'look at this placeholder');


--
-- Data for Name: pbms_extension_programs_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pbms_oral_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pbms_oral_forms" ("entry_id", "linked_research", "conference_title", "organizer_name", "conference_location", "venue", "conference_start_date", "conference_end_date", "presentation_date") VALUES
	(4, 'Redundancy, like a whole lot', 'The means of remembering Lord Alvin Redund through a homage, a dedication, and third thing', 'Lord Alvin Redund IIIIIIIIIIIIII <-this ordinal number', 'institutionalInhouse', 'Toledo, Ohio', '2025-08-31', '2025-09-06', '2025-09-02');


--
-- Data for Name: pbms_other_accomplishments_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pbms_partnerships_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: pbms_patents_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pbms_patents_forms" ("entry_id", "linked_research", "patent_title", "patent_type", "application_no", "inventor_name", "applicant_name", "publication_date", "grant_date", "registration_no", "commercial_product_name", "research_utilization_output") VALUES
	(5, 'The Adjective of Noun: How Noun Affects Noun', 'The Noun Nouner', 'invention', 91240, 'Sobriquet Name Surname', 'Meaf Loaf', '2025-11-03', '2026-01-14', 1015032, '[the] [TITLE]', 'endProduct');


--
-- Data for Name: pbms_publication_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pbms_publication_forms" ("entry_id", "publisher_name", "publisher_type", "publisher_location", "editor_name", "volume_issue_no", "doi", "isbn", "number_of_citation", "utilization_proof") VALUES
	(1, 'Sbermann''s and co.', 'Commercial', 'Local', NULL, 'Vol. 69, No. 420', 'doidoidoidoidoi', NULL, NULL, NULL),
	(2, 'Laird Enervon', 'University Press', 'International', NULL, NULL, 'doioiod', NULL, 14, NULL),
	(12, 'PubllishnNAme', 'Commercial', 'Local', NULL, NULL, 'doidoidoidoidoidoidoidoidoidoid', NULL, NULL, NULL);


--
-- Data for Name: pbms_research_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."pbms_research_forms" ("entry_id", "contributing_unit", "original_timeframe_months", "majority_source_of_funds") VALUES
	(4, 'csmod', 5, 'rpGovtDirFund'),
	(5, 'dfsc', 2, 'forDirFund');


--
-- Data for Name: pbms_trainings_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: supporting_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id", "type") VALUES
	('publication_proof', 'publication_proof', NULL, '2026-05-09 15:39:43.208885+00', '2026-05-09 15:39:43.208885+00', false, false, NULL, NULL, NULL, 'STANDARD');


--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: accomplishment_entries_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."accomplishment_entries_entry_id_seq"', 1, false);


--
-- Name: accomplishment_entries_entry_id_seq1; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."accomplishment_entries_entry_id_seq1"', 18, true);


--
-- Name: department_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."department_department_id_seq"', 1, false);


--
-- Name: export_records_export_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."export_records_export_id_seq"', 1, false);


--
-- Name: faculties_faculty_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."faculties_faculty_id_seq"', 1, false);


--
-- Name: form_types_form_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."form_types_form_type_id_seq"', 1, false);


--
-- Name: isip_authorship_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_authorship_forms_entry_id_seq"', 1, false);


--
-- Name: isip_awards_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_awards_forms_entry_id_seq"', 1, false);


--
-- Name: isip_creative_work_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_creative_work_forms_entry_id_seq"', 1, false);


--
-- Name: isip_extension_programs_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_extension_programs_forms_entry_id_seq"', 1, false);


--
-- Name: isip_oral_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_oral_forms_entry_id_seq"', 1, false);


--
-- Name: isip_other_accomplishments_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_other_accomplishments_forms_entry_id_seq"', 1, false);


--
-- Name: isip_partnership_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_partnership_forms_entry_id_seq"', 1, false);


--
-- Name: isip_patents_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_patents_forms_entry_id_seq"', 1, false);


--
-- Name: isip_publications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_publications_id_seq"', 1, false);


--
-- Name: isip_research_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_research_forms_entry_id_seq"', 1, false);


--
-- Name: isip_trainings_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."isip_trainings_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_creative_work_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_creative_work_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_extension_programs_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_extension_programs_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_oral_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_oral_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_other_accomplishments_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_other_accomplishments_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_partnerships_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_partnerships_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_patents_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_patents_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_publication_forms_form_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_publication_forms_form_id_seq"', 1, false);


--
-- Name: pbms_research_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_research_forms_entry_id_seq"', 1, false);


--
-- Name: pbms_trainings_forms_entry_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."pbms_trainings_forms_entry_id_seq"', 1, false);


--
-- Name: reviews_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."reviews_reviews_id_seq"', 1, false);


--
-- Name: supporting_documents_document_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."supporting_documents_document_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict IhZVg0RprBCoE73fokuo6s699NxLx6s9a3WZsheXFuaLnaBQAz9vbjIdr7xLAnF

RESET ALL;
