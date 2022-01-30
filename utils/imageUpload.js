const multer = require("multer");
const path = require('path')

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const storage = multer.diskStorage({
    destination: './images',
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-test` + 
    path.extname(file.originalname));
    }
});

const uploadFile = multer({ storage: storage});
module.exports = {uploadFile};