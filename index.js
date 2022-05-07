require('dotenv').config()
require('./database/mongodb.init')
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/inventory', async (req, res) => {
  res.send('Hello World')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})