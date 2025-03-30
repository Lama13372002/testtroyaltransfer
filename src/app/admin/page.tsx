'use client'

import { useState, useEffect } from 'react'
import { useSettings } from '@/lib/settings-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function AdminPage() {
  const { settings, updateSettings, loading, error } = useSettings()
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: '',
    workingHours: '',
    companyName: '',
    companyDesc: '',
    instagramLink: '',
    telegramLink: '',
    whatsappLink: ''
  })
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    // Загружаем данные из контекста настроек в локальное состояние формы
    if (settings) {
      setFormData({
        phone: settings.phone || '',
        email: settings.email || '',
        address: settings.address || '',
        workingHours: settings.workingHours || '',
        companyName: settings.companyName || '',
        companyDesc: settings.companyDesc || '',
        instagramLink: settings.instagramLink || '',
        telegramLink: settings.telegramLink || '',
        whatsappLink: settings.whatsappLink || ''
      })
    }
  }, [settings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Валидация обязательных полей
    if (!formData.phone.trim() || !formData.email.trim() || !formData.companyName.trim()) {
      toast.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    setIsUpdating(true)
    try {
      await updateSettings(formData)
      toast.success('Настройки успешно обновлены')
    } catch (err) {
      toast.error('Не удалось обновить настройки')
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
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Панель администратора</h1>
          <p className="text-gray-600">Управление настройками сайта</p>
        </div>

        <Tabs defaultValue="contact" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="contact">Контактная информация</TabsTrigger>
            <TabsTrigger value="company">О компании</TabsTrigger>
            <TabsTrigger value="social">Социальные сети</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Контактная информация</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Номер телефона *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+7 (000) 000-00-00"
                      className="w-full"
                      required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Телефон будет отображаться в футере на всех страницах сайта
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="info@example.com"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Адрес
                    </label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Ваш адрес"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="workingHours" className="block text-sm font-medium text-gray-700 mb-1">
                      Часы работы
                    </label>
                    <Input
                      id="workingHours"
                      name="workingHours"
                      type="text"
                      value={formData.workingHours}
                      onChange={handleChange}
                      placeholder="Пн-Вс: 9:00-18:00"
                      className="w-full"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="company">
              <Card>
                <CardHeader>
                  <CardTitle>Информация о компании</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                      Название компании *
                    </label>
                    <Input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Название компании"
                      className="w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyDesc" className="block text-sm font-medium text-gray-700 mb-1">
                      Описание компании
                    </label>
                    <Textarea
                      id="companyDesc"
                      name="companyDesc"
                      value={formData.companyDesc}
                      onChange={handleChange}
                      placeholder="Короткое описание компании"
                      className="w-full"
                      rows={4}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Это описание будет отображаться в футере сайта
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Социальные сети</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label htmlFor="instagramLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Ссылка на Instagram
                    </label>
                    <Input
                      id="instagramLink"
                      name="instagramLink"
                      type="url"
                      value={formData.instagramLink}
                      onChange={handleChange}
                      placeholder="https://instagram.com/your_account"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="telegramLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Ссылка на Telegram
                    </label>
                    <Input
                      id="telegramLink"
                      name="telegramLink"
                      type="url"
                      value={formData.telegramLink}
                      onChange={handleChange}
                      placeholder="https://t.me/your_account"
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="whatsappLink" className="block text-sm font-medium text-gray-700 mb-1">
                      Ссылка на WhatsApp
                    </label>
                    <Input
                      id="whatsappLink"
                      name="whatsappLink"
                      type="url"
                      value={formData.whatsappLink}
                      onChange={handleChange}
                      placeholder="https://wa.me/your_number"
                      className="w-full"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Например: https://wa.me/79001234567
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <div className="mt-6">
              {error && (
                <div className="p-3 rounded bg-red-50 text-red-700 text-sm mb-4">
                  {error}
                </div>
              )}
              <Button
                type="submit"
                disabled={isUpdating || loading}
                className="w-full"
              >
                {isUpdating ? 'Сохранение...' : 'Сохранить все настройки'}
              </Button>
            </div>
          </form>
        </Tabs>
      </div>
    </div>
  )
}
