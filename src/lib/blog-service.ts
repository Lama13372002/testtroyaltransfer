import { toast } from 'sonner'

export type BlogPost = {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string
  image?: string | null
  fallbackImage: string
  publishedAt: string
  readTime: string
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export type CreateBlogPostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: number
  publishedAt?: string
}

// Получение всех блог-постов
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetch('/api/blog')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Не удалось получить список постов')
    }

    return data.posts || []
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    toast.error('Ошибка при загрузке статей блога')
    return []
  }
}

// Получение блог-поста по ID
export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog?id=${id}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Не удалось получить пост')
    }

    return data.post || null
  } catch (error) {
    console.error(`Error fetching blog post with id ${id}:`, error)
    toast.error('Ошибка при загрузке статьи блога')
    return null
  }
}

// Получение блог-поста по slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog?slug=${slug}`)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Не удалось получить пост')
    }

    return data.post || null
  } catch (error) {
    console.error(`Error fetching blog post with slug ${slug}:`, error)
    toast.error('Ошибка при загрузке статьи блога')
    return null
  }
}

// Создание нового блог-поста
export async function createBlogPost(post: CreateBlogPostInput): Promise<BlogPost | null> {
  try {
    const response = await fetch('/api/blog', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Не удалось создать пост')
    }

    toast.success('Статья успешно создана')
    return data.post
  } catch (error) {
    console.error('Error creating blog post:', error)
    toast.error(error instanceof Error ? error.message : 'Ошибка при создании статьи')
    return null
  }
}

// Обновление существующего блог-поста
export async function updateBlogPost(post: Partial<BlogPost> & { id: number }): Promise<BlogPost | null> {
  try {
    const response = await fetch('/api/blog', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Не удалось обновить пост')
    }

    toast.success('Статья успешно обновлена')
    return data.post
  } catch (error) {
    console.error('Error updating blog post:', error)
    toast.error(error instanceof Error ? error.message : 'Ошибка при обновлении статьи')
    return null
  }
}

// Удаление блог-поста
export async function deleteBlogPost(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/blog?id=${id}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Не удалось удалить пост')
    }

    toast.success('Статья успешно удалена')
    return true
  } catch (error) {
    console.error(`Error deleting blog post with id ${id}:`, error)
    toast.error(error instanceof Error ? error.message : 'Ошибка при удалении статьи')
    return false
  }
}
