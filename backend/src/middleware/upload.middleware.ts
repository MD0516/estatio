import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/properties")
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.random() * 1e9}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowed = [".jpg", ".jpeg", ".png", ".webp"]
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowed.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Only image files are allowed"))
    }
}

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
})