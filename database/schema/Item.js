const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  title: String,
  short_description: String,
  description: String,
  image: String,
  brand: String,
  price: Number,
  quantity: Number,
  sold: Number,
  suplier: String,
  suplier_email: String
})

module.exports = mongoose.models.Item || mongoose.model("Item", ItemSchema)