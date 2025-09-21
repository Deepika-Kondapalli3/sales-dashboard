require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Customer = require('./models/Customer');
const Product = require('./models/Product');
const Sale = require('./models/Sale');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error(err));

const seedDB = async () => {
  try {
    // Clear existing data
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Sale.deleteMany({});

    const customers = [];
    const products = [];

    // Create Customers
    for (let i = 0; i < 50; i++) {
      const customer = await Customer.create({
        name: faker.person.fullName(),
        region: faker.helpers.arrayElement(['North', 'South', 'East', 'West']),
        type: faker.helpers.arrayElement(['Individual', 'Business']),
      });
      customers.push(customer);
    }

    // Create Products
    for (let i = 0; i < 20; i++) {
      const product = await Product.create({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: Number(faker.commerce.price({ min: 10, max: 500 })),
      });
      products.push(product);
    }

    // Create Sales
    for (let i = 0; i < 200; i++) {
      const product = faker.helpers.arrayElement(products);
      const customer = faker.helpers.arrayElement(customers);
      const quantity = faker.number.int({ min: 1, max: 10 });

      await Sale.create({
        productId: product._id,
        customerId: customer._id,
        quantity,
        totalRevenue: product.price * quantity,
        reportDate: faker.date.between('2023-01-01', '2025-12-31'),
      });
    }

    console.log('Database Seeded Successfully ✅');
  } catch (err) {
    console.error('Seeding Error:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedDB();
