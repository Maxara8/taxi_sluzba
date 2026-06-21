import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Mora biti PRE svega ostalog!
dotenv.config({ path: './.env' });

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Taxi API radi!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server pokrenut na portu ${PORT}`);
});