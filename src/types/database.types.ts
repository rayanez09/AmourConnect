export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
            likes: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
            matches: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
            messages: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
            subscriptions: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
            reports: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
            blocks: {
                Row: { id: string;[key: string]: any }
                Insert: { id?: string;[key: string]: any }
                Update: { id?: string;[key: string]: any }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
