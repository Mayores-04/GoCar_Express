import multer from 'multer';
import nextConnect from 'next-connect';
import fs from 'fs';
import path from 'path';

// Ensure 'uploads' directory exists
const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to 'uploads' directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9); 
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Add unique suffix to file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Only accept image files
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

    if (mimeType && extname) {
      return cb(null, true);
    } else {
      return cb(new Error('Only image files are allowed!'), false);
    }
  },
});

const handler = nextConnect();

// Use multer middleware to handle image upload
handler.use(upload.single('image')); // 'image' is the field name

// Handle the file upload
handler.post((req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const fileUrl = `/uploads/${uploadedFile.filename}`;
  res.status(200).json({ imageUrl: fileUrl });
});

export default handler;
