'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Clock } from 'lucide-react'
import { getBlogPosts, BlogPost } from '@/lib/blog-service'

export default function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      try {
        setLoading(true)
        const data = await getBlogPosts()
        // Ограничиваем количество отображаемых постов до 3
        setPosts(data.slice(0, 3))
      } catch (err) {
        console.error('Ошибка при загрузке постов:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPosts()
  }, [])

  return (
    <section id="blog" className="py-20 bg-gray-50 dark:bg-gray-800/50">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-underline inline-block">
            Наш блог
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Полезная информация для тех, кто планирует путешествие
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center p-10 text-gray-500">
            <p>Пока нет опубликованных статей</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full blog-card overflow-hidden">
                  <div
                    className="h-56 bg-cover bg-center"
                    style={{ backgroundImage: `url(${post.fallbackImage})` }}
                  >
                    <div className="w-full h-full flex items-end blog-overlay">
                      <div className="text-white p-4">
                        <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-12">
          <Link href="/blog">
            <Button
              className="group"
            >
              <span>Все статьи</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
