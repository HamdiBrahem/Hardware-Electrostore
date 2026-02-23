import express from 'express';
import productRoutes from '../../routes/products.js';
import authRoutes from '../../routes/auth.js';
import contactRoutes from '../../routes/contact.js';
import orderRoutes from '../../routes/orders.js';
import adminRoutes from '../../routes/admin.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/api/products', productRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/contact', contactRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  });

  return app;
}
