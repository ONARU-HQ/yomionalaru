-- ENUMS
CREATE TYPE public.venture_status AS ENUM ('idea','building','beta','live','operating','paused','archived');
CREATE TYPE public.connection_state AS ENUM ('live','synced','curated','not_connected');
CREATE TYPE public.enquiry_status AS ENUM ('new','reviewing','contacted','meeting','closed');
CREATE TYPE public.archive_category AS ENUM ('work','build','thoughts','places','people','media');

-- VENTURES
CREATE TABLE public.ventures (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  tagline text,
  description text,
  long_description text,
  status public.venture_status NOT NULL DEFAULT 'building',
  connection public.connection_state NOT NULL DEFAULT 'curated',
  category text,
  logo_url text,
  cover_image text,
  accent_color text,
  website_url text,
  cta_label text,
  cta_url text,
  features text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz DEFAULT now()
);
GRANT SELECT ON public.ventures TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ventures TO authenticated;
GRANT ALL ON public.ventures TO service_role;
ALTER TABLE public.ventures ENABLE ROW LEVEL SECURITY;
CREATE POLICY ventures_public_read ON public.ventures FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY ventures_staff_read ON public.ventures FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY ventures_manage ON public.ventures FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- ECOSYSTEM UPDATES
CREATE TABLE public.ecosystem_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venture_id uuid REFERENCES public.ventures(id) ON DELETE CASCADE,
  venture_label text,
  title text NOT NULL,
  description text,
  image_url text,
  cta_label text,
  cta_url text,
  category text,
  source public.connection_state NOT NULL DEFAULT 'curated',
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ecosystem_updates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ecosystem_updates TO authenticated;
GRANT ALL ON public.ecosystem_updates TO service_role;
ALTER TABLE public.ecosystem_updates ENABLE ROW LEVEL SECURITY;
CREATE POLICY updates_public_read ON public.ecosystem_updates FOR SELECT TO anon, authenticated USING (published = true AND published_at <= now());
CREATE POLICY updates_staff_read ON public.ecosystem_updates FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY updates_manage ON public.ecosystem_updates FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- WORK PROJECTS
CREATE TABLE public.work_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  client text,
  year text,
  category text,
  role text,
  summary text,
  overview text,
  challenge text,
  approach text,
  execution text,
  result text,
  cover_image text,
  gallery text[] NOT NULL DEFAULT '{}',
  video_url text,
  external_url text,
  venture_id uuid REFERENCES public.ventures(id) ON DELETE SET NULL,
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.work_projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.work_projects TO authenticated;
GRANT ALL ON public.work_projects TO service_role;
ALTER TABLE public.work_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY work_public_read ON public.work_projects FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY work_staff_read ON public.work_projects FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY work_manage ON public.work_projects FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- JOURNEY MILESTONES
CREATE TABLE public.journey_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year text NOT NULL,
  title text NOT NULL,
  description text,
  image_url text,
  video_url text,
  venture_id uuid REFERENCES public.ventures(id) ON DELETE SET NULL,
  project_id uuid REFERENCES public.work_projects(id) ON DELETE SET NULL,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.journey_milestones TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.journey_milestones TO authenticated;
GRANT ALL ON public.journey_milestones TO service_role;
ALTER TABLE public.journey_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY journey_public_read ON public.journey_milestones FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY journey_manage ON public.journey_milestones FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- ARCHIVE
CREATE TABLE public.archive_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  category public.archive_category NOT NULL DEFAULT 'work',
  description text,
  body text,
  image_url text,
  url text,
  entry_date text,
  tags text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.archive_entries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.archive_entries TO authenticated;
GRANT ALL ON public.archive_entries TO service_role;
ALTER TABLE public.archive_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY archive_public_read ON public.archive_entries FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY archive_manage ON public.archive_entries FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- PRESS
CREATE TABLE public.press_mentions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  publication text NOT NULL,
  headline text NOT NULL,
  url text,
  image_url text,
  mention_date text,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.press_mentions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.press_mentions TO authenticated;
GRANT ALL ON public.press_mentions TO service_role;
ALTER TABLE public.press_mentions ENABLE ROW LEVEL SECURITY;
CREATE POLICY press_public_read ON public.press_mentions FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY press_manage ON public.press_mentions FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- SPEAKING TOPICS
CREATE TABLE public.speaking_topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  audience text,
  format text,
  available boolean NOT NULL DEFAULT true,
  published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.speaking_topics TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.speaking_topics TO authenticated;
GRANT ALL ON public.speaking_topics TO service_role;
ALTER TABLE public.speaking_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY topics_public_read ON public.speaking_topics FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY topics_manage ON public.speaking_topics FOR ALL TO authenticated USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- ENQUIRIES
CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text,
  phone text,
  enquiry_type text NOT NULL,
  subject text,
  message text NOT NULL,
  budget text,
  timeline text,
  event_name text,
  event_date text,
  event_location text,
  audience_size text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  status public.enquiry_status NOT NULL DEFAULT 'new',
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.enquiries TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiries TO authenticated;
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY enquiries_insert_any ON public.enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY enquiries_admin_read ON public.enquiries FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY enquiries_admin_update ON public.enquiries FOR UPDATE TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY enquiries_admin_delete ON public.enquiries FOR DELETE TO authenticated USING (public.is_admin(auth.uid()));

CREATE TABLE public.enquiry_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id uuid NOT NULL REFERENCES public.enquiries(id) ON DELETE CASCADE,
  author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.enquiry_notes TO authenticated;
GRANT ALL ON public.enquiry_notes TO service_role;
ALTER TABLE public.enquiry_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY notes_admin_all ON public.enquiry_notes FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- INTEGRATIONS
CREATE TABLE public.integration_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  label text NOT NULL,
  provider text NOT NULL,
  endpoint_url text,
  config jsonb NOT NULL DEFAULT '{}'::jsonb,
  connection public.connection_state NOT NULL DEFAULT 'not_connected',
  enabled boolean NOT NULL DEFAULT false,
  last_sync_at timestamptz,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.integration_sources TO authenticated;
GRANT ALL ON public.integration_sources TO service_role;
ALTER TABLE public.integration_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY integrations_admin_all ON public.integration_sources FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE TABLE public.integration_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_key text NOT NULL UNIQUE,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  fetched_at timestamptz NOT NULL DEFAULT now(),
  ok boolean NOT NULL DEFAULT true,
  error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.integration_cache TO authenticated;
GRANT ALL ON public.integration_cache TO service_role;
ALTER TABLE public.integration_cache ENABLE ROW LEVEL SECURITY;
CREATE POLICY cache_admin_read ON public.integration_cache FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- TIMESTAMP TRIGGERS
CREATE TRIGGER t_ventures_u BEFORE UPDATE ON public.ventures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_ecosystem_updates_u BEFORE UPDATE ON public.ecosystem_updates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_work_projects_u BEFORE UPDATE ON public.work_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_journey_u BEFORE UPDATE ON public.journey_milestones FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_archive_u BEFORE UPDATE ON public.archive_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_press_u BEFORE UPDATE ON public.press_mentions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_topics_u BEFORE UPDATE ON public.speaking_topics FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_enquiries_u BEFORE UPDATE ON public.enquiries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_integrations_u BEFORE UPDATE ON public.integration_sources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_intcache_u BEFORE UPDATE ON public.integration_cache FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- INDEXES
CREATE INDEX idx_updates_published_at ON public.ecosystem_updates (published_at DESC);
CREATE INDEX idx_work_featured ON public.work_projects (featured, sort_order);
CREATE INDEX idx_archive_category ON public.archive_entries (category, sort_order);
CREATE INDEX idx_enquiries_status ON public.enquiries (status, created_at DESC);

-- SEED: the six ventures + integration source rows
INSERT INTO public.ventures (name, slug, tagline, description, status, connection, category, website_url, cta_label, cta_url, featured, sort_order) VALUES
('TRYSA','trysa','Business infrastructure for creative professionals.','The operating system for creative businesses — clients, projects, galleries, invoicing and delivery in one place.','live','curated','Technology',NULL,'Explore TRYSA','/ecosystem/trysa',true,1),
('Yomi Visuals','yomi-visuals','Visual storytelling and creative direction.','Photography, film and creative direction for brands, culture and people.','operating','curated','Creative',NULL,'Explore Yomi Visuals','/ecosystem/yomi-visuals',true,2),
('YV Studios','yv-studios','Spaces built for creators.','Studio spaces designed for photographers, filmmakers and creative teams.','operating','curated','Spaces',NULL,'Explore YV Studios','/ecosystem/yv-studios',true,3),
('Yomi Unscripted','yomi-unscripted','Building in public, on camera.','Conversations, behind the scenes and lessons from building creative companies.','live','not_connected','Media','https://www.youtube.com/@YVStudiosHQ','Watch on YouTube','https://www.youtube.com/@YVStudiosHQ',true,4),
('TRYSA Academy','academy','Teaching the business behind the craft.','Education for creatives who want to build durable businesses.','building','curated','Education',NULL,'Explore the Academy','/ecosystem/academy',false,5),
('ONARU Ventures','onaru-ventures','Building and backing companies that solve real problems.','The company builder behind the ecosystem.','building','curated','Ventures',NULL,'Explore ONARU Ventures','/ecosystem/onaru-ventures',false,6);

INSERT INTO public.integration_sources (key, label, provider, endpoint_url, connection, enabled) VALUES
('youtube_yomi_unscripted','Yomi Unscripted (YouTube)','youtube','https://www.youtube.com/@YVStudiosHQ','not_connected',false),
('trysa_status','TRYSA product status','trysa',NULL,'not_connected',false),
('yv_studios_availability','YV Studios availability','yv_studios',NULL,'not_connected',false);