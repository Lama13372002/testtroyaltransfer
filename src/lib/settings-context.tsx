'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type SettingsContextType = {
  phone: string
  updatePhone: (newPhone: string) => Promise<void>
  loading: boolean
  error: string | null
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState("+7 (900) 000-00-00")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Загружаем настройки при первой загрузке
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()

        if (data.settings) {
          setPhone(data.settings.phone)
        }
      } catch (err) {
        console.error('Ошибка при загрузке настроек:', err)
        setError('Не удалось загрузить настройки')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  const updatePhone = async (newPhone: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: newPhone }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Не удалось обновить телефон')
      }

      setPhone(data.settings.phone)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка'
      setError(errorMessage)
      console.error('Ошибка при обновлении телефона:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SettingsContext.Provider value={{ phone, updatePhone, loading, error }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings должен использоваться внутри SettingsProvider')
  }
  return context
}
