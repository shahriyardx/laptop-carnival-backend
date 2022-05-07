require('dotenv').config()
require('./database/mongodb.init')
const express = require('express')
const app = express()

app.get('/inventory', async (req, res) => {
  res.send('Hello World')
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})