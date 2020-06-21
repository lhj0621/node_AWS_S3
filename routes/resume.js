var express = require('express');
var router = express.Router();
const resume = require('../models/resume');
const path = require("path");
const multer = require("multer");
const multerS3 = require('multer-s3');
const AWS = require("aws-sdk");
var s3 = new AWS.S3();
const now = new Date();
const itemKey = 'upload/' + now.getHours() + now.getMinutes() + now.getSeconds() + Math.floor(Math.random() * 1000);

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "idu-2020-0709",
    key: function (req, file, cb) {
      let extension = path.extname(file.originalname) //확장자 
      cb(null, itemKey + extension) // 파일 저장 이름
    },
    acl: 'public-read',
    mimetype: 'image/jpeg',
    location: "/upload"
  })
})
router.get('/', resumeList);
router.get('/imgupload', imguploadform);
router.post('/imgupload', upload.single('img'), addimg);

module.exports = router;

async function resumeList(req, res) {
  const resumeList = await resume.resumeList();
  const result = { count: resumeList.length,data: resumeList };
  res.render('index', { result: result });
}

function imguploadform(req, res) {
  res.render('img_upload');
}

async function addimg(req, res) {
  const title = req.body.title;
  const img_name = req.file.key;
  const img_url = req.file.location;
  const data = {
    "title": title,
    "img_name" : img_name,
    "img_url" : img_url,
  };
  console.log(data);
  try {
      const result = await resume.addresume(data);
      res.redirect('/resume/');
  } catch (error) {
      res.status(500).send(error.msg);
  }
}


