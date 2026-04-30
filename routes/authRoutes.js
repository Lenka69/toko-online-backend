const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// --- 1. RUTE REGISTER ---
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Cek apakah username atau email sudah pernah didaftarkan
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username atau Email sudah terdaftar!' });
    }

    // Enkripsi (Hash) password demi keamanan
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Simpan user baru ke database
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: 'customer' // Pengguna baru selalu jadi customer
    });

    await newUser.save();
    res.status(201).json({ message: 'Registrasi berhasil! Silakan login.' });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat registrasi.' });
  }
});

// --- 2. RUTE LOGIN ---
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: 'Username tidak ditemukan!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Password salah!' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Terjadi kesalahan pada server saat login.' });
  }
});

module.exports = router;