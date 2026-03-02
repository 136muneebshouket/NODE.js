import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

// API routes
router.use('/users', userRoutes);

// 404 handler for API routes
// router.use('*', (_req, res) => {
//   res.status(404).json({ message: 'API endpoint not found' });
// });

export default router;