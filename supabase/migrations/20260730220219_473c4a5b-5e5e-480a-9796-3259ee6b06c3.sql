-- ===== ENUMS =====
CREATE TYPE public.app_role AS ENUM ('super_admin','admin','editor','author');
CREATE TYPE public.content_status AS ENUM ('draft','scheduled','published','archived');

-- ===== UTIL =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  suspended BOOLEAN NOT NULL DEFAULT false,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== USER ROLES =====
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.role_rank(_role public.app_role)
RETURNS INT LANGUAGE sql IMMUTABLE SET search_path = public AS $$
  SELECT CASE _role WHEN 'super_admin' THEN 4 WHEN 'admin' THEN 3 WHEN 'editor' THEN 2 WHEN 'author' THEN 1 ELSE 0 END;
$$;

CREATE OR REPLACE FUNCTION public.user_rank(_user_id UUID)
RETURNS INT LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(MAX(public.role_rank(role)), 0)
  FROM public.user_roles ur
  JOIN public.profiles p ON p.id = ur.user_id
  WHERE ur.user_id = _user_id AND p.suspended = false;
$$;

-- rank >= 1 : any staff (author)
CREATE OR REPLACE FUNCTION public.is_staff(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_rank(_user_id) >= 1;
$$;
CREATE OR REPLACE FUNCTION public.is_editor(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_rank(_user_id) >= 2;
$$;
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_rank(_user_id) >= 3;
$$;
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.user_rank(_user_id) >= 4;
$$;

CREATE POLICY "profiles_select_self_or_staff" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "profiles_update_self" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));
CREATE POLICY "profiles_admin_delete" ON public.profiles FOR DELETE TO authenticated
  USING (public.is_super_admin(auth.uid()));

CREATE POLICY "user_roles_select" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin(auth.uid()));
CREATE POLICY "user_roles_super_manage" ON public.user_roles FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

-- auto profile + super admin bootstrap
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (NEW.id, NEW.email,
          COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)),
          NEW.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;

  IF lower(NEW.email) = 'yomionalaru@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'super_admin') ON CONFLICT DO NOTHING;
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    SELECT NEW.id, i.role FROM public.invitations i
    WHERE lower(i.email) = lower(NEW.email) AND i.accepted_at IS NULL
    ON CONFLICT DO NOTHING;
    UPDATE public.invitations SET accepted_at = now() WHERE lower(email) = lower(NEW.email) AND accepted_at IS NULL;
  END IF;
  RETURN NEW;
END; $$;

-- ===== INVITATIONS =====
CREATE TABLE public.invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role public.app_role NOT NULL DEFAULT 'author',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  accepted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT ALL ON public.invitations TO service_role;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invitations_super" ON public.invitations FOR ALL TO authenticated
  USING (public.is_super_admin(auth.uid())) WITH CHECK (public.is_super_admin(auth.uid()));

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== TAXONOMY =====
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, description TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== ARTICLES =====
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  body TEXT NOT NULL DEFAULT '',
  featured_image TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  reading_time INT NOT NULL DEFAULT 5,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  featured BOOLEAN NOT NULL DEFAULT false,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  view_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX articles_status_idx ON public.articles(status, published_at DESC);

-- ===== COMPANIES =====
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT,
  tagline TEXT,
  description TEXT,
  mission TEXT,
  vision TEXT,
  problem TEXT,
  logo_url TEXT,
  cover_image TEXT,
  website TEXT,
  status TEXT NOT NULL DEFAULT 'Building',
  progress INT NOT NULL DEFAULT 0,
  launch_year TEXT,
  services TEXT[] NOT NULL DEFAULT '{}',
  products TEXT[] NOT NULL DEFAULT '{}',
  roadmap JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== PORTFOLIO =====
CREATE TABLE public.portfolio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  client TEXT,
  category TEXT,
  year TEXT,
  description TEXT,
  cover_image TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  video_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== TESTIMONIALS / SPEAKING / BOOKS / RESOURCES =====
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, role TEXT, company TEXT, quote TEXT NOT NULL,
  avatar_url TEXT, featured BOOLEAN NOT NULL DEFAULT false,
  visible BOOLEAN NOT NULL DEFAULT true, sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.speaking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, event TEXT, location TEXT, date TEXT, description TEXT,
  link TEXT, image_url TEXT, visible BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, author TEXT, note TEXT, cover_url TEXT, link TEXT,
  visible BOOLEAN NOT NULL DEFAULT true, sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL, description TEXT, url TEXT, type TEXT, image_url TEXT,
  visible BOOLEAN NOT NULL DEFAULT true, sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== NEWSLETTER / CONTACTS =====
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  source TEXT,
  status TEXT NOT NULL DEFAULT 'subscribed',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, message TEXT NOT NULL,
  category TEXT, is_read BOOLEAN NOT NULL DEFAULT false,
  replied BOOLEAN NOT NULL DEFAULT false, archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ===== SETTINGS / MEDIA / LOGS =====
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.media_library (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL, path TEXT NOT NULL, url TEXT NOT NULL,
  mime_type TEXT, size_bytes BIGINT, folder TEXT NOT NULL DEFAULT 'general',
  alt_text TEXT, uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT, action TEXT NOT NULL, entity TEXT, entity_id TEXT, meta JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  path TEXT NOT NULL, referrer TEXT, session_id TEXT, country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_idx ON public.page_views(created_at DESC);

-- ===== GRANTS =====
GRANT SELECT ON public.categories, public.tags, public.articles, public.companies,
  public.portfolio, public.testimonials, public.speaking, public.books,
  public.resources, public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories, public.tags, public.articles,
  public.companies, public.portfolio, public.testimonials, public.speaking, public.books,
  public.resources, public.settings, public.media_library, public.newsletter_subscribers,
  public.contacts, public.audit_logs, public.page_views TO authenticated;
GRANT INSERT ON public.newsletter_subscribers, public.contacts, public.page_views TO anon;
GRANT ALL ON public.categories, public.tags, public.articles, public.companies,
  public.portfolio, public.testimonials, public.speaking, public.books, public.resources,
  public.settings, public.media_library, public.newsletter_subscribers, public.contacts,
  public.audit_logs, public.page_views TO service_role;

-- ===== RLS =====
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- taxonomy: public read, editor manage
CREATE POLICY "categories_public_read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories_manage" ON public.categories FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));
CREATE POLICY "tags_public_read" ON public.tags FOR SELECT USING (true);
CREATE POLICY "tags_manage" ON public.tags FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- articles
CREATE POLICY "articles_public_read" ON public.articles FOR SELECT
  USING (status = 'published' AND (published_at IS NULL OR published_at <= now()));
CREATE POLICY "articles_staff_read" ON public.articles FOR SELECT TO authenticated
  USING (public.is_staff(auth.uid()));
CREATE POLICY "articles_author_insert" ON public.articles FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()) AND (public.is_editor(auth.uid()) OR author_id = auth.uid()));
CREATE POLICY "articles_author_update" ON public.articles FOR UPDATE TO authenticated
  USING (public.is_editor(auth.uid()) OR author_id = auth.uid())
  WITH CHECK (public.is_editor(auth.uid()) OR author_id = auth.uid());
CREATE POLICY "articles_delete" ON public.articles FOR DELETE TO authenticated
  USING (public.is_editor(auth.uid()) OR author_id = auth.uid());

-- content tables: public read visible, editor manage
CREATE POLICY "companies_public_read" ON public.companies FOR SELECT USING (visible = true);
CREATE POLICY "companies_staff_read" ON public.companies FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "companies_manage" ON public.companies FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "portfolio_public_read" ON public.portfolio FOR SELECT USING (visible = true);
CREATE POLICY "portfolio_staff_read" ON public.portfolio FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "portfolio_manage" ON public.portfolio FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT USING (visible = true);
CREATE POLICY "testimonials_manage" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "speaking_public_read" ON public.speaking FOR SELECT USING (visible = true);
CREATE POLICY "speaking_manage" ON public.speaking FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "books_public_read" ON public.books FOR SELECT USING (visible = true);
CREATE POLICY "books_manage" ON public.books FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

CREATE POLICY "resources_public_read" ON public.resources FOR SELECT USING (visible = true);
CREATE POLICY "resources_manage" ON public.resources FOR ALL TO authenticated
  USING (public.is_editor(auth.uid())) WITH CHECK (public.is_editor(auth.uid()));

-- settings: public read, admin manage
CREATE POLICY "settings_public_read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_manage" ON public.settings FOR ALL TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- media: staff
CREATE POLICY "media_staff" ON public.media_library FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- newsletter: anyone subscribe, admin read/manage
CREATE POLICY "newsletter_insert_any" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_read" ON public.newsletter_subscribers FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY "newsletter_admin_delete" ON public.newsletter_subscribers FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscribers FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- contacts: anyone submit, admin manage
CREATE POLICY "contacts_insert_any" ON public.contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "contacts_admin_read" ON public.contacts FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));
CREATE POLICY "contacts_admin_update" ON public.contacts FOR UPDATE TO authenticated
  USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "contacts_admin_delete" ON public.contacts FOR DELETE TO authenticated
  USING (public.is_admin(auth.uid()));

-- audit logs: staff insert, admin read
CREATE POLICY "audit_insert" ON public.audit_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "audit_read" ON public.audit_logs FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- page views: anyone insert, admin read
CREATE POLICY "views_insert_any" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "views_admin_read" ON public.page_views FOR SELECT TO authenticated
  USING (public.is_admin(auth.uid()));

-- ===== updated_at triggers =====
CREATE TRIGGER t_profiles_u BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_categories_u BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_articles_u BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_companies_u BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_portfolio_u BEFORE UPDATE ON public.portfolio FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_testimonials_u BEFORE UPDATE ON public.testimonials FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_speaking_u BEFORE UPDATE ON public.speaking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_books_u BEFORE UPDATE ON public.books FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_resources_u BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER t_settings_u BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== SEED SETTINGS =====
INSERT INTO public.settings (key, value) VALUES
('hero', '{"eyebrow":"Founder of ONARU","statement":"Building companies that solve meaningful problems through creativity, systems and technology.","intro":"I am Yomi Onalaru — founder, creative director and systems thinker. ONARU is the holding company behind the ventures I build, acquire and scale."}'::jsonb),
('biography', '{"short":"Founder of ONARU. Building companies that solve real-world problems through creativity, technology, systems and media.","long":""}'::jsonb),
('social', '{"instagram":"https://instagram.com/yomionalaru","x":"https://x.com/yomionalaru","linkedin":"","youtube":""}'::jsonb),
('seo', '{"title":"Yomi Onalaru — Founder of ONARU","description":"Building companies that solve meaningful problems through creativity, systems and technology.","ogImage":""}'::jsonb),
('footer', '{"note":"Designed & built with intention.","newsletterHeading":"Ideas on building companies that last.","newsletterBody":"Occasional letters on systems, creativity and building in Africa."}'::jsonb),
('navigation', '{"links":[{"to":"/","label":"Home"},{"to":"/about","label":"Founder"},{"to":"/companies","label":"Ecosystem"},{"to":"/mentorship","label":"Mentorship"},{"to":"/blog","label":"Blog"},{"to":"/media","label":"Media"},{"to":"/contact","label":"Contact"}]}'::jsonb),
('theme', '{"gold":"#c9a227","background":"#0a0906"}'::jsonb),
('contact', '{"email":"yomionalaru@gmail.com","location":"Lagos, Nigeria"}'::jsonb);