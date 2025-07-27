// Hebrew Inspection Tracker Backend Server
// שרת Backend למערכת מעקב בדיקות עברית

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { testConnection } from './config/supabase.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}))

// CORS configuration for Hebrew frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-hebrew-support']
}))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Hebrew request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleString('he-IL')
  console.log(`${timestamp} - ${req.method} ${req.path}`)
  next()
})

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    const dbConnected = await testConnection()
    
    res.json({
      status: 'healthy',
      message: 'מערכת מעקב בדיקות עברית פעילה',
      timestamp: new Date().toISOString(),
      database: dbConnected ? 'connected' : 'disconnected',
      version: '1.0.0'
    })
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      message: 'שגיאה במערכת',
      error: error.message
    })
  }
})

// API endpoints placeholder
app.get('/api', (req, res) => {
  res.json({
    message: 'Hebrew Inspection Tracker API',
    message_hebrew: 'API מערכת מעקב בדיקות עברית',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      inspections: '/api/inspections',
      buildings: '/api/buildings',
      types: '/api/inspection-types',
      users: '/api/users'
    }
  })
})

// Error handling middleware with Hebrew support
app.use((error, req, res, next) => {
  console.error('Server Error:', error)
  
  const hebrewErrorMessage = {
    'ValidationError': 'שגיאת אימות נתונים',
    'UnauthorizedError': 'אין הרשאה לגישה',
    'NotFoundError': 'הנתון המבוקש לא נמצא',
    'DatabaseError': 'שגיאה בבסיס הנתונים'
  }
  
  const errorType = error.name || 'UnknownError'
  const hebrewMessage = hebrewErrorMessage[errorType] || 'שגיאה לא ידועה'
  
  res.status(error.status || 500).json({
    error: true,
    message: hebrewMessage,
    originalMessage: error.message,
    timestamp: new Date().toISOString()
  })
})

// 404 handler with Hebrew message
app.use('*', (req, res) => {
  res.status(404).json({
    error: true,
    message: 'נתיב לא נמצא',
    message_english: 'Route not found',
    path: req.originalUrl
  })
})

// Start server
const startServer = async () => {
  try {
    // Test database connection on startup
    console.log('🔍 Testing database connection...')
    const dbConnected = await testConnection()
    
    if (!dbConnected) {
      console.warn('⚠️ Database connection failed, but starting server anyway')
    }
    
    app.listen(PORT, () => {
      console.log('🚀 Hebrew Inspection Tracker Backend Started!')
      console.log(`📡 Server running on port ${PORT}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/health`)
      console.log(`📊 API info: http://localhost:${PORT}/api`)
      console.log(`🗄️ Database: ${dbConnected ? '✅ Connected' : '❌ Disconnected'}`)
      console.log('')
      console.log('מערכת מעקב בדיקות עברית - שרת Backend פעיל!')
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error.message)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully...')
  process.exit(0)
})

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully...')
  process.exit(0)
})

// Start the server
startServer()

export default app