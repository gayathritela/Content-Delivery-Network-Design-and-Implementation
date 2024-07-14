'use strict';

let express = require('express');
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let cors = require('cors');
let cookieParser = require('cookie-parser');
let path = require('path');
let fs = require('fs');
let util = require('util');
const http2 = require("spdy")
const cron = require('node-cron');
const fse = require('fs-extra');

let config = require('./config/config');
let routes = require('./routes/cdn.route');
let controller = require('./controller/cdn.controller');
let utilHelper = require('./util');
let dbUrl = "mongodb://127.0.0.1/" + config.db;
mongoose.connect(dbUrl,{ useNewUrlParser: true, useUnifiedTopology: true });

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'console.log'), {flags : 'a'});
let logStdout = process.stdout;
console.log = function(d) { 
    accessLogStream.write(util.format(d) + '\n');
    logStdout.write(util.format(d) + '\n');
};

let app = express();

app.use(cors());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ extended: true, limit: '50mb' }));

app.use('/', routes);

app.get('/delete',
    (req, res, next) => {
        fs.writeFileSync(path.join(__dirname, 'console.log'), '');
        next();
    },
    controller.delete,
    utilHelper.deleteFiles
);

app.get('/getlogs', 
    (req, res) => {
        let read = fs.createReadStream(path.join(__dirname, 'console.log'));
        read.pipe(res);
    }
);

cron.schedule('*/10 * * * * *', () =>  {
  const buckets = [config.edgeServerLoc[0].bucket, config.edgeServerLoc[1].bucket, config.edgeServerLoc[2].bucket];
  const emptyDir = [];
  let src;
  for(let i=0; i<buckets.length; i++){
    if(isEmpty(buckets[i])){
      emptyDir.push(i);
    }
    else{
      src = i;
    }
  }
  for(let d of emptyDir) {
    let srcDir = path.join('../edgeservers/', buckets[src]);
    let destDir = path.join('../edgeservers/', buckets[d]);
    fse.copy(srcDir, destDir, {recursive: true} ,function (err) {
      if (err) return console.error(err)
    });
  }
});

http2.createServer(
    {
      key: fs.readFileSync("./server.key"),
      cert: fs.readFileSync("./server.crt")
    },
    app
  ).listen(3001, (err) => {
    if(err){
      throw new Error(err)
    }
    console.log("CDN server started on port 3001")
})


function isEmpty(pathVal) {
  pathVal = path.join('../edgeservers/', pathVal);
  return fs.readdirSync(pathVal).length === 0;
}
  
