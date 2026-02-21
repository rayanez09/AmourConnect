# AmourConnect 💕

Plateforme de rencontres sérieuses professionnelle construite avec Next.js 15, Supabase et TailwindCSS.

## Stack Technique

- **Frontend**: Next.js 15 (App Router) + TypeScript
- **Styling**: TailwindCSS v4
- **Backend/BDD**: Supabase (Auth, PostgreSQL, Storage, Realtime)
- **State Management**: Zustand
- **Formulaires**: React Hook Form + Zod
- **Hébergement**: Vercel

## Structure du Projet

```
src/
├── app/
│   ├── (app)/                    # Pages protégées (authentifiées)
│   │   ├── layout.tsx            # Layout avec navbar
│   │   ├── dashboard/            # Tableau de bord
│   │   ├── search/               # Recherche de profils
│   │   ├── matches/              # Mes matchs
│   │   ├── messages/[matchId]/   # Messagerie temps réel
│   │   ├── profile/              # Profil utilisateur
│   │   │   ├── edit/             # Modification de profil
│   │   │   └── [id]/             # Vue profil public
│   │   ├── premium/              # Page premium
│   │   └── settings/             # Paramètres
│   ├── auth/                     # Pages d'authentification
│   │   ├── login/
│   │   ├── register/
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── callback/             # Route OAuth Supabase
│   ├── admin/                    # Administration
│   ├── legal/                    # Pages légales
│   │   ├── privacy/
│   │   ├── terms/
│   │   └── cookies/
│   ├── profile/setup/            # Première configuration profil
│   └── page.tsx                  # Landing page publique
├── components/
│   ├── ui/                       # Composants UI génériques
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Skeleton.tsx
│   │   └── Toast.tsx
│   ├── layout/
│   │   └── AppNavbar.tsx         # Sidebar + nav mobile
│   ├── profile/
│   │   └── ProfileCard.tsx
│   └── moderation/
│       └── ReportModal.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useRealtimeMessages.ts
│   └── useUtils.ts
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Client navigateur
│   │   ├── server.ts             # Client serveur
│   │   └── middleware.ts         # Middleware sessions
│   ├── utils.ts
│   └── validations.ts            # Schémas Zod
├── services/
│   ├── profiles.ts
│   ├── likes.ts
│   ├── messages.ts
│   └── moderation.ts
├── store/
│   └── index.ts                  # Store Zustand
├── types/
│   ├── database.types.ts         # Types Supabase
│   └── index.ts                  # Types applicatifs
└── middleware.ts                 # Protection des routes
```

## Installation

### 1. Cloner le projet et installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Copiez `.env.example` en `.env.local`
3. Remplissez vos clés Supabase

```bash
cp .env.example .env.local
```

### 3. Créer la base de données

Exécutez le fichier `supabase/schema.sql` dans **Supabase > SQL Editor**.

### 4. Configurer le Storage

Dans **Supabase > Storage**:
1. Créez un bucket `avatars`
2. Activez l'accès public
3. Ajoutez les policies Storage (commentées dans `schema.sql`)

### 5. Activer Realtime

Dans **Supabase > Table Editor > messages**:
- Activez Realtime sur la table `messages`

### 6. Lancer en développement

```bash
npm run dev
```

### 7. (Optionnel) Générer des données de test

```bash
node supabase/seed.js
```

## Déploiement sur Vercel

1. Poussez votre code sur GitHub
2. Importez le projet sur [vercel.com](https://vercel.com)
3. Ajoutez vos variables d'environnement dans Vercel Dashboard
4. Déployez !

## Configuration Email (Supabase)

Dans Supabase > Auth > Email Templates, configurez:
- **Confirmation email**: Redirect URL → `https://votre-domaine.com/auth/callback`
- **Password Reset**: Redirect URL → `https://votre-domaine.com/auth/reset-password`

## Générer les types TypeScript (recommandé)

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

Cela résoudra les warnings TypeScript dans les Server Components.

## Fonctionnalités

### Authentification
- ✅ Inscription / Connexion par email
- ✅ Vérification email obligatoire
- ✅ Récupération de mot de passe
- ✅ Protection des routes par middleware
- ✅ Sessions sécurisées via Supabase SSR

### Profils
- ✅ Wizard de création en 4 étapes
- ✅ Upload photo avec compression automatique
- ✅ Paramètres de visibilité
- ✅ Badges Premium et Vérifié

### Recherche & Matching
- ✅ Filtres par genre, âge, ville
- ✅ Système de likes avec détection de match mutuel
- ✅ Suggestions basées sur la localisation
- ✅ Pagination infinie

### Messagerie
- ✅ Messagerie temps réel (Supabase Realtime)
- ✅ Uniquement entre matchs
- ✅ Accusés de lecture
- ✅ Compteur de messages non lus

### Abonnements
- ✅ Plan gratuit / Premium
- ✅ Voir qui vous a liké (Premium)
- ✅ Structure prête pour Stripe

### Modération
- ✅ Signalement d'utilisateurs
- ✅ Blocage d'utilisateurs
- ✅ RLS strict côté base de données

### Sécurité
- ✅ Row Level Security sur toutes les tables
- ✅ Validation côté client (Zod) et serveur
- ✅ Middleware de protection des routes
- ✅ Protection XSS (React)
- ✅ Données conformes RGPD

## Évolutions Futures

- [ ] Application mobile (React Native / Expo)
- [ ] Intégration Stripe complète
- [ ] Algorithme de matching avancé
- [ ] Vérification d'identité
- [ ] Notifications push
- [ ] Mode incognito

## Licence

Propriétaire — Tous droits réservés
