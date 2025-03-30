'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  ChevronLeft, Plus, Pencil, Trash2, Clock, Calendar, Eye, EyeOff
} from 'lucide-react'
import {
  getBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost, type BlogPost
} from '@/lib/blog-service'
import slugify from 'slugify'

export default function AdminBlogPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null)

  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    fallbackImage: '',
    readTime: '5 мин',
    isPublished: true
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  async function loadPosts() {
    try {
      setLoading(true)
      const data = await getBlogPosts()
      setPosts(data)
    } catch (err) {
      console.error('Ошибка при загрузке постов:', err)
      toast.error('Не удалось загрузить статьи блога')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setFormData({
      id: 0,
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      fallbackImage: '',
      readTime: '5 мин',
      isPublished: true
    })
    setCurrentPost(null)
  }

  function openCreateDialog() {
    resetForm()
    setIsCreating(true)
  }

  function openEditDialog(post: BlogPost) {
    setCurrentPost(post)
    setFormData({
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      fallbackImage: post.fallbackImage,
      readTime: post.readTime,
      isPublished: post.isPublished
    })
    setIsEditing(true)
  }

  function openDeleteDialog(post: BlogPost) {
    setCurrentPost(post)
    setIsDeleting(true)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target

    // Если изменяется заголовок, автоматически генерируем slug
    if (name === 'title' && !formData.slug) {
      const generatedSlug = slugify(value, { lower: true, strict: true })
      setFormData(prev => ({ ...prev, [name]: value, slug: generatedSlug }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isPublished: checked }))
  }

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      // Создаем новый пост
      const result = await createBlogPost({
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        fallbackImage: formData.fallbackImage || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
        readTime: formData.readTime,
        isPublished: formData.isPublished
      })

      if (result) {
        // Обновляем список постов
        setPosts(prev => [result, ...prev])
        setIsCreating(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error creating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      setIsSubmitting(true)

      // Обновляем существующий пост
      const result = await updateBlogPost({
        id: formData.id,
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        excerpt: formData.excerpt,
        fallbackImage: formData.fallbackImage,
        readTime: formData.readTime,
        isPublished: formData.isPublished
      })

      if (result) {
        // Обновляем список постов
        setPosts(prev => prev.map(post => post.id === result.id ? result : post))
        setIsEditing(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error updating post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!currentPost) return

    try {
      setIsSubmitting(true)

      const success = await deleteBlogPost(currentPost.id)

      if (success) {
        // Удаляем пост из списка
        setPosts(prev => prev.filter(post => post.id !== currentPost.id))
        setIsDeleting(false)
        resetForm()
      }
    } catch (error) {
      console.error('Error deleting post:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const validateForm = () => {
    // Проверка обязательных полей
    if (!formData.title.trim()) {
      toast.error('Заголовок статьи обязателен')
      return false
    }

    if (!formData.slug.trim()) {
      toast.error('URL статьи обязателен')
      return false
    }

    if (!formData.content.trim()) {
      toast.error('Контент статьи обязателен')
      return false
    }

    if (!formData.excerpt.trim()) {
      toast.error('Краткое описание статьи обязательно')
      return false
    }

    return true
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link href="/admin">
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Управление блогом</h1>
        </div>
        <Button onClick={openCreateDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Новая статья
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <p className="text-gray-500 mb-4">Пока нет опубликованных статей</p>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Создать первую статью
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {posts.map(post => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div
                    className="w-full md:w-48 h-40 bg-cover bg-center rounded-md shrink-0"
                    style={{ backgroundImage: `url(${post.fallbackImage})` }}
                  ></div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {post.isPublished ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      )}
                      <span className={`text-sm ${post.isPublished ? 'text-green-500' : 'text-gray-500'}`}>
                        {post.isPublished ? 'Опубликовано' : 'Черновик'}
                      </span>
                    </div>

                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(post.publishedAt)}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                        <Pencil className="h-4 w-4 mr-1" />
                        Редактировать
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openDeleteDialog(post)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Диалог создания статьи */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создание новой статьи</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Заголовок*
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Введите заголовок статьи"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  URL*
                </Label>
                <div className="col-span-3">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="url-statyi"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Используется в адресе статьи. Только латинские буквы, цифры и дефисы.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="excerpt" className="text-right">
                  Краткое описание*
                </Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Краткое описание статьи для списка"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="content" className="text-right pt-2">
                  Содержание*
                </Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="col-span-3 min-h-[200px]"
                  placeholder="Полное содержание статьи (поддерживается HTML)"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fallbackImage" className="text-right">
                  URL изображения
                </Label>
                <Input
                  id="fallbackImage"
                  name="fallbackImage"
                  value={formData.fallbackImage}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="readTime" className="text-right">
                  Время чтения
                </Label>
                <Input
                  id="readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="5 мин"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isPublished" className="text-right">
                  Опубликовать
                </Label>
                <div className="flex items-center gap-2 col-span-3">
                  <Switch
                    id="isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={handleSwitchChange}
                  />
                  <span className="text-sm text-gray-500">
                    {formData.isPublished ? 'Статья будет доступна на сайте' : 'Черновик (не будет отображаться на сайте)'}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreating(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Создать статью'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования статьи */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактирование статьи</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-title" className="text-right">
                  Заголовок*
                </Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Введите заголовок статьи"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-slug" className="text-right">
                  URL*
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edit-slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    placeholder="url-statyi"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Изменение URL может привести к потере ссылок. Будьте осторожны!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-excerpt" className="text-right">
                  Краткое описание*
                </Label>
                <Textarea
                  id="edit-excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="Краткое описание статьи для списка"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-content" className="text-right pt-2">
                  Содержание*
                </Label>
                <Textarea
                  id="edit-content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="col-span-3 min-h-[200px]"
                  placeholder="Полное содержание статьи (поддерживается HTML)"
                  required
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-fallbackImage" className="text-right">
                  URL изображения
                </Label>
                <Input
                  id="edit-fallbackImage"
                  name="fallbackImage"
                  value={formData.fallbackImage}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-readTime" className="text-right">
                  Время чтения
                </Label>
                <Input
                  id="edit-readTime"
                  name="readTime"
                  value={formData.readTime}
                  onChange={handleChange}
                  className="col-span-3"
                  placeholder="5 мин"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-isPublished" className="text-right">
                  Опубликовать
                </Label>
                <div className="flex items-center gap-2 col-span-3">
                  <Switch
                    id="edit-isPublished"
                    checked={formData.isPublished}
                    onCheckedChange={handleSwitchChange}
                  />
                  <span className="text-sm text-gray-500">
                    {formData.isPublished ? 'Статья будет доступна на сайте' : 'Черновик (не будет отображаться на сайте)'}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                Отмена
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Диалог подтверждения удаления */}
      <Dialog open={isDeleting} onOpenChange={setIsDeleting}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Удаление статьи</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="mb-2">Вы действительно хотите удалить статью:</p>
            <p className="font-semibold">{currentPost?.title}</p>
            <p className="mt-4 text-red-500 text-sm">
              Это действие нельзя отменить. Статья будет безвозвратно удалена из базы данных.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleting(false)}
              disabled={isSubmitting}
            >
              Отмена
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
