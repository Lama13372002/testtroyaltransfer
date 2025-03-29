import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Получение настроек сайта
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst({
      where: { id: 1 }
    })

    // Если настроек нет, создаем со значениями по умолчанию
    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: { id: 1, phone: "+7 (900) 000-00-00" }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Не удалось получить настройки' }, { status: 500 })
  }
}

// Обновление настроек сайта
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { phone } = body

    if (!phone) {
      return NextResponse.json({ error: 'Телефон обязателен' }, { status: 400 })
    }

    // Проверяем, существуют ли настройки
    let settings = await prisma.siteSettings.findFirst({
      where: { id: 1 }
    })

    if (settings) {
      // Обновляем существующие настройки
      settings = await prisma.siteSettings.update({
        where: { id: 1 },
        data: { phone }
      })
    } else {
      // Создаем новые настройки
      settings = await prisma.siteSettings.create({
        data: { id: 1, phone }
      })
    }

    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Не удалось обновить настройки' }, { status: 500 })
  }
}
