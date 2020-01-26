
var express = require('express');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var swtoolRouter = require("./routes/SwtoolRout");
var fileuploadRouter = require("./routes/UploadRout");

var app = express();

app.use('/', indexRouter);
app.use('/users', usersRouter);

//sw Tool 조회
app.use("/api/Swtool", swtoolRouter);

//파일 업로드
app.use("/api/upload", fileuploadRouter);

//파일 업로드 경로 설정
app.use(express.static("./uploads"));

//Server Home url 호출
app.use("/api/cmpathinfo", cmpathinfo);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));