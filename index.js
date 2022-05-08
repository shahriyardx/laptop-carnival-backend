require('dotenv').config()
require('./database/mongodb.init')

const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const verifyJwt = require('./middlewares/verifyJwt')

// Models
const Item = require('./database/schema/Item')

// Initialize app
const app = express()

// Use middlewares
app.use(cors())
app.use(express.json())

if(process.env.NODE_ENV !== 'production') {
  const logger = require('./utils/logger')
  app.use(logger)
}

// Routes
app.get('/', (req, res) => {
  res.json({ hello: 'World' })
})

app.get('/inventory', async (req, res) => {
  let limit = parseInt(req.query.limit);
  const items = await Item.find().limit(limit)
  res.json({
    items
  })
})

app.get('/inventory/my', verifyJwt, async (req, res) => {
  const { suplier_email } = req.user
  console.log(suplier_email)
  const items = await Item.find({ suplier_email })
  res.json({
    items
  })
})

app.get('/inventory/:id', verifyJwt, async (req, res) => {
  const { id } =  req.params
  try {
    const item = await Item.findOne({ _id: id})
    res.json(item)
  } catch (err) {
    res.json({ error: 'Item not found'})
  }
})

app.delete('/inventory/:id', verifyJwt, async (req, res) => {
  const { id } =  req.params
  try {
    await Item.deleteOne({ _id: id})
    res.json({ success: true })
  } catch (err) {
    res.json({ error: 'Item not found'})
  }
})

app.put('/inventory/:id/delivered', verifyJwt, async (req, res) => {
  const { id } =  req.params

  try {
    const item = await Item.findOne({ _id: id})

    if (item.quantity <= 0) {
      return res.json({ error : "Item is out of stock, Can't deliver"})
    }

    await Item.updateOne({ _id: item._id}, {
      $set: {
        quantity: item.quantity - 1,
        sold: item.sold + 1,
      }
    })

    res.json({
      ...item.toObject(), 
      quantity: item.quantity - 1,
      sold: item.sold + 1
    })
  } catch (err) {
    res.json({ error: 'Item not found'})
  }
})

app.put('/inventory/:id/restock', verifyJwt, async (req, res) => {
  const { id } =  req.params
  const { quantity } = req.body

  if (isNaN(parseInt(quantity))) {
    return res.json({ error: 'Quantity must be a number'})
  }

  try {
    const item = await Item.findOne({ _id: id})
    await Item.updateOne({ _id: item._id}, {
      $set: {
        quantity: item.quantity + parseInt(quantity)
      }
    })
    res.json({...item.toObject(), quantity: item.quantity + parseInt(quantity)})
  } catch (err) {
    res.json({ error: 'Item not found'})
  }
})

app.post('/inventory/add', verifyJwt, async (req, res) => {
  const user = req.user
  const body = req.body
  
  const insertData = await Item.create({...body, ...user})
  res.json(insertData)
})


app.post('/login', async (req, res) => {
  const loginData = req.body

  if (!loginData.email || !loginData.username) {
    return res.json({ error: 'Invalid data' })
  }

  const token = jwt.sign(loginData, process.env.TOKEN_SECRET)
  res.json({ accessToken: token })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})