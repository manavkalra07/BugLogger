const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 20 * 1024 * 1024,
        files: 6,
    },
});

module.exports = upload;
