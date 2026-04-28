const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Hubungkan ke MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Berhasil terhubung ke MongoDB!'))
.catch((err) => console.log('Gagal terhubung ke MongoDB:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', productRoutes);

// Jalankan Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Backend berjalan di port ${PORT}`);
});
