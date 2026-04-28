const jwt = require('jsonwebtoken');

//  Fungsi Cek Token 
const verifyToken = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });

    const token = authHeader.split(" ")[1];
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // berisi { id, role, username }
        next();
    } catch (err) {
        res.status(400).json({ message: 'Token tidak valid.' });
    }
};

//  Fungsi Cek Role Admin
const isAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Akses ditolak! Anda bukan Admin.' });
        }
    });
};

module.exports = { verifyToken, isAdmin };
