const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;

// 🔐 Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: "dxufkhffc",
  api_key: "226735658796427",
  api_secret: "YjGUXxKXTl4AJVKIauAyVAOBh7w",
});

// ✅ Add error-handling + logging
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    console.log("Uploading file:", file.originalname); // 👈 log file info
    return {
      folder: "earthrectify_uploads",
      public_id: file.originalname.split(".")[0], // optional
      resource_type: "auto", // "auto" lets Cloudinary handle both images/docs
      allowed_formats: [
        "jpg",
        "jpeg",
        "png",
        "pdf",
        "doc",
        "docx",
        "txt",
        "xls",
        "xlsx",
        "ppt",
        "pptx",
      ],
    };
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

module.exports = upload;
