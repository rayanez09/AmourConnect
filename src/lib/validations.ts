import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'Email requis')
        .email('Adresse email invalide'),
    password: z
        .string()
        .min(1, 'Mot de passe requis')
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
})

export const registerSchema = z
    .object({
        email: z
            .string()
            .min(1, 'Email requis')
            .email('Adresse email invalide'),
        password: z
            .string()
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
            .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
            .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
        confirmPassword: z.string().min(1, 'Confirmation requise'),
        acceptTerms: z
            .boolean()
            .refine((val) => val === true, "Vous devez accepter les conditions d'utilisation"),
        isAdult: z
            .boolean()
            .refine((val) => val === true, 'Vous devez avoir 18 ans ou plus'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    })

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email requis')
        .email('Adresse email invalide'),
})

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
            .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
            .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
        confirmPassword: z.string().min(1, 'Confirmation requise'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['confirmPassword'],
    })

// Profile schemas
export const profileSchema = z.object({
    full_name: z
        .string()
        .min(2, 'Le prénom doit contenir au moins 2 caractères')
        .max(50, '50 caractères maximum'),
    age: z
        .number({ error: 'Âge invalide' })
        .min(18, 'Vous devez avoir au moins 18 ans')
        .max(99, 'Âge invalide'),
    gender: z.enum(['homme', 'femme', 'autre'], { error: 'Genre requis' }),
    looking_for: z.enum(['homme', 'femme', 'les deux'], { error: 'Recherche requise' }),
    city: z
        .string()
        .min(2, 'Ville requise')
        .max(100, '100 caractères maximum'),
    postal_code: z
        .string()
        .min(5, 'Code postal invalide')
        .max(10, 'Code postal invalide')
        .optional()
        .or(z.literal('')),
    bio: z
        .string()
        .min(20, 'La description doit contenir au moins 20 caractères')
        .max(500, '500 caractères maximum'),
    visibility: z.enum(['public', 'limited', 'private']).optional().default('public'),
})

// Search filters schema
export const searchFiltersSchema = z.object({
    gender: z.enum(['homme', 'femme', 'autre']).optional(),
    min_age: z.number().min(18).max(99).optional(),
    max_age: z.number().min(18).max(99).optional(),
    city: z.string().optional(),
    radius_km: z.number().min(5).max(500).optional(),
})

// Message schema
export const messageSchema = z.object({
    content: z
        .string()
        .min(1, 'Message requis')
        .max(1000, '1000 caractères maximum'),
})

// Report schema
export const reportSchema = z.object({
    reason: z.enum([
        'spam',
        'fake_profile',
        'harassment',
        'inappropriate_content',
        'other',
    ], { error: 'Raison requise' }),
    description: z
        .string()
        .max(500, '500 caractères maximum')
        .optional(),
})

// Types inferred from schemas
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type SearchFiltersInput = z.infer<typeof searchFiltersSchema>
export type MessageInput = z.infer<typeof messageSchema>
export type ReportInput = z.infer<typeof reportSchema>
