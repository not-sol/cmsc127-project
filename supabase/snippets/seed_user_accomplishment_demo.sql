-- Manual demo-data snippet for accomplishment reports.
--
-- Usage:
-- 1. Change target_email below if needed.
-- 2. Run this manually in Supabase SQL Editor or with:
--    npx supabase db query --file supabase/snippets/seed_user_accomplishment_demo.sql
--
-- This snippet resolves the target from public.users.email and links all sample
-- reports/forms to that real authenticated account. It removes only rows from
-- prior runs that are marked with [manual-demo].

DO $$
DECLARE
  target_email text := 'jtastones@up.edu.ph';
  target_user public.users%ROWTYPE;
  target_department_id bigint;
  target_author text;
  demo_report_ids bigint[];
  demo_entry_ids bigint[];
  r_draft_multi bigint;
  r_draft_single bigint;
  r_draft_innovation bigint;
  r_draft_grant bigint;
  r_pending bigint;
  r_reviewed bigint;
  r_archived_single bigint;
  r_archived_multi bigint;
  e_publication bigint;
  e_research bigint;
  e_training bigint;
  e_presentation bigint;
  e_patent bigint;
  e_creative bigint;
  e_grant bigint;
  e_pending_publication bigint;
  e_pending_presentation bigint;
  e_reviewed_creative bigint;
  e_archived_training bigint;
  e_archived_publication bigint;
  e_archived_research bigint;
BEGIN
  SELECT *
  INTO target_user
  FROM public.users
  WHERE lower(email) = lower(target_email)
  LIMIT 1;

  IF target_user.id IS NULL THEN
    RAISE EXCEPTION 'No public.users row found for email %. Sign in as this user once first, then rerun this snippet.', target_email
      USING ERRCODE = 'P0002';
  END IF;

  target_department_id := COALESCE(
    target_user.department_id,
    (SELECT department_id FROM public.departments WHERE department_name = 'Department of Mathematics, Physics & Computer Science')
  );

  IF target_department_id IS NULL THEN
    RAISE EXCEPTION 'No department_id available for %, and DMPCS full department row is missing.', target_email
      USING ERRCODE = 'P0002';
  END IF;

  target_author := trim(concat_ws(' ', target_user.first_name, target_user.last_name));
  IF target_author = '' THEN
    target_author := target_user.email;
  END IF;

  INSERT INTO public.form_types (form_type_id, form_name)
  VALUES
    (1, 'Publications'),
    (2, 'Research, Grants, and Fellowships'),
    (3, 'Paper Presentations'),
    (4, 'Patents'),
    (5, 'Creative Work'),
    (6, 'Awards and Grants'),
    (7, 'Trainings')
  ON CONFLICT (form_type_id) DO UPDATE
  SET form_name = EXCLUDED.form_name;

  SELECT array_agg(report_id)
  INTO demo_report_ids
  FROM public.accomplishment_reports
  WHERE faculty_id = target_user.id
    AND remarks LIKE '[manual-demo]%';

  SELECT array_agg(entry_id)
  INTO demo_entry_ids
  FROM public.forms
  WHERE report_id = ANY(COALESCE(demo_report_ids, ARRAY[]::bigint[]));

  IF demo_entry_ids IS NOT NULL THEN
    DELETE FROM public.isip_publication_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.pbms_publication_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.isip_research_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.pbms_research_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.isip_oral_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.pbms_oral_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.isip_patents_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.pbms_patents_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.isip_creative_work_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.pbms_creative_work_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.isip_trainings_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.pbms_trainings_forms WHERE entry_id = ANY(demo_entry_ids);
    DELETE FROM public.forms WHERE entry_id = ANY(demo_entry_ids);
  END IF;

  IF demo_report_ids IS NOT NULL THEN
    DELETE FROM public.reviews WHERE report_id = ANY(demo_report_ids);
    DELETE FROM public.accomplishment_reports WHERE report_id = ANY(demo_report_ids);
  END IF;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2026-01-01',
    '2026-03-31',
    NULL,
    'draft',
    '[manual-demo] Draft Q1 2026 DMPCS research and publication report for editing workflow tests.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_draft_multi;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2026-04-01',
    '2026-06-30',
    NULL,
    'draft',
    '[manual-demo] Draft Q2 2026 training report with one editable form.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_draft_single;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2026-07-01',
    '2026-09-30',
    NULL,
    'draft',
    '[manual-demo] Draft Q3 2026 innovation report with presentation, patent, and creative work forms.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_draft_innovation;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2025-10-01',
    '2025-12-31',
    NULL,
    'draft',
    '[manual-demo] Draft year-end research grant report with one form awaiting final budget figures.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_draft_grant;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2025-07-01',
    '2025-09-30',
    '2025-10-06',
    'pending',
    '[manual-demo] Submitted Q3 2025 dissemination report pending department chair review.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_pending;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2025-04-01',
    '2025-06-30',
    '2025-07-04',
    'reviewed',
    '[manual-demo] Reviewed Q2 2025 creative software output report retained for reference.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_reviewed;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2024-10-01',
    '2024-12-31',
    '2025-01-08',
    'archived',
    '[manual-demo] Archived 2024 training report used to validate archived report separation.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_archived_single;

  INSERT INTO public.accomplishment_reports (
    start_date,
    end_date,
    date_submitted,
    status,
    remarks,
    faculty_id,
    department_id
  )
  VALUES (
    '2024-07-01',
    '2024-09-30',
    '2024-10-05',
    'archived',
    '[manual-demo] Archived 2024 multi-form research and publication report available for restoration tests.',
    target_user.id,
    target_department_id
  )
  RETURNING report_id INTO r_archived_multi;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Explainable AI Models for Philippine Crop Disease Detection', 'Journal article prepared from the crop analytics lab.', target_author || ', Adrian Santos, Maria Dela Cruz', r_draft_multi, 1)
  RETURNING entry_id INTO e_publication;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Edge-Based Crop Disease Detection Toolkit', 'Externally funded applied research project.', target_author || ', Adrian Santos', r_draft_multi, 2)
  RETURNING entry_id INTO e_research;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Python for Reproducible Research Workflows', 'Hands-on workshop for junior faculty and research assistants.', target_author, r_draft_single, 7)
  RETURNING entry_id INTO e_training;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Deep Learning for Low-Bandwidth Agricultural Monitoring', 'Oral presentation at an international AI conference.', target_author, r_draft_innovation, 3)
  RETURNING entry_id INTO e_presentation;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Smart Irrigation Valve Controller', 'Patent application derived from the smart farms project.', target_author || ', Mark Lim', r_draft_innovation, 4)
  RETURNING entry_id INTO e_patent;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('AgriSight Analytics Dashboard', 'Creative software output for research data visualization.', target_author, r_draft_innovation, 5)
  RETURNING entry_id INTO e_creative;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Mathematical Modeling of Davao River Flood Risk', 'Draft research grant record pending final funding confirmation.', target_author || ', Nina Uy', r_draft_grant, 2)
  RETURNING entry_id INTO e_grant;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Privacy-Preserving Learning for Campus Health Records', 'Conference publication for chair review.', target_author || ', Ramon Tan', r_pending, 1)
  RETURNING entry_id INTO e_pending_publication;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Federated Learning for Small Health Datasets', 'Paper presentation linked to the campus health project.', target_author, r_pending, 3)
  RETURNING entry_id INTO e_pending_presentation;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Open-Source Enrollment Forecasting Dashboard', 'Reviewed software output used by academic planning staff.', target_author, r_reviewed, 5)
  RETURNING entry_id INTO e_reviewed_creative;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Data Ethics Bootcamp for Extension Personnel', 'Archived public-service training activity.', target_author, r_archived_single, 7)
  RETURNING entry_id INTO e_archived_training;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Bayesian Forecasting of Regional Dengue Incidence', 'Archived journal article for restoration tests.', target_author || ', Hazel Ong', r_archived_multi, 1)
  RETURNING entry_id INTO e_archived_publication;

  INSERT INTO public.forms (title, description, author, report_id, form_type_id)
  VALUES ('Regional Dengue Forecasting Decision Support', 'Archived applied research grant tied to the dengue forecasting paper.', target_author || ', Hazel Ong', r_archived_multi, 2)
  RETURNING entry_id INTO e_archived_research;

  INSERT INTO public.isip_publication_forms (
    entry_id, publication_type, publication_title, publication_author,
    publication_date_published, publication_name, isi, scopus, pubmed,
    ched_recognized, peer_reviewed, other_reputable_database,
    publication_proof, remarks, related_kras
  )
  VALUES
    (e_publication, 'journalArticle', 'Explainable AI Models for Philippine Crop Disease Detection', target_author || ', Adrian Santos, Maria Dela Cruz', '2026-02-18', 'Philippine Computing Journal', true, true, false, true, true, NULL, 'form-a/demo-publication-proof.pdf', 'Draft article record with complete bibliographic data.', 'Research and creative work'),
    (e_pending_publication, 'conferencePaper', 'Privacy-Preserving Learning for Campus Health Records', target_author || ', Ramon Tan', '2025-08-20', 'Proceedings of the National Health Informatics Conference', false, true, false, true, true, NULL, 'form-a/demo-health-publication-proof.pdf', 'Submitted publication evidence ready for review.', 'Research dissemination'),
    (e_archived_publication, 'journalArticle', 'Bayesian Forecasting of Regional Dengue Incidence', target_author || ', Hazel Ong', '2024-08-12', 'Mindanao Journal of Public Health Analytics', false, true, true, true, true, NULL, 'form-a/demo-dengue-publication-proof.pdf', 'Archived publication retained for historical reporting.', 'Public health analytics');

  INSERT INTO public.pbms_publication_forms (
    entry_id, publisher_name, publisher_type, publisher_location,
    editor_name, volume_issue_no, doi, isbn, number_of_citation,
    utilization_proof
  )
  VALUES
    (e_publication, 'UP Mindanao Press', 'University Press', 'Local', 'Dr. Elena Ramos', 'Vol. 14, Issue 1', '10.5281/pcj.2026.114', NULL, 2, 'form-a/demo-utilization-proof.pdf'),
    (e_pending_publication, 'Philippine Health Informatics Society', 'Learned Society / Association', 'Local', 'Dr. Miguel Reyes', 'Conference Proceedings 2025', '10.5281/phic.2025.22', '978-971-000-225-3', 1, 'form-a/demo-health-utilization-proof.pdf'),
    (e_archived_publication, 'Mindanao Public Health Association', 'Learned Society / Association', 'Local', 'Dr. Hazel Ong', 'Vol. 8, Issue 3', '10.5281/mjpha.2024.083', NULL, 6, 'form-a/demo-dengue-utilization-proof.pdf');

  INSERT INTO public.isip_research_forms (
    entry_id, research_title, research_type, start_date, end_date,
    researcher_name, research_grant, funding_amount, total_funding,
    other_fund_source, attachments, remarks, related_kras
  )
  VALUES
    (e_research, 'Edge-Based Crop Disease Detection Toolkit', 'applied', '2026-01-15', '2026-12-15', target_author || ', Adrian Santos', 450000, 275000, 725000, 'Local partner farm cooperative', 'form-b/demo-moa-and-budget.pdf', 'Draft grant entry with partner funding and UP system support.', 'Research productivity'),
    (e_grant, 'Mathematical Modeling of Davao River Flood Risk', 'basic', '2025-10-20', '2026-10-19', target_author || ', Nina Uy', 300000, 0, 300000, NULL, 'form-b/demo-flood-proposal.pdf', 'Draft record awaiting final internal budget confirmation.', 'Disaster-risk analytics'),
    (e_archived_research, 'Regional Dengue Forecasting Decision Support', 'applied', '2024-07-01', '2025-06-30', target_author || ', Hazel Ong', 650000, 250000, 900000, 'Regional health analytics consortium', 'form-b/demo-dengue-completion-report.pdf', 'Archived applied research record with completion documents.', 'Public service and research');

  INSERT INTO public.pbms_research_forms (
    entry_id, contributing_unit, original_timeframe_months, majority_source_of_funds
  )
  VALUES
    (e_research, 'dmpcs', 12, 'rpPrivTrustFund'),
    (e_grant, 'dmpcs', 12, 'genFundCurYr'),
    (e_archived_research, 'dmpcs', 12, 'rpGovtDirFund');

  INSERT INTO public.isip_oral_forms (
    entry_id, paper_title, presentation_type, event_type, attachments, remarks
  )
  VALUES
    (e_presentation, 'Deep Learning for Low-Bandwidth Agricultural Monitoring', 'oral', 'conference', 'form-c/demo-presentation-certificate.pdf', 'Draft presentation record for an accepted conference talk.'),
    (e_pending_presentation, 'Federated Learning for Small Health Datasets', 'poster', 'conference', 'form-c/demo-poster-certificate.pdf', 'Submitted poster presentation linked to the health records project.');

  INSERT INTO public.pbms_oral_forms (
    entry_id, linked_research, conference_title, organizer_name,
    conference_location, venue, conference_start_date, conference_end_date,
    presentation_date
  )
  VALUES
    (e_presentation, 'Edge-Based Crop Disease Detection Toolkit', 'International Conference on AI for Sustainable Agriculture 2026', 'Asian AI Research Network', 'international', 'Chiang Mai, Thailand', '2026-08-18', '2026-08-21', '2026-08-19'),
    (e_pending_presentation, 'Privacy-Preserving Learning for Campus Health Records', 'National Health Informatics Conference 2025', 'Philippine Health Informatics Society', 'national', 'Quezon City, Philippines', '2025-09-11', '2025-09-13', '2025-09-12');

  INSERT INTO public.isip_patents_forms (entry_id, attachments, remarks)
  VALUES (e_patent, 'form-d/demo-ipophl-application.pdf', 'Draft patent record with IPOPHL filing details for validation.');

  INSERT INTO public.pbms_patents_forms (
    entry_id, linked_research, patent_title, patent_type, application_no,
    inventor_name, applicant_name, publication_date, grant_date,
    registration_no, commercial_product_name, research_utilization_output
  )
  VALUES (e_patent, 'Edge-Based Crop Disease Detection Toolkit', 'Smart Irrigation Valve Controller', 'invention', 2026001142, target_author || ', Mark Lim', 'University of the Philippines Mindanao', '2026-07-15', NULL, NULL, 'AgriValve Edge Controller', 'techDev');

  INSERT INTO public.isip_creative_work_forms (
    entry_id, creative_work_title, event_start_date, event_end_date,
    research_proof, remarks
  )
  VALUES
    (e_creative, 'AgriSight Analytics Dashboard', '2026-09-02', '2026-09-05', 'form-e/demo-video.mp4', 'Draft creative software output for deployment testing.'),
    (e_reviewed_creative, 'Open-Source Enrollment Forecasting Dashboard', '2025-05-05', '2025-05-09', 'form-e/demo-release-notes.pdf', 'Reviewed dashboard released to academic planning staff.');

  INSERT INTO public.pbms_creative_work_forms (
    entry_id, linked_research, output_type, public_event_type,
    organizer_name, event_scope, event_venue, date_released,
    utilization_research_output, utilization_proof, event_title
  )
  VALUES
    (e_creative, 'Edge-Based Crop Disease Detection Toolkit', 'computer_software', 'exhibition', 'UP Mindanao Research Office', 'national', 'Davao City, Philippines', '2026-09-05', 'service_provision', 'form-e/demo-user-feedback.pdf', 'UP Mindanao Innovation Week 2026'),
    (e_reviewed_creative, 'Enrollment Forecasting Study', 'computer_software', 'publication', 'DMPCS Academic Planning Committee', 'institutional_in_house', 'UP Mindanao', '2025-05-09', 'service_provision', 'form-e/demo-adoption-memo.pdf', 'Academic Planning Tools Release');

  INSERT INTO public.isip_trainings_forms (
    entry_id, activity_type, training_title, venue, start_date, end_date,
    attachments, remarks
  )
  VALUES
    (e_training, 'workshop', 'Python for Reproducible Research Workflows', 'UP Mindanao Computer Laboratory 2', '2026-05-14', '2026-05-16', 'form-g/demo-attendance-and-evaluation.pdf', 'Draft training record with attendance, evaluation, and schedule attachments.'),
    (e_archived_training, 'seminar', 'Data Ethics Bootcamp for Extension Personnel', 'Davao City Extension Hub', '2024-11-12', '2024-11-13', 'form-g/demo-completion-report.pdf', 'Archived seminar delivered for extension personnel.');

  INSERT INTO public.pbms_trainings_forms (
    entry_id, contributing_unit, special_notes_schedule, training_hours_required,
    total_trainees_number, majority_share_funding, sample_size,
    no_of_responses_poor, no_of_responses_fair,
    no_of_responses_satisfactory, no_of_responses_outsanding,
    no_of_responses_very_satisfactory, part_extension_program,
    related_extension_program_title
  )
  VALUES
    (e_training, 'dmpcs', 'Three half-day laboratory sessions', 12, 32, 'genFundCurYr', 28, 0, 1, 9, 14, 4, false, NULL),
    (e_archived_training, 'dmpcs', 'Two-day bootcamp with policy clinic', 16, 24, 'intGenFund', 22, 0, 2, 8, 10, 2, true, 'Digital Literacy and Data Governance Extension Program');

  RAISE NOTICE 'Seeded manual demo reports for %: draft=4, pending=1, reviewed=1, archived=2', target_email;
END $$;
