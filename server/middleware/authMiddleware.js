import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Proverava da li je korisnik ulogovan
export const protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Niste autorizovani, nema tokena' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (error) {
        res.status(401).json({ message: 'Niste autorizovani, token nije validan' });
    }
};

// Proverava da li je korisnik admin
export const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Pristup dozvoljen samo administratorima' });
    }
};

// Proverava da li je korisnik vozac
export const driver = (req, res, next) => {
    if (req.user && req.user.role === 'driver') {
        next();
    } else {
        res.status(403).json({ message: 'Pristup dozvoljen samo vozačima' });
    }
};