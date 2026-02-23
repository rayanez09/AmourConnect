/**
 * Ecoute et Orientation - Script de seed
 * Génère 50 profils fictifs dans Supabase
 *
 * Usage:
 *   1. npm install @supabase/supabase-js
 *   2. Configurez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY
 *   3. node supabase/seed.js
 *
 * Note: Utilise la service role key pour bypasser RLS
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
})

const FRENCH_CITIES = [
    { city: 'Paris', postal: '75001', lat: 48.8566, lon: 2.3522 },
    { city: 'Lyon', postal: '69001', lat: 45.7640, lon: 4.8357 },
    { city: 'Marseille', postal: '13001', lat: 43.2965, lon: 5.3698 },
    { city: 'Toulouse', postal: '31000', lat: 43.6047, lon: 1.4442 },
    { city: 'Nice', postal: '06000', lat: 43.7102, lon: 7.2620 },
    { city: 'Bordeaux', postal: '33000', lat: 44.8378, lon: -0.5792 },
    { city: 'Nantes', postal: '44000', lat: 47.2184, lon: -1.5536 },
    { city: 'Strasbourg', postal: '67000', lat: 48.5734, lon: 7.7521 },
    { city: 'Montpellier', postal: '34000', lat: 43.6110, lon: 3.8767 },
    { city: 'Rennes', postal: '35000', lat: 48.1173, lon: -1.6778 },
    { city: 'Lille', postal: '59000', lat: 50.6292, lon: 3.0573 },
    { city: 'Grenoble', postal: '38000', lat: 45.1885, lon: 5.7245 },
    { city: 'Dijon', postal: '21000', lat: 47.3220, lon: 5.0415 },
    { city: 'Angers', postal: '49000', lat: 47.4784, lon: -0.5632 },
    { city: 'Tours', postal: '37000', lat: 47.3941, lon: 0.6848 },
]

const MALE_NAMES = [
    'Thomas', 'Nicolas', 'Alexandre', 'Julien', 'Antoine',
    'Maxime', 'Guillaume', 'Romain', 'Sébastien', 'Adrien',
    'Pierre', 'Lucas', 'Hugo', 'Clément', 'Baptiste',
    'Mathieu', 'Arnaud', 'François', 'Benoît', 'Quentin',
    'Victor', 'Arthur', 'Théo', 'Raphaël', 'Louis',
]

const FEMALE_NAMES = [
    'Marie', 'Sophie', 'Camille', 'Laura', 'Emma',
    'Julie', 'Sarah', 'Léa', 'Manon', 'Chloé',
    'Alice', 'Lucie', 'Clara', 'Inès', 'Mathilde',
    'Pauline', 'Amélie', 'Charlotte', 'Anaïs', 'Élodie',
    'Marine', 'Aurélie', 'Céline', 'Caroline', 'Océane',
]

const MALE_BIOS = [
    "Passionné de photographie et de randonnée, je cherche une partenaire sincère pour partager de belles aventures. J'aime la cuisine et les soirées cinéma.",
    "Entrepreneur dans l'âme, curieux et attentionné. Je cherche quelqu'un d'authentique pour construire quelque chose de beau ensemble.",
    "Grand voyageur, j'ai parcouru 30 pays mais c'est ici que je cherche à poser mes valises. Amateur de vin et de bonne cuisine.",
    "Professeur passionné par la littérature et la musique. Je cherche une âme sensible et créative pour partager ma vision du monde.",
    "Sportif et amoureux de la nature. week-ends en montagne ou sur le vélo. Je recherche une relation solide et sincère.",
    "Amateur de jazz et de peinture, l'art est au cœur de ma vie. Je cherche quelqu'un qui aime les belles choses et les conversations profondes.",
    "Cuisinier passionné, je passe mes soirées à expérimenter de nouvelles recettes. Je cherche quelqu'un pour partager ces moments gourmands.",
    "Ingénieur le jour, musicien le soir. La guitare est ma passion. Je cherche une relation authentique et durable.",
    "Fan de série documentaires et de podcasts. Toujours en train d'apprendre quelque chose de nouveau. Cherche la femme avec qui évoluer.",
    "Médecin humaniste, je reviens d'une mission ONG. Je cherche une femme forte et indépendante pour une relation épanouissante.",
]

const FEMALE_BIOS = [
    "Designer graphique éprise de voyages et de décoration. Je cherche un homme attentionné pour partager ma passion pour la beauté du monde.",
    "Kinésithérapeute passionnée de yoga et de bien-être. Je cherche quelqu'un de sincère, drôle et qui aime la vie.",
    "Enseignante curieuse et passionnée de littérature. J'adore les musées, les débats et les balades en forêt. À la recherche d'une belle rencontre.",
    "Entrepreneur dans la mode éco-responsable. Je cherche un homme qui partage mes valeurs et mon amour pour la planète.",
    "Passionnée de cuisine du monde et de voyages culturels. Je cherche quelqu'un pour partir à l'aventure et créer de beaux souvenirs.",
    "Infirmière en cardiologie, j'aime mon métier autant que ma vie perso. Cherche un homme sincère pour une relation solide.",
    "Artiste peintre, j'expose régulièrement dans des galeries. Je cherche un accompagnateur de vie sensible et créatif.",
    "Amoureuse des chats, du café et des romans policiers. Je cherche quelqu'un de chaleureux pour partager ma vie tranquille mais enrichissante.",
    "Avocate passionnée par la justice sociale. Cherche un homme curieux, engagé et avec qui avoir de vraies conversations.",
    "Chef de projet, organisée mais spontanée. J'aime les concerts, les expositions et les escapades de dernière minute.",
]

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateAvatarUrl(name, gender, index) {
    // Using UI Avatars as fallback (no real images needed for seed)
    const bg = gender === 'homme' ? '1e40af' : 'be185d'
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=300&background=${bg}&color=fff&bold=true&length=2`
}

async function seed() {
    console.log('🌱 Starting seed...\n')

    let created = 0
    const errors = []

    // Create 25 male profiles + 25 female profiles
    for (let i = 0; i < 50; i++) {
        const gender = i < 25 ? 'homme' : 'femme'
        const names = gender === 'homme' ? MALE_NAMES : FEMALE_NAMES
        const bios = gender === 'homme' ? MALE_BIOS : FEMALE_BIOS
        const lookingFor = gender === 'homme'
            ? pickRandom(['femme', 'les deux'])
            : pickRandom(['homme', 'les deux'])

        const firstName = names[i % names.length]
        const lastName = pickRandom(['Martin', 'Bernard', 'Thomas', 'Petit', 'Robert', 'Richard', 'Durand', 'Leclerc'])
        const fullName = `${firstName} ${lastName.charAt(0)}.`
        const age = randomInt(22, 52)
        const location = pickRandom(FRENCH_CITIES)
        const bio = bios[i % bios.length]
        const email = `seed_user_${i + 1}_${Date.now()}@ecoute-et-orientation-seed.dev`
        const password = 'SeedPassword123!'

        try {
            // Create auth user
            const { data: authData, error: authError } = await supabase.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: { full_name: fullName },
            })

            if (authError) {
                errors.push(`User ${i + 1}: ${authError.message}`)
                continue
            }

            const userId = authData.user.id

            // Create/update profile
            const { error: profileError } = await supabase.from('profiles').update({
                full_name: fullName,
                age,
                gender,
                looking_for: lookingFor,
                city: location.city,
                postal_code: location.postal,
                latitude: location.lat + (Math.random() - 0.5) * 0.2,
                longitude: location.lon + (Math.random() - 0.5) * 0.2,
                bio,
                avatar_url: generateAvatarUrl(firstName, gender, i),
                is_active: true,
                is_premium: Math.random() < 0.15, // 15% premium
                is_verified: Math.random() < 0.3,
                visibility: 'public',
            }).eq('user_id', userId)

            if (profileError) {
                errors.push(`Profile ${i + 1}: ${profileError.message}`)
                continue
            }

            created++
            process.stdout.write(`✅ Created: ${fullName} (${age}y, ${location.city})\n`)
        } catch (err) {
            errors.push(`Error at user ${i + 1}: ${err.message}`)
        }

        // Small delay to avoid rate limiting
        await new Promise((r) => setTimeout(r, 200))
    }

    console.log(`\n✨ Seed complete!`)
    console.log(`   ✅ ${created}/50 profiles created`)

    if (errors.length > 0) {
        console.log(`\n⚠️  Errors (${errors.length}):`)
        errors.forEach((e) => console.log(`   - ${e}`))
    }

    console.log('\n📌 Login credentials for test users:')
    console.log('   Email: seed_user_1_[timestamp]@ecoute-et-orientation-seed.dev')
    console.log('   Password: SeedPassword123!')
    console.log('\n💡 Check your Supabase dashboard > Authentication > Users to see all created accounts.')
}

seed().catch(console.error)
