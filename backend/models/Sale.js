const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  quantity: Number,
  totalRevenue: Number,
  reportDate: Date
});

module.exports = mongoose.model('Sale', saleSchema);
