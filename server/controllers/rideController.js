import Ride from '../models/rideModel.js';
import User from '../models/userModel.js';

// @desc    Kreiranje nove voznje
// @route   POST /api/rides
// @access  Private/Passenger
export const createRide = async (req, res) => {
    try {
        const { from, to, vehicleType, notes, distance, price } = req.body;

        const ride = await Ride.create({
            passenger: req.user._id,
            from,
            to,
            vehicleType,
            notes,
            distance,
            price,
        });

        res.status(201).json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje svih voznji (admin)
// @route   GET /api/rides
// @access  Private/Admin
export const getAllRides = async (req, res) => {
    try {
        const rides = await Ride.find({})
            .populate('passenger', 'name email')
            .populate('driver', 'name email')
            .sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje voznji ulogovanog putnika
// @route   GET /api/rides/my
// @access  Private/Passenger
export const getMyRides = async (req, res) => {
    try {
        const rides = await Ride.find({ passenger: req.user._id })
            .populate('driver', 'name phone rating')
            .sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje voznji ulogovanog vozaca
// @route   GET /api/rides/driver
// @access  Private/Driver
export const getDriverRides = async (req, res) => {
    try {
        const rides = await Ride.find({ driver: req.user._id })
            .populate('passenger', 'name phone')
            .sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje voznji na cekanju (za vozace)
// @route   GET /api/rides/pending
// @access  Private/Driver
export const getPendingRides = async (req, res) => {
    try {
        const rides = await Ride.find({ status: 'pending' })
            .populate('passenger', 'name phone')
            .sort({ createdAt: -1 });
        res.json(rides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Prihvatanje voznje (vozac)
// @route   PUT /api/rides/:id/accept
// @access  Private/Driver
export const acceptRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Vožnja nije pronađena' });
        }

        if (ride.status !== 'pending') {
            return res.status(400).json({ message: 'Vožnja nije dostupna' });
        }

        ride.driver = req.user._id;
        ride.status = 'accepted';
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Pokretanje voznje
// @route   PUT /api/rides/:id/start
// @access  Private/Driver
export const startRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Vožnja nije pronađena' });
        }

        if (ride.status !== 'accepted') {
            return res.status(400).json({ message: 'Vožnja ne može biti pokrenuta' });
        }

        ride.status = 'in_progress';
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Zavrsavanje voznje
// @route   PUT /api/rides/:id/complete
// @access  Private/Driver
export const completeRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Vožnja nije pronađena' });
        }

        if (ride.status !== 'in_progress') {
            return res.status(400).json({ message: 'Vožnja nije u toku' });
        }

        ride.status = 'completed';
        await ride.save();

        // Azuriramo broj voznji vozaca
        await User.findByIdAndUpdate(ride.driver, {
            $inc: { totalRides: 1 }
        });

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Ocenjivanje voznje
// @route   PUT /api/rides/:id/rate
// @access  Private/Passenger
export const rateRide = async (req, res) => {
    try {
        const { rating, ratingComment } = req.body;
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Vožnja nije pronađena' });
        }

        if (ride.status !== 'completed') {
            return res.status(400).json({ message: 'Možete oceniti samo završene vožnje' });
        }

        ride.rating = rating;
        ride.ratingComment = ratingComment;
        await ride.save();

        // Azuriramo prosecnu ocenu vozaca
        const driverRides = await Ride.find({
            driver: ride.driver,
            rating: { $ne: null }
        });

        const avgRating = driverRides.reduce((sum, r) => sum + r.rating, 0) / driverRides.length;

        await User.findByIdAndUpdate(ride.driver, {
            rating: avgRating.toFixed(1)
        });

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Otkazivanje voznje
// @route   PUT /api/rides/:id/cancel
// @access  Private
export const cancelRide = async (req, res) => {
    try {
        const ride = await Ride.findById(req.params.id);

        if (!ride) {
            return res.status(404).json({ message: 'Vožnja nije pronađena' });
        }

        if (['completed', 'cancelled'].includes(ride.status)) {
            return res.status(400).json({ message: 'Vožnja ne može biti otkazana' });
        }

        ride.status = 'cancelled';
        await ride.save();

        res.json(ride);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};