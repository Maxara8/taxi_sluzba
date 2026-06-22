import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dns from 'node:dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dns.setDefaultResultOrder('ipv4first');

dotenv.config({ path: './.env' });

import User from './models/userModel.js';
import Ride from './models/rideModel.js';
import Vehicle from './models/vehicleModel.js';

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        family: 4,
    });
};

const users = [
    {
        name: 'Administrator',
        email: 'admin@taxi.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        phone: '+381 11 123 4567',
    },
    {
        name: 'Marko Marković',
        email: 'putnik@test.com',
        password: await bcrypt.hash('putnik123', 10),
        role: 'passenger',
        phone: '+381 64 123 4567',
    },
    {
        name: 'Ana Anić',
        email: 'ana@test.com',
        password: await bcrypt.hash('ana123', 10),
        role: 'passenger',
        phone: '+381 65 234 5678',
    },
    {
        name: 'Jovan Jovanović',
        email: 'vozac@test.com',
        password: await bcrypt.hash('vozac123', 10),
        role: 'driver',
        phone: '+381 63 987 6543',
        isAvailable: true,
        rating: 4.8,
        totalRides: 342,
    },
    {
        name: 'Nikola Nikolić',
        email: 'nikola@test.com',
        password: await bcrypt.hash('nikola123', 10),
        role: 'driver',
        phone: '+381 60 456 7890',
        isAvailable: false,
        rating: 4.5,
        totalRides: 128,
    },
];

const vehicles = [
    {
        brand: 'Škoda',
        model: 'Octavia',
        type: 'standard',
        licensePlate: 'NS 123 AB',
        year: 2021,
        isActive: true,
    },
    {
        brand: 'Volkswagen',
        model: 'Passat',
        type: 'standard',
        licensePlate: 'NS 456 CD',
        year: 2020,
        isActive: true,
    },
    {
        brand: 'Mercedes',
        model: 'E-Class',
        type: 'premium',
        licensePlate: 'NS 789 EF',
        year: 2022,
        isActive: true,
    },
    {
        brand: 'BMW',
        model: '5 Series',
        type: 'premium',
        licensePlate: 'NS 321 GH',
        year: 2023,
        isActive: true,
    },
    {
        brand: 'Volkswagen',
        model: 'Transporter',
        type: 'kombi',
        licensePlate: 'NS 654 IJ',
        year: 2020,
        isActive: true,
    },
    {
        brand: 'Ford',
        model: 'Transit',
        type: 'kombi',
        licensePlate: 'NS 987 KL',
        year: 2019,
        isActive: false,
    },
];

const importData = async () => {
    try {
        await connectDB();
        console.log('Brisanje postojećih podataka...');

        await User.deleteMany();
        await Ride.deleteMany();
        await Vehicle.deleteMany();

        console.log('Unošenje korisnika...');
        const createdUsers = await User.insertMany(users);

        const passenger = createdUsers.find(u => u.email === 'putnik@test.com');
        const driver = createdUsers.find(u => u.email === 'vozac@test.com');

        console.log('Unošenje vožnji...');
        await Ride.insertMany([
            {
                passenger: passenger._id,
                driver: driver._id,
                from: 'Centar — Trg slobode, Novi Sad',
                to: 'FTN — Trg Dositeja Obradovića, Novi Sad',
                vehicleType: 'standard',
                status: 'completed',
                price: 270,
                distance: 3,
                rating: 5,
                ratingComment: 'Odličan vozač!',
            },
            {
                passenger: passenger._id,
                driver: driver._id,
                from: 'Kej — Dunavska obala, Novi Sad',
                to: 'Spens — Sutjeska 2, Novi Sad',
                vehicleType: 'kombi',
                status: 'completed',
                price: 370,
                distance: 5,
                rating: 4,
                ratingComment: 'Dobra vožnja',
            },
            {
                passenger: passenger._id,
                from: 'Železnička stanica — Bulevar Jaše Tomića, Novi Sad',
                to: 'Centar — Trg slobode, Novi Sad',
                vehicleType: 'premium',
                status: 'pending',
                price: 450,
                distance: 4,
            },
        ]);

        console.log('Unošenje vozila...');
        await Vehicle.insertMany(vehicles);

        console.log('✅ Podaci uspešno uneti u bazu!');
        console.log('👤 Korisnici:');
        console.log('   admin@taxi.com / admin123');
        console.log('   putnik@test.com / putnik123');
        console.log('   vozac@test.com / vozac123');
        process.exit();
    } catch (error) {
        console.error(`Greška: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await connectDB();
        await User.deleteMany();
        await Ride.deleteMany();
        await Vehicle.deleteMany();
        console.log('✅ Svi podaci obrisani!');
        process.exit();
    } catch (error) {
        console.error(`Greška: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}