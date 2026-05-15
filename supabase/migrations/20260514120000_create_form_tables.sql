-- migration script for 11 accomplishment tables

-- Form A: Publications
CREATE TABLE IF NOT EXISTS public.form_a_publications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    publication_type public.publication_type,
    other_publication_type_text text,
    publication_title text,
    publication_authors text,
    publication_date text,
    publication_name text,
    publisher_name text,
    publisher_type public.publisher_type,
    publisher_location public.publisher_location,
    editor_names text,
    volume_issue text,
    doi_url text,
    isbn_issn text,
    is_isi boolean DEFAULT false,
    is_scopus boolean DEFAULT false,
    is_pubmed_medline boolean DEFAULT false,
    is_ched_recognized boolean DEFAULT false,
    is_peer_reviewed boolean DEFAULT false,
    other_database text,
    citation_count text,
    proof_of_publication_files jsonb DEFAULT '[]'::jsonb,
    proof_of_utilization_files jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form B: Research/Grants
CREATE TABLE IF NOT EXISTS public.form_b_grants_and_fellowships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    contributing_unit public.contributing_unit,
    research_title text,
    research_type public.research_type,
    research_start_date date,
    research_end_date date,
    research_timeframe_months text,
    researcher_names text,
    up_system_research_grant_pesos numeric DEFAULT 0,
    external_funding_amount_pesos numeric DEFAULT 0,
    total_funding_pesos numeric DEFAULT 0,
    other_fund_source text,
    majority_source public.majority_source_of_funds,
    supporting_attachments jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form C: Presentations
CREATE TABLE IF NOT EXISTS public.form_c_presentations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    linked_research_title text,
    presented_title text,
    presentation_type public.presentation_type,
    event_type public.event_type,
    event_title text,
    organizer_name text,
    conference_location public.conference_location,
    conference_address text,
    conference_start_date date,
    conference_end_date date,
    presentation_date date,
    attachments jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form D: Patents
CREATE TABLE IF NOT EXISTS public.form_d_patents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    linked_research_title text,
    patent_title text,
    patent_type public.patent_type,
    application_number text,
    inventor_names text,
    applicant_names text,
    unexamined_application_date date,
    grant_patent_date date,
    registration_number text,
    commercial_product_name text,
    utilization_type public.research_utilization_output,
    attachments jsonb DEFAULT '[]'::jsonb,
    remarks text
);

-- Form E: Creative Work
CREATE TABLE IF NOT EXISTS public.form_e_creative_work_outputs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    linked_research text,
    title_of_artistic_work text,
    type_of_output public.output_type,
    other_type text,
    type_of_public_event public.public_event_type,
    title_of_event text,
    organizer text,
    location_scope public.event_scope,
    event_venue_city_country text,
    event_start_date date,
    event_end_date date,
    first_shown_released_date date,
    utilization public.utilization_research_output,
    proof_of_research_output jsonb DEFAULT '[]'::jsonb,
    proof_of_utilization jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form F: Awards
CREATE TABLE IF NOT EXISTS public.form_f_awards_and_grants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    type text, -- The frontend uses 'academic_institutional', 'national', 'international'
    award_grant_title text,
    source_awarding_body text,
    details text,
    start_date date,
    end_date date,
    attachments jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form G: Trainings
CREATE TABLE IF NOT EXISTS public.form_g_trainings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    contributing_unit text,
    type_of_activity text,
    title text,
    venue text,
    start_date date,
    end_date date,
    special_notes text,
    training_hours integer,
    total_trainees integer,
    funding_source text,
    sample_size integer,
    responses_poor integer,
    responses_fair integer,
    responses_satisfactory integer,
    responses_very_satisfactory integer,
    responses_outstanding integer,
    is_part_of_extension_program boolean DEFAULT false,
    related_extension_program text,
    attachments jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form H: Extension Programs
CREATE TABLE IF NOT EXISTS public.form_h_extension_programs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    contributing_unit text,
    title text,
    training_courses boolean DEFAULT false,
    technical_advisory_service boolean DEFAULT false,
    information_dissemination boolean DEFAULT false,
    consultancy boolean DEFAULT false,
    community_outreach boolean DEFAULT false,
    technology_transfer boolean DEFAULT false,
    organizing boolean DEFAULT false,
    academic_degree_programs text,
    scope_of_work text, -- The frontend uses text values
    start_date date,
    end_date date,
    target_beneficiary text,
    number_of_beneficiaries integer,
    funding_source text,
    program_documents jsonb DEFAULT '[]'::jsonb,
    remarks text
);

-- Form I: Partnerships
CREATE TABLE IF NOT EXISTS public.form_i_partnerships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    contributing_unit text,
    title_of_extension_partnership text,
    scope_of_work text,
    partner_stakeholder_name text,
    stakeholder_category text,
    training_courses boolean DEFAULT false,
    technical_advisory_service boolean DEFAULT false,
    information_dissemination boolean DEFAULT false,
    consultancy boolean DEFAULT false,
    community_outreach boolean DEFAULT false,
    technology_knowledge_transfer boolean DEFAULT false,
    organizing_events boolean DEFAULT false,
    type_of_partnership_agreement text,
    partnership_effectivity_start_date date,
    partnership_effectivity_end_date date,
    moa_document jsonb DEFAULT '[]'::jsonb,
    remarks text
);

-- Form J: Authorships
CREATE TABLE IF NOT EXISTS public.form_j_authorships (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    title_of_material text,
    authors text,
    year integer,
    attachments jsonb DEFAULT '[]'::jsonb,
    remarks text,
    related_kras text
);

-- Form K: Other Accomplishments
CREATE TABLE IF NOT EXISTS public.form_k_other_accomplishments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now() NOT NULL,
    submitted_by uuid REFERENCES auth.users(id),
    title text,
    description text,
    accomplishment_date date,
    supporting_documents jsonb DEFAULT '[]'::jsonb
);

-- RLS Policies Configuration
DO $$
DECLARE
    table_name text;
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
    FOREACH table_name IN ARRAY tables LOOP
        -- Enable RLS
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);

        -- Insert Policy: Users can only insert their own records
        EXECUTE format('DROP POLICY IF EXISTS "Users can insert their own records" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Users can insert their own records" ON public.%I FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by)', table_name);

        -- Select Policy: Users can view all records
        EXECUTE format('DROP POLICY IF EXISTS "Enable select for authenticated users only" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Enable select for authenticated users only" ON public.%I FOR SELECT TO authenticated USING (true)', table_name);

        -- Update Policy: Users can only update their own records
        EXECUTE format('DROP POLICY IF EXISTS "Users can update their own records" ON public.%I', table_name);
        EXECUTE format('CREATE POLICY "Users can update their own records" ON public.%I FOR UPDATE TO authenticated USING (auth.uid() = submitted_by)', table_name);
    END LOOP;
END $$;
