import { useState } from 'react'

const LOCAL_CACHE_KEYS = {
    CHECKED_PRODUCTS: 'checked_products',
    CHECKED_EXERCISES: 'checked_exercises',
} as const

const useCache = <T>(key: keyof typeof LOCAL_CACHE_KEYS, defaultValue?: T): [data: T, handleSetData: (data: T) => void] => {
    const DEFAULT_VALUE = defaultValue || [] as unknown as T

    const [data, setData] = useState<T>(JSON.parse(sessionStorage.getItem(LOCAL_CACHE_KEYS[key]) || JSON.stringify(DEFAULT_VALUE)))

    const handleSetData = (data: T) => {
        setData(data)
        sessionStorage.setItem(LOCAL_CACHE_KEYS[key], JSON.stringify(data))
    }
    
    return [data, handleSetData]
}

export default useCache
