import Vehicle from '../models/vehicleModel.js';

// @desc    Dobijanje svih vozila
// @route   GET /api/vehicles
// @access  Private/Admin
export const getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find({}).sort({ createdAt: -1 });
        res.json(vehicles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dodavanje vozila
// @route   POST /api/vehicles
// @access  Private/Admin
export const addVehicle = async (req, res) => {
    try {
        const { brand, model, type, licensePlate, year } = req.body;

        const vehicleExists = await Vehicle.findOne({ licensePlate });
        if (vehicleExists) {
            return res.status(400).json({ message: 'Vozilo sa tom registracijom već postoji' });
        }

        const vehicle = await Vehicle.create({ brand, model, type, licensePlate, year });
        res.status(201).json(vehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Azuriranje vozila
// @route   PUT /api/vehicles/:id
// @access  Private/Admin
export const updateVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vozilo nije pronađeno' });
        }

        const { brand, model, type, licensePlate, year, isActive } = req.body;

        vehicle.brand = brand || vehicle.brand;
        vehicle.model = model || vehicle.model;
        vehicle.type = type || vehicle.type;
        vehicle.licensePlate = licensePlate || vehicle.licensePlate;
        vehicle.year = year || vehicle.year;
        vehicle.isActive = isActive !== undefined ? isActive : vehicle.isActive;

        const updatedVehicle = await vehicle.save();
        res.json(updatedVehicle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Brisanje vozila
// @route   DELETE /api/vehicles/:id
// @access  Private/Admin
export const deleteVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vozilo nije pronađeno' });
        }

        await Vehicle.deleteOne({ _id: req.params.id });
        res.json({ message: 'Vozilo obrisano' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Aktiviranje/deaktiviranje vozila
// @route   PUT /api/vehicles/:id/toggle
// @access  Private/Admin
export const toggleVehicle = async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vozilo nije pronađeno' });
        }

        vehicle.isActive = !vehicle.isActive;
        await vehicle.save();

        res.json({
            message: `Vozilo ${vehicle.isActive ? 'aktivirano' : 'deaktivirano'}`,
            vehicle,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};