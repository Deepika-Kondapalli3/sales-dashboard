require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const Sale = require('../models/Sale');

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
      const customer = new Customer({
        name: faker.person.fullName(),
        region: faker.helpers.arrayElement(['North', 'South', 'East', 'West']),
        type: faker.helpers.arrayElement(['Individual', 'Business']),
      });
      await customer.save();
      customers.push(customer);
    }

    // Create Products
    for (let i = 0; i < 20; i++) {
      const product = new Product({
        name: faker.commerce.productName(),
        category: faker.commerce.department(),
        price: Number(faker.commerce.price({ min: 10, max: 500 })),
      });
      await product.save();
      products.push(product);
    }

    // Create Sales
    for (let i = 0; i < 200; i++) {
      const product = faker.helpers.arrayElement(products);
      const customer = faker.helpers.arrayElement(customers);
      const quantity = faker.number.int({ min: 1, max: 10 });

      // Correct Faker v7+ usage: pass ISO date strings
      const startDate = new Date('2023-01-01T00:00:00Z');
      const endDate = new Date('2025-12-31T23:59:59Z');
      const randomDate = faker.date.between({ from: startDate, to: endDate });

      await Sale.create({
        productId: product._id,
        customerId: customer._id,
        quantity,
        totalRevenue: product.price * quantity,
        reportDate: randomDate,
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
