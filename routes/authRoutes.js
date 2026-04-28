const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// REGISTER
router.post('/register', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role || 'customer' // Default customer jika tidak diisi
        });

        const savedUser = await newUser.save();
        res.status(201).json({ message: "Registrasi berhasil", user: savedUser });
    } catch (err) {
        res.status(500).json(err);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json({ message: "Username tidak ditemukan!" });

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Password salah!" });

        // Masukkan role ke dalam token
        const token = jwt.sign(
            { id: user._id, role: user.role, username: user.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        // Kirim token dan role ke frontend
        res.status(200).json({ token, role: user.role, username: user.username });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
