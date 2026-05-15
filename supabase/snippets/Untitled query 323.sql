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
	(5, 'The Adjective of Noun: How Noun Affects Noun', 'The Noun Nouner', 'invention', '91240', 'Sobriquet Name Surname', 'Meaf Loaf', '2025-11-03', '2026-01-14', '1015032', '[the] [TITLE]', 'endProduct');


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
	('publication_proof', 'publication_proof', NULL, '2026-05-09 15:39:43.208885+00', '2026-05-09 15:39:43.208885+00', false, false, NULL, NULL, NULL, 'STANDARD'),
	('attachments', 'attachments', NULL, '2026-05-14 14:04:27.355947+00', '2026-05-14 14:04:27.355947+00', false, false, NULL, NULL, NULL, 'STANDARD'),
	('research_proof', 'research_proof', NULL, '2026-05-14 14:07:09.642065+00', '2026-05-14 14:07:09.642065+00', false, false, NULL, NULL, NULL, 'STANDARD');

