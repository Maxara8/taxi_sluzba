import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Generise JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Registracija korisnika
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        // Provera da li korisnik vec postoji
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Korisnik sa tim emailom već postoji' });
        }

        // Kreiranje korisnika
        const user = await User.create({ name, email, password, role, phone });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Prijava korisnika
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trazimo korisnika u bazi
        const user = await User.findOne({ email });

        // Proveravamo lozinku
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Pogrešan email ili lozinka' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje profila ulogovanog korisnika
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Korisnik nije pronađen' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje svih korisnika
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Dobijanje svih vozaca
// @route   GET /api/users/drivers
// @access  Private/Admin
export const getDrivers = async (req, res) => {
    try {
        const drivers = await User.find({ role: 'driver' }).select('-password');
        res.json(drivers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Brisanje korisnika
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: req.params.id });
            res.json({ message: 'Korisnik obrisan' });
        } else {
            res.status(404).json({ message: 'Korisnik nije pronađen' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};