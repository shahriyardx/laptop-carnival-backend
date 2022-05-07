require('dotenv').config()
require('./database/mongodb.init')

const express = require('express')
const cors = require('cors')
const logger = require('./utils/logger')

// Models
const Item = require('./database/schema/Item')

// Initialize app
const app = express()

// Use middlewares
app.use(cors())
app.use(express.json())
app.use(logger)

app.get('/inventory', async (req, res) => {
  const items = await Item.find()
  
  res.json({
    data: items
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})