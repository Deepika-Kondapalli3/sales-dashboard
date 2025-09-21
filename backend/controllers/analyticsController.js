const Sale = require('../models/Sale');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// Revenue & Orders
exports.getRevenueAndOrders = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Convert to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999); // include full end date

    const sales = await Sale.find({
      reportDate: { $gte: start, $lte: end },
    });

    const totalRevenue = sales.reduce((sum, s) => sum + Number(s.totalRevenue || 0), 0);
    const totalOrders = sales.reduce((sum, s) => sum + Number(s.quantity || 0), 0);

    res.json({ totalRevenue, totalOrders });
  } catch (err) {
    console.error('Revenue & Orders Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Top 5 Products
exports.getTopProducts = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const agg = await Sale.aggregate([
      { $match: { reportDate: { $gte: start, $lte: end } } },
      { $group: { _id: '$productId', totalSold: { $sum: '$quantity' } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const topProducts = await Product.find({ _id: { $in: agg.map(p => p._id) } }).select('name');

    const finalProducts = agg.map(item => {
      const product = topProducts.find(p => p._id.equals(item._id));
      return {
        _id: item._id,
        name: product?.name || 'Unknown',
        totalSold: item.totalSold,
      };
    });

    res.json(finalProducts);
  } catch (err) {
    console.error('Top Products Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Top 5 Customers
exports.getTopCustomers = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const agg = await Sale.aggregate([
      { $match: { reportDate: { $gte: start, $lte: end } } },
      { $group: { _id: '$customerId', totalSpent: { $sum: '$totalRevenue' } } },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
    ]);

    const topCustomers = await Customer.find({ _id: { $in: agg.map(c => c._id) } }).select('name');

    const finalCustomers = agg.map(item => {
      const customer = topCustomers.find(c => c._id.equals(item._id));
      return {
        _id: item._id,
        name: customer?.name || 'Unknown',
        totalSpent: item.totalSpent,
      };
    });

    res.json(finalCustomers);
  } catch (err) {
    console.error('Top Customers Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
