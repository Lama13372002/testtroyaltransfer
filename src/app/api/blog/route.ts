import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

// Получение всех блог-постов (ВЕРСИЯ С ЛОГАМИ)
export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const slug = url.searchParams.get('slug')

  try {
    console.log('Получение данных блога...')
    
    // Если указан id или slug, возвращаем конкретный пост
    if (id) {
      console.log(`Запрос поста с id: ${id}`)
      const post = await prisma.blogPost.findUnique({
        where: { id: parseInt(id) }
      })
      
      if (!post) {
        console.log(`Пост с id ${id} не найден`)
        return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
      }
      
      return NextResponse.json({ post })
    } 
    
    if (slug) {
      console.log(`Запрос поста с slug: ${slug}`)
      const post = await prisma.blogPost.findUnique({
        where: { slug }
      })
      
      if (!post) {
        console.log(`Пост с slug ${slug} не найден`)
        return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
      }
      
      return NextResponse.json({ post })
    }

    // Иначе возвращаем все посты
    console.log('Запрос всех постов')
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' }
    })
    
    console.log(`Найдено постов: ${posts.length}`)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { error: 'Не удалось получить данные блога', details: error.message }, 
      { status: 500 }
    )
  }
}

// Создание нового блог-поста
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Проверка обязательных полей
    if (!body.title || !body.content || !body.excerpt) {
      return NextResponse.json(
        { error: 'Необходимо указать заголовок, контент и краткое описание' },
        { status: 400 }
      )
    }

    // Генерация slug из заголовка, если не указан
    if (!body.slug) {
      body.slug = slugify(body.title, { lower: true, strict: true })
    }

    // Проверка на уникальность slug
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug: body.slug }
    })

    if (existingPost) {
      return NextResponse.json(
        { error: 'Пост с таким slug уже существует. Используйте другой заголовок или укажите уникальный slug.' },
        { status: 400 }
      )
    }

    // Устанавливаем fallbackImage по умолчанию, если не указано
    if (!body.fallbackImage) {
      body.fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80'
    }

    // Создаем новый пост
    const post = await prisma.blogPost.create({
      data: body
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Не удалось создать пост' }, { status: 500 })
  }
}

// Обновление существующего блог-поста
export async function PUT(request: Request) {
  try {
    const body = await request.json()

    // Проверка наличия ID
    if (!body.id) {
      return NextResponse.json({ error: 'Необходимо указать ID поста' }, { status: 400 })
    }

    // Проверка существования поста с указанным ID
    const existingPost = await prisma.blogPost.findUnique({
      where: { id: body.id }
    })

    if (!existingPost) {
      return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
    }

    // Проверка slug на уникальность, если он изменен
    if (body.slug && body.slug !== existingPost.slug) {
      const duplicateSlug = await prisma.blogPost.findUnique({
        where: { slug: body.slug }
      })

      if (duplicateSlug) {
        return NextResponse.json(
          { error: 'Пост с таким slug уже существует' },
          { status: 400 }
        )
      }
    }

    // Обновляем пост
    const post = await prisma.blogPost.update({
      where: { id: body.id },
      data: body
    })

    return NextResponse.json({ post })
  } catch (error) {
    console.error('Error updating blog post:', error)
    return NextResponse.json({ error: 'Не удалось обновить пост' }, { status: 500 })
  }
}

// Удаление блог-поста
export async function DELETE(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Необходимо указать ID поста' }, { status: 400 })
  }

  try {
    // Проверка существования поста
    const post = await prisma.blogPost.findUnique({
      where: { id: parseInt(id) }
    })

    if (!post) {
      return NextResponse.json({ error: 'Пост не найден' }, { status: 404 })
    }

    // Удаляем пост
    await prisma.blogPost.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting blog post:', error)
    return NextResponse.json({ error: 'Не удалось удалить пост' }, { status: 500 })
  }
}
