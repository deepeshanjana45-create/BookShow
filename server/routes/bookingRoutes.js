import express from 'express';
import { createBooking, verifyBooking, getOccupiedSeats } from '../controllers/bookingController.js';

const bookingRouter = express.Router();

// Route to initiate ticket booking and generate Razorpay checkout order
bookingRouter.post('/create', createBooking);

// Route to verify successful Razorpay payment and mark booking confirmed/paid
bookingRouter.post('/verify', verifyBooking);

// Route to get occupied seat map for a given show to prevent duplicate bookings
bookingRouter.get('/seats/:showId', getOccupiedSeats);

export default bookingRouter;
