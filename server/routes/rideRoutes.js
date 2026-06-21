import express from 'express';
import {
    createRide,
    getAllRides,
    getMyRides,
    getDriverRides,
    getPendingRides,
    acceptRide,
    startRide,
    completeRide,
    rateRide,
    cancelRide,
} from '../controllers/rideController.js';
import { protect, admin, driver } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createRide);
router.get('/', protect, admin, getAllRides);
router.get('/my', protect, getMyRides);
router.get('/driver', protect, getDriverRides);
router.get('/pending', protect, getPendingRides);
router.put('/:id/accept', protect, acceptRide);
router.put('/:id/start', protect, startRide);
router.put('/:id/complete', protect, completeRide);
router.put('/:id/rate', protect, rateRide);
router.put('/:id/cancel', protect, cancelRide);

export default router;