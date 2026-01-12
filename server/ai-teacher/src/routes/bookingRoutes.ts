import express from 'express';
import { createBooking, getMyBookings, cancelBooking, payBooking, getUserBalance, getAccountLogs } from '../controllers/bookingController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // Protect all booking routes

router.post('/', createBooking);
router.get('/', getMyBookings);
router.put('/:id/cancel', cancelBooking);
router.post('/:id/pay', payBooking);
router.get('/user/balance', getUserBalance);
router.get('/user/account-logs', getAccountLogs);

export default router;
