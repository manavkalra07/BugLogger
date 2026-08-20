const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error("ERROR: Cloudinary credentials are missing in .env file");
    console.error("Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

function uploadToCloudinary(buffer, mimetype) {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: "auto",
                folder: "buglogger/comments",
                timeout: 60000,
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(new Error(`Upload failed: ${error.message}`));
                    return;
                }

                if (!result || !result.secure_url) {
                    reject(new Error("Invalid upload response from Cloudinary"));
                    return;
                }

                resolve(result);
            }
        );

        uploadStream.on("error", (error) => {
            console.error("Stream error:", error);
            reject(error);
        });

        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
}

function deleteFromCloudinary(publicId) {
    if (!publicId) return Promise.resolve();

    return cloudinary.uploader.destroy(publicId).catch((error) => {
        console.error("Error deleting from Cloudinary:", error);
    });
}

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary,
};
