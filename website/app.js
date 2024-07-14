const http2 = require("spdy")
const express = require("express")
const fs = require("fs")
const path = require('path');
const request = require('request');
const app = express();
const multer  = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('file')
    console.log(file)
    cb(null, 'public/web/videos/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage: storage })


let cdn = 'https://localhost:3001';
let reqId = 0;


app.use(async (req, res, next) => {
    reqId++;
    let domain = req.get('cdn');
    console.log('req url', req.url);
    let allowedURL = ['/', '/index.html', '/article-details.html', '/privacy-policy.html', '/terms-conditions.html', '/favicon.ico','/about.html', '/contact.html', '/services.html', '/shop.html'];
    if(req.url === '/upload' || req.url === '/videos/' || req.url === '/videos'){
      next();
    }
    else if((domain === cdn) || (allowedURL.includes(req.url))){
        console.log('cdn matched')
        next();
    }
    else{
        if(res.push){
          let cdnURL = cdn+req.url;
          console.log('cdn URL', cdnURL);
          request(cdnURL).pipe(res);
        }
    }
})

const videosDirectory = path.join(__dirname, 'public/web/videos');

app.get('/videos', (req, res) => {
  // Read the files in the "videos" directory
  fs.readdir(videosDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Unable to read the directory' });
    }

    const videoLinks = files.map(file => `/videos/${file}`);
    res.json({ videoLinks });
  });
});


app.use(express.static(path.join(__dirname, 'public/web')));

app.post('/upload', upload.single('static_file'), function (req, res, next) {
  // req.file is the `videofile` file
  // req.body will hold the text fields, if there were any
  console.log('req.files')
  console.log(req.file)
  console.log(req.body)
  res.end('success')
})

app.get("*", async (req, res) => {
    res.end(fs.readFileSync(__dirname + "/public/web/index.html"));
})

http2.createServer(
  {
    key: fs.readFileSync("./server.key"),
    cert: fs.readFileSync("./server.crt")
  },
  app
).listen(3002, (err) => {
  if(err){
    throw new Error(err)
  }
  console.log("Website running on port 3002")
})
