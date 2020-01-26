const multer = require('multer');
const moment = require('moment');

const storage1 = multer.diskStorage({
  destination: function(req, file, cb) {
      try {
        var m_typ = req.query.type;
        cb(null, m_typ);  // 파일이 저장되는 경로입니다.
      } catch (error) {
        console.log(error) 
      }
    },
    filename: function(req, file, cb) {
      cb(null, moment().format('YYYYMMDDHHmmss') + "_" + file.originalname);  // 저장되는 파일명
    }
});

const upload = multer({ storage: storage1 }).single("file");   // single : 하나의 파일업로드 할때

module.exports = upload;