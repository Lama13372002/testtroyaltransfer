'use client'

import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa'
import { useSettings } from '@/lib/settings-context'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { phone } = useSettings()

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="animate-fade-in">
            <div className="flex items-center mb-4">
              <MapPin className="w-6 h-6 mr-2 text-primary" />
              <h3 className="text-xl font-bold">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
                  Royal<span className="text-primary">Transfer</span>
                </span>
              </h3>
            </div>
            <p className="text-gray-400 mb-4">
              Комфортные трансферы из Калининграда в города Европы. Безопасность, комфорт и пунктуальность.
            </p>
            <div className="flex space-x-4 mt-6">
              <a
                href="#"
                className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors"
                aria-label="Telegram"
              >
                <FaTelegram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-green-500 hover:bg-green-600 p-2 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in delay-100">
            <h3 className="text-lg font-semibold mb-4 heading-underline">Навигация</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors">Главная</Link>
              </li>
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">Маршруты</Link>
              </li>
              <li>
                <Link href="/#vehicles" className="text-gray-400 hover:text-primary transition-colors">Автомобили</Link>
              </li>
              <li>
                <Link href="/#benefits" className="text-gray-400 hover:text-primary transition-colors">Преимущества</Link>
              </li>
              <li>
                <Link href="/#reviews" className="text-gray-400 hover:text-primary transition-colors">Отзывы</Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors">Блог</Link>
              </li>
              <li>
                <Link href="/#contacts" className="text-gray-400 hover:text-primary transition-colors">Контакты</Link>
              </li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div className="animate-fade-in delay-200">
            <h3 className="text-lg font-semibold mb-4 heading-underline">Популярные маршруты</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">
                  Калининград – Гданьск
                </Link>
              </li>
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">
                  Калининград – Варшава
                </Link>
              </li>
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">
                  Калининград – Берлин
                </Link>
              </li>
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">
                  Калининград – Вильнюс
                </Link>
              </li>
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">
                  Калининград – Каунас
                </Link>
              </li>
              <li>
                <Link href="/#routes" className="text-gray-400 hover:text-primary transition-colors">
                  Калининград – Рига
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in delay-300">
            <h3 className="text-lg font-semibold mb-4 heading-underline">Контакты</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mr-3 mt-0.5" />
                <span className="text-gray-400">г. Калининград, ул. Примерная, д. 123</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 text-primary mr-3" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="text-gray-400 hover:text-primary transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 text-primary mr-3" />
                <a href="mailto:info@royaltransfer.ru" className="text-gray-400 hover:text-primary transition-colors">
                  info@royaltransfer.ru
                </a>
              </li>
              <li className="flex items-start">
                <Clock className="w-5 h-5 text-primary mr-3 mt-0.5" />
                <span className="text-gray-400">Пн-Вс: 24/7<br />Работаем без выходных</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} RoyalTransfer. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  )
}
