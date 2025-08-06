// server.js
import http from 'http'
import path from 'path'
import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'

import productRoutes from './api/product/product.routes.js'

// ENV setup
dotenv.config()

const app = express()
const server = http.createServer(app)

// Express App Config
app.use(express.json())

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve('public')))
} else {
  const corsOptions = {
    origin: [
      'http://127.0.0.1:5173',
      'http://localhost:5173'
    ],
    credentials: true
  }
  app.use(cors(corsOptions))
}

// Routes
app.use('/api/product', productRoutes)

// Fallback for SPA routing
app.get('/*all', (req, res) => {
  res.sendFile(path.resolve('public/index.html'))
})

const port = process.env.PORT || 3030
server.listen(port, () => {
  console.log(`✅ Server is running on: http://localhost:${port}/`)
})
