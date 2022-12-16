const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const uploader = upload.single("image");

module.exports = {uploader};