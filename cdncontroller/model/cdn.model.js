'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let schema = new Schema({
    website: String,
    zone: String,
    url: String,
    fileName: String,
    deleted: {type: Boolean, default: false},
    createdAt: {type: Date, default: new Date()},
    updatedAt: Date
});

let cdn = mongoose.model('cdns', schema);

module.exports = cdn;