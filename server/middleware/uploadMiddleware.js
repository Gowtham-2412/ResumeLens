import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) =>{
        const uniqueName = Date.now() + "-" + file.originalname;

        cb(null, uniqueName)
    }
})

const fileTypes = (req, file, cb) => {
    const allowedTypes = [".pdf", ".docx"];

    const extension = path.extname(file.originalname).toLowerCase();

    if(allowedTypes.includes(extension)) {
        cb(null, true)
    } else {
        cb(new Error("FIle type not supported"), false)
    }
}

const upload = multer({
    storage,
    fileFilter: fileTypes,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
})
export default upload;
