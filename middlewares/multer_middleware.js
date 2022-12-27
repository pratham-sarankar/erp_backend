const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })

const uploader = upload.single("file");

module.exports = {uploader};