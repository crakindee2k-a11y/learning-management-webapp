import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import authRouter from './router/auth.router.js'
import courseRouter from './router/course.router.js'
import instructorRouter from './router/instructor.router.js'
import learnerRouter from './router/learner.router.js'
import adminRouter from './router/admin.router.js'
import bankRouter from './router/bank.router.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const normalizeOrigin = (value = '') => {
  const trimmed = value.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed.replace(/\/+$/, '')
  }

  return `https://${trimmed.replace(/\/+$/, '')}`
}

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean)

const railwayOrigins = [process.env.RAILWAY_STATIC_URL, process.env.RAILWAY_PUBLIC_DOMAIN]
  .map((origin) => normalizeOrigin(origin || ''))
  .filter(Boolean)

const allowedOrigins = Array.from(new Set([
  ...configuredOrigins,
  ...railwayOrigins,
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
]))

const backendPublicPath = path.join(__dirname, 'public')
const frontendDistPath = path.resolve(__dirname, '../frontend/dist')
const frontendIndexPath = path.join(frontendDistPath, 'index.html')
const canServeFrontend = process.env.NODE_ENV === 'production' && fs.existsSync(frontendIndexPath)

const isAllowedOrigin = (origin) => {
  if (!origin) return true
  if (allowedOrigins.includes(origin)) return true

  if (process.env.NODE_ENV !== 'production') {
    return origin.includes('localhost') || origin.includes('127.0.0.1')
  }

  return false
}

process.on('unhandledRejection', console.error)
process.on('uncaughtException', console.error)

app.use(
  cors({
    origin(origin, callback) {
      if (isAllowedOrigin(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
  }),
)

app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/public', express.static(backendPublicPath))

app.use('/api/auth', authRouter)
app.use('/api/instructor', instructorRouter)
app.use('/api/learner', learnerRouter)
app.use('/api/course', courseRouter)
app.use('/api/admin', adminRouter)
app.use('/api/bank', bankRouter)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    environment: process.env.NODE_ENV || 'development',
  })
})

if (canServeFrontend) {
  app.use(express.static(frontendDistPath))

  // Return the SPA shell for client-side routes.
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next()
    if (req.path.startsWith('/api') || req.path.startsWith('/public')) return next()
    return res.sendFile(frontendIndexPath)
  })
}

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err)

  const origin = req.headers.origin
  if (isAllowedOrigin(origin) && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  })
})

// 404 handler
app.use((req, res) => {
  const origin = req.headers.origin
  if (isAllowedOrigin(origin) && origin) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }

  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

export default app
