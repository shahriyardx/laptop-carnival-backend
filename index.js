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

// Routes
app.get('/inventory', async (req, res) => {
  let limit = parseInt(req.query.limit);
  const items = await Item.find().limit(limit)
  res.json({
    items
  })
})

app.get('/inventory/:id', async (req, res) => {
  const { id } =  req.params
  try {
    const item = await Item.findOne({ _id: id})
    res.json(item)
  } catch (err) {
    res.json({ error: 'Item not found'})
  }
})

app.delete('/inventory/:id', async (req, res) => {
  const { id } =  req.params
  try {
    await Item.deleteOne({ _id: id})
    res.json({ success: true })
  } catch (err) {
    res.json({ error: 'Item not found'})
  }
})

app.post('/inventory/add', async (req, res) => {
  const body = req.body
  const insertData = await Item.create(body)
  res.json(insertData)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})