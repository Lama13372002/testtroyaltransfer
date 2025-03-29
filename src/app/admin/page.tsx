'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/lib/settings-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'

export default function AdminPage() {
  const { phone, updatePhone, loading, error } = useSettings()
  const [phoneInput, setPhoneInput] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (phone) {
      setPhoneInput(phone)
    }
  }, [phone])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!phoneInput.trim()) {
      toast.error('Введите номер телефона')
      return
    }

    setIsUpdating(true)
    try {
      await updatePhone(phoneInput)
      toast.success('Телефон успешно обновлен')
    } catch (err) {
      toast.error('Не удалось обновить телефон')
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-gray-600">Управление настройками сайта</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Изменение номера телефона</CardTitle>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Номер телефона
                  </label>
                  <Input
                    id="phone"
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+7 (000) 000-00-00"
                    className="w-full"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Телефон будет отображаться в футере на всех страницах сайта
                  </p>
                </div>

                {error && (
                  <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isUpdating || loading}
                className="w-full"
              >
                {isUpdating ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
