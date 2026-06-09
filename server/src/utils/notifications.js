import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: process.env.MAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export const sendEmailNotification = async (to, subject, htmlContent) => {
  try {
    if (!process.env.MAIL_USER) {
      console.log(`[DEV MODE] Email to ${to}:`, subject);
      return { success: true, message: 'Email sent in dev mode' };
    }

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM || process.env.MAIL_USER,
      to,
      subject,
      html: htmlContent,
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
export const emailTemplates = {
  orderConfirmation: (customerName, orderId, total, estimatedDate) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B35;">Commande confirmée</h1>
      <p>Bonjour ${customerName},</p>
      <p>Votre commande <strong>#${orderId}</strong> a été confirmée avec succès.</p>
      <p><strong>Montant total:</strong> ${total}</p>
      <p><strong>Date de livraison estimée:</strong> ${estimatedDate}</p>
      <p>Merci pour votre achat!</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">MarketHub - La plateforme e-commerce de confiance</p>
    </div>
  `,

  orderShipped: (customerName, orderId, trackingNumber) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B35;">Votre commande a été expédiée</h1>
      <p>Bonjour ${customerName},</p>
      <p>Votre commande <strong>#${orderId}</strong> est en route!</p>
      <p><strong>Numéro de suivi:</strong> ${trackingNumber}</p>
      <p>Vous pouvez suivre votre livraison sur notre plateforme.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">MarketHub - La plateforme e-commerce de confiance</p>
    </div>
  `,

  orderDelivered: (customerName, orderId) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B35;">Commande livrée</h1>
      <p>Bonjour ${customerName},</p>
      <p>Votre commande <strong>#${orderId}</strong> a été livrée avec succès.</p>
      <p>Nous espérons que vous êtes satisfait de votre achat. N'hésitez pas à nous contacter pour toute question.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">MarketHub - La plateforme e-commerce de confiance</p>
    </div>
  `,

  withdrawalApproved: (sellerName, amount, date) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B35;">Demande de retrait approuvée</h1>
      <p>Bonjour ${sellerName},</p>
      <p>Votre demande de retrait de <strong>${amount}</strong> a été approuvée.</p>
      <p><strong>Date de traitement:</strong> ${date}</p>
      <p>Les fonds seront transférés à votre compte bancaire dans les 2 à 3 jours ouvrables.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">MarketHub - La plateforme e-commerce de confiance</p>
    </div>
  `,

  sellerVerified: (sellerName, shopName) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B35;">Boutique vérifiée</h1>
      <p>Bonjour ${sellerName},</p>
      <p>Félicitations! Votre boutique <strong>${shopName}</strong> a été vérifiée et est maintenant active.</p>
      <p>Vous pouvez commencer à vendre vos produits. Accédez à votre tableau de bord vendeur pour gérer vos produits.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">MarketHub - La plateforme e-commerce de confiance</p>
    </div>
  `,

  newOrderNotification: (sellerName, orderId, amount, customerName) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FF6B35;">Nouvelle commande reçue</h1>
      <p>Bonjour ${sellerName},</p>
      <p>Vous avez reçu une nouvelle commande!</p>
      <p><strong>Commande #${orderId}</strong></p>
      <p><strong>Client:</strong> ${customerName}</p>
      <p><strong>Montant:</strong> ${amount}</p>
      <p>Connectez-vous à votre tableau de bord pour voir les détails et préparer l'expédition.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
      <p style="color: #666; font-size: 12px;">MarketHub - La plateforme e-commerce de confiance</p>
    </div>
  `,
};

export const notificationService = {
  async sendOrderConfirmation(customer, order) {
    const estimatedDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR');
    const html = emailTemplates.orderConfirmation(customer.name, order._id, order.totalAmount, estimatedDate);
    return sendEmailNotification(customer.email, 'Commande confirmée', html);
  },

  async sendOrderShipped(customer, order) {
    const trackingNumber = `TRK${Date.now()}`;
    const html = emailTemplates.orderShipped(customer.name, order._id, trackingNumber);
    return sendEmailNotification(customer.email, 'Commande expédiée', html);
  },

  async sendOrderDelivered(customer, order) {
    const html = emailTemplates.orderDelivered(customer.name, order._id);
    return sendEmailNotification(customer.email, 'Commande livrée', html);
  },

  async sendWithdrawalApproved(seller, withdrawal) {
    const html = emailTemplates.withdrawalApproved(seller.name, withdrawal.amount, new Date().toLocaleDateString('fr-FR'));
    return sendEmailNotification(seller.email, 'Demande de retrait approuvée', html);
  },

  async sendSellerVerified(user, seller) {
    const html = emailTemplates.sellerVerified(user.name, seller.shopName);
    return sendEmailNotification(user.email, 'Boutique vérifiée', html);
  },

  async sendNewOrderNotification(seller, user, order) {
    const html = emailTemplates.newOrderNotification(seller.name, order._id, order.totalAmount, user.name);
    return sendEmailNotification(seller.email, 'Nouvelle commande', html);
  },
};
