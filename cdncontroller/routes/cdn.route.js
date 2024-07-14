'use strict'

let express = require('express');
let router = express.Router();
let config = require('../config/config');
let cdnController = require('../controller/cdn.controller');
let edgeServerLoc = config.edgeServerLoc;
let reqCounter = 0;

router.route('/:filePath/:fileName')
.get(
    (req, res, next) => {
        req.locals = {};
        if(reqCounter > 35){
            reqCounter = 0;
        }
        reqCounter++;
        console.log(`reqCounter ${reqCounter}`)
        if(reqCounter <= 10){
            req.locals.nearestEdge = edgeServerLoc[0];
        }
        else if(reqCounter > 10 && reqCounter <= 20 ){
            req.locals.nearestEdge =  edgeServerLoc[1];
        }
        else if(reqCounter > 20){
            req.locals.nearestEdge = edgeServerLoc[2];
        }
        next();
    },
    cdnController.checkContent,
    cdnController.getFile
);

module.exports = router;

