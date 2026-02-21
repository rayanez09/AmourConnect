-- ============================================================
-- AMOURCONNECT - Schéma SQL Supabase complet
-- À exécuter dans l'éditeur SQL de Supabase
-- ============================================================

-- Extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- pour la recherche textuelle

-- ============================================================
-- TABLE: profiles
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  age INTEGER CHECK (age >= 18 AND age <= 120),
  gender TEXT CHECK (gender IN ('homme', 'femme', 'autre')),
  looking_for TEXT CHECK (looking_for IN ('homme', 'femme', 'les deux')),
  city TEXT,
  postal_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  bio TEXT CHECK (char_length(bio) <= 500),
  avatar_url TEXT,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'limited', 'private')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id)
);

-- Index for search performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_city ON public.profiles(city);
CREATE INDEX idx_profiles_age ON public.profiles(age);
CREATE INDEX idx_profiles_gender ON public.profiles(gender);
CREATE INDEX idx_profiles_is_active ON public.profiles(is_active);
CREATE INDEX idx_profiles_city_trgm ON public.profiles USING GIN (city gin_trgm_ops);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TABLE: likes
-- ============================================================
CREATE TABLE public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (sender_id, receiver_id),
  CHECK (sender_id != receiver_id)
);

CREATE INDEX idx_likes_sender ON public.likes(sender_id);
CREATE INDEX idx_likes_receiver ON public.likes(receiver_id);

-- ============================================================
-- TABLE: matches
-- ============================================================
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CHECK (user1_id != user2_id),
  UNIQUE (user1_id, user2_id)
);

CREATE INDEX idx_matches_user1 ON public.matches(user1_id);
CREATE INDEX idx_matches_user2 ON public.matches(user2_id);

-- Function to prevent duplicate matches (regardless of order)
CREATE OR REPLACE FUNCTION check_match_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.matches
    WHERE (user1_id = NEW.user2_id AND user2_id = NEW.user1_id)
  ) THEN
    RAISE EXCEPTION 'Match already exists';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_unique_match
  BEFORE INSERT ON public.matches
  FOR EACH ROW EXECUTE FUNCTION check_match_uniqueness();

-- ============================================================
-- TABLE: messages
-- ============================================================
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  type TEXT NOT NULL DEFAULT 'text' CHECK (type IN ('text', 'location')),
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_messages_match ON public.messages(match_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_messages_created ON public.messages(created_at DESC);

-- ============================================================
-- TABLE: subscriptions
-- ============================================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'inactive' CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due')),
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free', 'premium', 'premium_plus')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id)
);

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- TABLE: reports
-- ============================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL CHECK (reason IN ('spam', 'fake_profile', 'harassment', 'inappropriate_content', 'other')),
  description TEXT CHECK (char_length(description) <= 1000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  CHECK (reporter_id != reported_id)
);

CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_reported ON public.reports(reported_id);

-- ============================================================
-- TABLE: blocks
-- ============================================================
CREATE TABLE public.blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (blocker_id, blocked_id),
  CHECK (blocker_id != blocked_id)
);

-- ============================================================
-- FUNCTION: Distance GPS (Haversine)
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_distance_km(
  lat1 DOUBLE PRECISION,
  lon1 DOUBLE PRECISION,
  lat2 DOUBLE PRECISION,
  lon2 DOUBLE PRECISION
) RETURNS DOUBLE PRECISION AS $$
DECLARE
  R CONSTANT DOUBLE PRECISION := 6371;
  dlat DOUBLE PRECISION;
  dlon DOUBLE PRECISION;
  a DOUBLE PRECISION;
  c DOUBLE PRECISION;
BEGIN
  dlat := radians(lat2 - lat1);
  dlon := radians(lon2 - lon1);
  a := sin(dlat / 2) ^ 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ^ 2;
  c := 2 * atan2(sqrt(a), sqrt(1 - a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================================
-- FUNCTION: Auto-create profile on signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  INSERT INTO public.subscriptions (user_id, status, plan)
  VALUES (NEW.id, 'active', 'free')
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES: profiles
-- ============================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

-- Authenticated users can view active public/limited profiles
CREATE POLICY "Authenticated users can view active profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    is_active = true
    AND visibility IN ('public', 'limited')
    AND user_id != auth.uid()
  );

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile only
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: likes
-- ============================================================

-- Users can see likes they sent or received
CREATE POLICY "Users can view own likes"
  ON public.likes FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = sender_id AND p.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = receiver_id AND p.user_id = auth.uid())
  );

-- Users can send likes from their own profile
CREATE POLICY "Users can send likes"
  ON public.likes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = sender_id AND p.user_id = auth.uid())
  );

-- Users can remove likes they sent
CREATE POLICY "Users can delete own likes"
  ON public.likes FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = sender_id AND p.user_id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES: matches
-- ============================================================

-- Users can view matches they are part of
CREATE POLICY "Users can view own matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = user1_id AND p.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = user2_id AND p.user_id = auth.uid())
  );

-- System only creates matches (via service role in callbacks)
CREATE POLICY "Authenticated users can create matches"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = user1_id AND p.user_id = auth.uid())
    OR
    EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = user2_id AND p.user_id = auth.uid())
  );

-- ============================================================
-- RLS POLICIES: messages
-- ============================================================

-- Users can view messages in their matches only
CREATE POLICY "Users can view messages in own matches"
  ON public.messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.profiles p1 ON p1.id = m.user1_id
      JOIN public.profiles p2 ON p2.id = m.user2_id
      WHERE m.id = match_id
        AND (p1.user_id = auth.uid() OR p2.user_id = auth.uid())
    )
  );

-- Users can send messages in their matches
CREATE POLICY "Users can send messages in own matches"
  ON public.messages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.profiles p1 ON p1.id = m.user1_id
      JOIN public.profiles p2 ON p2.id = m.user2_id
      WHERE m.id = match_id
        AND (p1.user_id = auth.uid() OR p2.user_id = auth.uid())
    )
  );

-- Users can update (mark read) messages they received
CREATE POLICY "Users can mark messages as read"
  ON public.messages FOR UPDATE
  TO authenticated
  USING (
    auth.uid() != sender_id
    AND EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.profiles p1 ON p1.id = m.user1_id
      JOIN public.profiles p2 ON p2.id = m.user2_id
      WHERE m.id = match_id
        AND (p1.user_id = auth.uid() OR p2.user_id = auth.uid())
    )
  );

-- Users can delete only their own messages
CREATE POLICY "Users can delete own messages"
  ON public.messages FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id);

-- ============================================================
-- RLS POLICIES: subscriptions
-- ============================================================

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscription"
  ON public.subscriptions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription"
  ON public.subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================
-- RLS POLICIES: reports
-- ============================================================

CREATE POLICY "Users can create reports"
  ON public.reports FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Users can view own reports"
  ON public.reports FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id);

-- ============================================================
-- RLS POLICIES: blocks
-- ============================================================

CREATE POLICY "Users can manage own blocks"
  ON public.blocks FOR ALL
  TO authenticated
  USING (auth.uid() = blocker_id)
  WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can see if blocked"
  ON public.blocks FOR SELECT
  TO authenticated
  USING (auth.uid() = blocked_id);

-- ============================================================
-- STORAGE: Avatar bucket
-- ============================================================
-- À exécuter dans Supabase Storage > New bucket

-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'avatars',
--   'avatars',
--   true,
--   5242880, -- 5MB
--   ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
-- );

-- Storage RLS policies (à ajouter dans Storage > Policies):
-- Policy 1: Allow authenticated users to upload their own avatar
-- CREATE POLICY "Users can upload own avatar"
-- ON storage.objects FOR INSERT TO authenticated
-- WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy 2: Allow public read
-- CREATE POLICY "Public can read avatars"
-- ON storage.objects FOR SELECT TO public
-- USING (bucket_id = 'avatars');

-- Policy 3: Allow users to update/delete own avatar
-- CREATE POLICY "Users can update own avatar"
-- ON storage.objects FOR UPDATE TO authenticated
-- USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Policy 4: Allow users to delete own avatar
-- CREATE POLICY "Users can delete own avatar"
-- ON storage.objects FOR DELETE TO authenticated
-- USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- REALTIME: Enable for messages
-- ============================================================
-- À activer dans Supabase Table Editor > Realtime:
-- Activer Realtime sur la table 'messages'

ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- ============================================================
-- ADMIN VIEW (optionnel)
-- ============================================================
CREATE OR REPLACE VIEW public.admin_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles WHERE is_active = true) AS total_active_users,
  (SELECT COUNT(*) FROM public.profiles WHERE is_premium = true) AS premium_users,
  (SELECT COUNT(*) FROM public.matches) AS total_matches,
  (SELECT COUNT(*) FROM public.messages) AS total_messages,
  (SELECT COUNT(*) FROM public.profiles WHERE created_at >= now() - interval '24 hours') AS new_users_today,
  (SELECT COUNT(*) FROM public.reports WHERE status = 'pending') AS pending_reports;
