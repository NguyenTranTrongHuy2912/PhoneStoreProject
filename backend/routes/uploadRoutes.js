const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        cb(
            null,
            `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

// File filter (only images)
function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

router.post('/', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    
    // Create absolute URL for the frontend to consume
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    
    res.json({
        success: true,
        url: url,
    });
});

module.exports = router;
