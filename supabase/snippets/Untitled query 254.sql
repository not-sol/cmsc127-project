insert into public.accomplishment_reports (
  start_date,
  end_date,
  date_submitted,
  status,
  remarks,
  department_id,
  faculty_id
)
values
  ('2026-01-01', '2026-03-31', '2026-04-05', 'pending', 'Dummy seed: CSMOD Q1 research, publications, and training report awaiting chair review.', (select department_id from public.departments where department_name = 'CSMOD'), null),
  ('2026-04-01', '2026-06-30', '2026-07-04', 'reviewed', 'Dummy seed: CSMOD Q2 accomplishments reviewed with minor documentation follow-up.', (select department_id from public.departments where department_name = 'CSMOD'), null),
  ('2025-10-01', '2025-12-31', '2026-01-10', 'draft', 'Dummy seed: CSMOD year-end report still being prepared by faculty.', (select department_id from public.departments where department_name = 'CSMOD'), null),

  ('2026-01-01', '2026-03-31', '2026-04-08', 'pending', 'Dummy seed: DBSES biodiversity monitoring and extension report pending review.', (select department_id from public.departments where department_name = 'DBSES'), null),
  ('2026-04-01', '2026-06-30', '2026-07-06', 'reviewed', 'Dummy seed: DBSES coastal research and community engagement report reviewed.', (select department_id from public.departments where department_name = 'DBSES'), null),
  ('2025-07-01', '2025-09-30', '2025-10-12', 'archived', 'Dummy seed: DBSES archived quarterly accomplishments report.', (select department_id from public.departments where department_name = 'DBSES'), null),

  ('2026-01-01', '2026-03-31', '2026-04-03', 'pending', 'Dummy seed: DFSC food systems research report pending department chair action.', (select department_id from public.departments where department_name = 'DFSC'), null),
  ('2026-04-01', '2026-06-30', '2026-07-02', 'reviewed', 'Dummy seed: DFSC laboratory service and publication report reviewed.', (select department_id from public.departments where department_name = 'DFSC'), null),
  ('2025-10-01', '2025-12-31', '2026-01-09', 'draft', 'Dummy seed: DFSC draft accomplishments for validation.', (select department_id from public.departments where department_name = 'DFSC'), null),

  ('2026-01-01', '2026-03-31', '2026-04-07', 'pending', 'Dummy seed: DMPCS computational science and math education report pending review.', (select department_id from public.departments where department_name = 'DMPCS'), null),
  ('2026-04-01', '2026-06-30', '2026-07-08', 'reviewed', 'Dummy seed: DMPCS reviewed report covering research dissemination and student mentoring.', (select department_id from public.departments where department_name = 'DMPCS'), null),
  ('2025-07-01', '2025-09-30', '2025-10-07', 'archived', 'Dummy seed: DMPCS archived report retained for historical testing.', (select department_id from public.departments where department_name = 'DMPCS'), null);