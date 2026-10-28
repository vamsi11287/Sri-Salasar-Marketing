import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf"
  ];
  if (allowed.includes(file.mimetype) || file.originalname.endsWith(".pdf")) {
    cb(null, true);
  } else {
    cb(new Error("Only images (PNG, JPG, WebP) and PDF documents are allowed"), false);
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB limit
});

