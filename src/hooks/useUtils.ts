'use client'

import { useState, useEffect } from 'react'

interface GeolocationState {
    latitude: number | null
    longitude: number | null
    error: string | null
    isLoading: boolean
}

export function useGeolocation() {
    const [state, setState] = useState<GeolocationState>({
        latitude: null,
        longitude: null,
        error: null,
        isLoading: false,
    })

    const getLocation = () => {
        if (!navigator.geolocation) {
            setState((prev) => ({
                ...prev,
                error: 'La géolocalisation n\'est pas supportée par votre navigateur',
            }))
            return
        }

        setState((prev) => ({ ...prev, isLoading: true }))

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    error: null,
                    isLoading: false,
                })
            },
            (error) => {
                setState((prev) => ({
                    ...prev,
                    error: 'Impossible d\'obtenir votre localisation',
                    isLoading: false,
                }))
            },
            { timeout: 10000, enableHighAccuracy: false }
        )
    }

    return { ...state, getLocation }
}

export function useDebounce<T>(value: T, delay = 500): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value)

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedValue(value), delay)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') return initialValue
        try {
            const item = window.localStorage.getItem(key)
            return item ? JSON.parse(item) : initialValue
        } catch {
            return initialValue
        }
    })

    const setValue = (value: T | ((val: T) => T)) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value
            setStoredValue(valueToStore)
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(key, JSON.stringify(valueToStore))
            }
        } catch (error) {
            console.error(error)
        }
    }

    return [storedValue, setValue] as const
}
