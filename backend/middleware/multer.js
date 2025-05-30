import multer from "multer";

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        // console.log(req.files)
        callback(null, file.originalname)
    }
})

const upload = multer({ storage })

export default upload
