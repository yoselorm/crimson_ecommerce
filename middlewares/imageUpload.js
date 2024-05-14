const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.imageUpload = multer({
    storage: multer.diskStorage({}),
     fileFilter:(req,file,cb)=>{
        let ext = path.extname(file.originalname)
        if(ext !== ".jpeg" && ext !== ".png" && ext!== ".jpg"){
            cb(new Error("Unsupported file format"),false)
            return
        }
        cb(null,true)
     },
     limit:{fileSize: 9300000}
})

exports.imageSize = async (req, res, next) => {
    if (!req.file) return next();

    await sharp(req.file.path)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 98 })
        .toFile(`images/products/${req.file.filename}`);

    fs.unlinkSync(req.file.path); 
    next();
};