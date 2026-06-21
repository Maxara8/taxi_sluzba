import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
    passenger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    from: {
        type: String,
        required: true,
    },
    to: {
        type: String,
        required: true,
    },
    vehicleType: {
        type: String,
        enum: ['standard', 'kombi', 'premium'],
        default: 'standard',
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'],
        default: 'pending',
    },
    price: {
        type: Number,
        default: 0,
    },
    distance: {
        type: Number,
        default: 0,
    },
    notes: {
        type: String,
        default: '',
    },
    rating: {
        type: Number,
        default: null,
    },
    ratingComment: {
        type: String,
        default: '',
    },
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;