require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true
});

const uploadImage = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "muze-image_file-folder",
        colors: true
    })
}

const uploadSong = async (filePath) => {
    return await cloudinary.uploader.upload(filePath, {
        folder: "muze-song_file-folder",
        resource_type: 'video',
        format: 'mp3',
        use_filename: true,
        unique_filename: false
    })
}

const deleteImage = async (thumbnailCloudinaryId) => {
    return await cloudinary.uploader.destroy(thumbnailCloudinaryId)
}

module.exports = {
    uploadImage,
    uploadSong,
    deleteImage
}