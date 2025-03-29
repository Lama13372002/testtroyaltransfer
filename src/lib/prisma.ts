'use client'

// Эта реализация является заглушкой, заменяющей реальный PrismaClient для деплоя
// В реальном проекте здесь будет настоящий клиент Prisma

class PrismaClientMock {
  constructor() {
    console.log('Mock PrismaClient initialized')
  }
}

// Глобальная переменная для поддержки единственного экземпляра
declare global {
  // eslint-disable-next-line no-var
  var prisma: undefined | PrismaClientMock
}

const globalPrisma = globalThis.prisma

export const prisma = globalPrisma ?? new PrismaClientMock()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export const getPrismaClient = () => {
  return prisma
}
