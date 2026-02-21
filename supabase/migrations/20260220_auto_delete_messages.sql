-- ============================================================
-- Suppression automatique des messages de plus de 24h
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- 1. Activer l'extension pg_cron (si pas déjà activée)
--    -> Aller dans Database > Extensions dans le dashboard Supabase
--    -> Activer "pg_cron"

-- 2. Créer le job planifié (toutes les heures)
select cron.schedule(
  'delete-expired-messages',   -- nom unique du job
  '0 * * * *',                  -- cron: toutes les heures pile
  $$
    delete from public.messages
    where created_at < now() - interval '24 hours';
  $$
);

-- ============================================================
-- Pour vérifier que le job est bien enregistré :
-- SELECT * FROM cron.job WHERE jobname = 'delete-expired-messages';

-- Pour lancer manuellement (test) :
-- SELECT cron.run_job('delete-expired-messages');

-- Pour supprimer le job si besoin :
-- SELECT cron.unschedule('delete-expired-messages');
-- ============================================================

-- 3. (Optionnel) Supression immédiate des messages déjà existants > 24h
delete from public.messages
where created_at < now() - interval '24 hours';
