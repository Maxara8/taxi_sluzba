import express from 'express';
import {
    getVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    toggleVehicle,
} from '../controllers/vehicleController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, admin, getVehicles);
router.post('/', protect, admin, addVehicle);
router.put('/:id', protect, admin, updateVehicle);
router.delete('/:id', protect, admin, deleteVehicle);
router.put('/:id/toggle', protect, admin, toggleVehicle);

export default router;