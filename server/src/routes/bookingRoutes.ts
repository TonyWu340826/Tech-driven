import express from 'express';
import { createBooking, getMyBookings } from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // Protect all booking routes

router.post('/', createBooking);
router.get('/', getMyBookings);

export default router;
