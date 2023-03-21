const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser')
const multer = require('multer');
var fs = require('fs');

app.use(bodyParser.urlencoded({ extended: true }))

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        dir = '/uploads';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true })
        }

        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        let fileName = file.originalname;
        let arr = fileName.split('.');
        let newFileName = arr[0] + '-' + Date.now() + '.' + arr[1];

        //chi được dùng file đuôi jpeg
        let math = "image/jpeg";
        if (math.indexOf(file.mimetype) === -1) {
            let errMess = `${file.originalname} khong dung ding dang`;
            return cb(errMess, null);
        }
        cb(null, newFileName)
    }
})

var upload = multer({ storage: storage, limits: { fileSize: 1024* 1024 * 1 } })
var uploadd = upload.single('myFile');

app.post('/uploadfile', function (req, res) {
    uploadd(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            return res.send('Kich thuoc file lon hon 1MB');
        }

        if (err) {
            return res.send(`Error: ${err}`);
        }

        console.log(req.file);
        res.send('------Upload Successfully-----');
    });
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});