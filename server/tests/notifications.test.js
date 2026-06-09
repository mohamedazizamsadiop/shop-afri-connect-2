import { jest } from '@jest/globals';
import app from '../src/index.js';
import request from 'supertest';
import User from '../src/models/User.js';
import Notification from '../src/models/Notification.js';
import * as jwt from '../src/utils/jwt.js';

jest.setTimeout(30000);

let testUser;
let authToken;

beforeEach(async () => {
  // Create test user
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    role: 'client',
  });

  // Generate auth token
  authToken = jwt.signAccessToken(testUser._id);
});

describe('Notifications API', () => {
  test('Should get user notifications', async () => {
    // Create test notification
    await Notification.create({
      userId: testUser._id,
      type: 'order_confirmed',
      title: 'Commande confirmée',
      message: 'Votre commande a été confirmée',
      channel: 'email',
      status: 'sent',
    });

    const response = await request(app)
      .get('/api/notifications')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.count).toBe(1);
    expect(response.body.notifications[0].type).toBe('order_confirmed');
  });

  test('Should mark notification as read', async () => {
    const notification = await Notification.create({
      userId: testUser._id,
      type: 'order_confirmed',
      title: 'Commande confirmée',
      message: 'Test',
      channel: 'email',
      status: 'sent',
      read: false,
    });

    const response = await request(app)
      .put(`/api/notifications/${notification._id}/read`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.read).toBe(true);
    expect(response.body.readAt).toBeDefined();
  });

  test('Should mark all notifications as read', async () => {
    // Create multiple notifications
    await Notification.create({
      userId: testUser._id,
      type: 'order_confirmed',
      title: 'Test 1',
      message: 'Test',
      read: false,
    });

    await Notification.create({
      userId: testUser._id,
      type: 'order_shipped',
      title: 'Test 2',
      message: 'Test',
      read: false,
    });

    const response = await request(app)
      .put('/api/notifications/read-all')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    const notifications = await Notification.find({ userId: testUser._id });
    expect(notifications.every(n => n.read)).toBe(true);
  });

  test('Should delete notification', async () => {
    const notification = await Notification.create({
      userId: testUser._id,
      type: 'order_confirmed',
      title: 'Test',
      message: 'Test',
    });

    const response = await request(app)
      .delete(`/api/notifications/${notification._id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);

    const deleted = await Notification.findById(notification._id);
    expect(deleted).toBeNull();
  });

  test('Should return 404 for non-existent notification', async () => {
    const fakeId = '000000000000000000000000';

    const response = await request(app)
      .put(`/api/notifications/${fakeId}/read`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(404);
  });

  test('Should require authentication', async () => {
    const response = await request(app).get('/api/notifications');

    expect(response.status).toBe(401);
  });
});
