const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(
    __dirname,
    "../uploads/products"
);

fs.mkdirSync(uploadDir, {
    recursive: true
});

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(file.originalname);

        const filename =
            Date.now() +
            "-" +
            Math.round(
                Math.random() * 1000000000
            ) +
            extension;

        cb(null, filename);
    }
});

const upload = multer({
    storage: storage
});

module.exports = upload;
