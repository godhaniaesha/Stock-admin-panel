const multer = require("multer")
const path = require("path");
const fs = require("fs");
 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log(file)
 
        const filePath = path.join("KAssets", file.fieldname);
        console.log(filePath)
 
        fs.mkdir(filePath, { recursive: true }, (err) => {
            if (err) {
                cb(err, null);
            }
            cb(null, filePath);
        })
 
        // cb(null, '/tmp/my-uploads')
    },
    filename: function (req, file, cb) {
 
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + "-" + file.originalname)
    }
})
 
const upload = multer({ storage: storage })
 
module.exports = upload