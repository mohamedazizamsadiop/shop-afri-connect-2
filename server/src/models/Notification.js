import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['order_confirmed', 'order_shipped', 'order_delivered', 'withdrawal_approved', 'seller_verified', 'new_order'],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  data: {
    orderId: mongoose.Schema.Types.ObjectId,
    withdrawalId: mongoose.Schema.Types.ObjectId,
  },
  read: {
    type: Boolean,
    default: false,
  },
  channel: {
    type: String,
    enum: ['email', 'sms', 'push', 'in_app'],
    default: 'email',
  },
  status: {
    type: String,
    enum: ['pending', 'sent', 'failed'],
    default: 'pending',
  },
  error: String,
  sentAt: Date,
  readAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Notification', notificationSchema);
