let path = require('path');
let fs = require('fs');
let config = require('./config/config');
const axios = require('axios');
let mime = require('mime');
const rimraf = require("rimraf");
const downloadDir = '../edgeservers/';


exports.storeFile = (fileName, bucket) => {
    const fileExt = fileName.split('/')[0];
    const serverDir = downloadDir + bucket + '/' + fileExt;
    const filePath = path.join(serverDir, fileName.split('/')[1]);
    if (!fs.existsSync(serverDir)) {
        fs.mkdirSync(serverDir, { recursive: true });
    }      
    let fileUrl = `${config.websiteURL}/${fileName}`;
    const writer = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        const axiosInstance = axios.create({
            headers: {cdn: 'https://localhost:3001'},
        });
          
        axiosInstance
        .get(fileUrl, { responseType: 'stream' })
        .then((response) => {
          response.data.pipe(writer);
      
          // Handle the completion of the download
          writer.on('finish', () => {
            console.log(`File downloaded to ${filePath}`);
            resolve(true);
          });
      
          // Handle any errors during the download
          writer.on('error', (err) => {
            console.error('Error downloading the file:', err);
            resolve(false);
          });
        })
        .catch((err) => {
          console.error('Error making the HTTP request:', err);
          resolve(false);
        });
    
    });
}
 

exports.getEdgeServerBucket = (zone) => {
    if(zone === 'Delhi'){
        return 'e1-server';
    }
    else if(zone === 'Germeny'){
        return 'e2-server';
    }
    else if(zone === 'Montreal'){
        return 'e3-server';
    }
}   

exports.typeCheck = (fileName) => {
    let ext = path.extname(fileName).split('.').pop();
    let contype = mime.getType(ext); 
    let contentType;
    if(contype){
        if(contype.includes('img') || contype.includes('image')){
            contentType = 'img';
        }
        else if(contype.includes('video') || contype.includes('media')){
            contentType = 'video';
        }
        else if(contype.includes('javascript')){
            contentType = 'js';
        }
        else if(contype.includes('css')){
            contentType = 'css';
        }
        console.log(`Requested File Name: ${fileName}`);
        console.log(`Type of requested content: ${contype}`);
    }
    return contype;
}



exports.deleteFiles = async (req, res) => {
    let edgeServers = config.edgeServerLoc;
    for(let e of edgeServers){
        console.log(`Edge Server ${e.zone}`);
        const filePath = path.join(e.url, e.bucket);
        if(fs.existsSync(filePath)){
            rimraf.sync(filePath);
        }
        if (!fs.existsSync(filePath)){
            fs.mkdirSync(filePath);
        }
    }
    res.status(200).jsonp({message: 'Deleted all the cached data successfully', status: 'success'});
}


