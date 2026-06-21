import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['passenger', 'driver', 'admin'],
        default: 'passenger',
    },
    phone: {
        type: String,
        default: '',
    },
    isAvailable: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 5.0,
    },
    totalRides: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

// Proverava lozinku pri prijavi
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Hashuje lozinku pre čuvanja u bazu
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

export default User;