import { jest } from '@jest/globals';
import app from '../src/index.js';
import request from 'supertest';
import User from '../src/models/User.js';
import Product from '../src/models/Product.js';
import Order from '../src/models/Order.js';
import * as jwt from '../src/utils/jwt.js';

jest.setTimeout(30000);

let seller, customer;
let sellerToken, customerToken;
let product;

beforeEach(async () => {
  // Create seller
  seller = await User.create({
    name: 'Seller Test',
    email: 'seller@test.com',
    password: 'password123',
    role: 'seller',
  });

  // Create customer
  customer = await User.create({
    name: 'Customer Test',
    email: 'customer@test.com',
    password: 'password123',
    role: 'client',
  });

  sellerToken = jwt.signAccessToken(seller._id);
  customerToken = jwt.signAccessToken(customer._id);

  // Create product
  product = await Product.create({
    sellerId: seller._id,
    name: 'Test Phone',
    description: 'A test phone',
    sellerPrice: 100000,
    commission: 15,
    stock: 10,
    category: 'phones',
  });
});

describe('Products API', () => {
  test('Should get all products', async () => {
    const response = await request(app).get('/api/products');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test('Should get product by ID', async () => {
    const response = await request(app).get(`/api/products/${product._id}`);

    expect(response.status).toBe(200);
    expect(response.body._id).toBe(product._id.toString());
    expect(response.body.name).toBe('Test Phone');
  });

  test('Seller should create product', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'New Phone',
        description: 'New test phone',
        sellerPrice: 150000,
        commission: 15,
        stock: 5,
        category: 'phones',
      });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('New Phone');
    expect(response.body.finalPrice).toBe(172500); // 150000 + 15%
  });

  test('Seller should update own product', async () => {
    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({
        name: 'Updated Phone',
        sellerPrice: 120000,
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Phone');
  });

  test('Seller should delete own product', async () => {
    const response = await request(app)
      .delete(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${sellerToken}`);

    expect(response.status).toBe(200);

    const deleted = await Product.findById(product._id);
    expect(deleted).toBeNull();
  });

  test('Non-seller cannot create product', async () => {
    const response = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        name: 'New Phone',
        sellerPrice: 100000,
      });

    expect(response.status).toBe(403);
  });

  test('Seller cannot update other seller product', async () => {
    // Create another seller
    const otherSeller = await User.create({
      name: 'Other Seller',
      email: 'other@test.com',
      password: 'password123',
      role: 'seller',
    });

    const otherToken = jwt.signAccessToken(otherSeller._id);

    const response = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ name: 'Hacked' });

    expect(response.status).toBe(403);
  });
});

describe('Orders API', () => {
  test('Customer should create order', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({
        items: [
          {
            productId: product._id,
            quantity: 2,
            price: product.finalPrice,
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body.customerId).toBe(customer._id.toString());
    expect(response.body.status).toBe('created');
    expect(response.body.paymentIntentId).toBeDefined();
  });

  test('Customer should get their orders', async () => {
    // Create order
    await Order.create({
      customerId: customer._id,
      products: [
        {
          productId: product._id,
          quantity: 1,
          sellerPrice: 100000,
          finalPrice: 115000,
        },
      ],
      totalAmount: 115000,
      status: 'paid',
    });

    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(1);
    expect(response.body[0].customerId).toBe(customer._id.toString());
  });

  test('Should update order status', async () => {
    const order = await Order.create({
      customerId: customer._id,
      products: [{ productId: product._id }],
      totalAmount: 100000,
      status: 'paid',
      paymentIntentId: 'pi_test123',
    });

    const response = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ status: 'shipped' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('shipped');
  });

  test('Should set deliveredAt when order delivered', async () => {
    const order = await Order.create({
      customerId: customer._id,
      products: [{ productId: product._id }],
      totalAmount: 100000,
      status: 'shipped',
    });

    const response = await request(app)
      .put(`/api/orders/${order._id}/status`)
      .set('Authorization', `Bearer ${sellerToken}`)
      .send({ status: 'delivered' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('delivered');
    expect(response.body.deliveredAt).toBeDefined();
  });

  test('Customer cannot see other customer orders', async () => {
    const otherCustomer = await User.create({
      name: 'Other Customer',
      email: 'other_customer@test.com',
      password: 'password123',
      role: 'client',
    });

    await Order.create({
      customerId: customer._id,
      products: [],
      totalAmount: 100000,
    });

    const otherToken = jwt.signAccessToken(otherCustomer._id);
    const response = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${otherToken}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
