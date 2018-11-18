const fs = require('fs');
const assert = require('assert');
const isNumber = require('is-number');
let readOffset = function() {
    return new Promise((resolve, reject) => {
        fs.readFile('./offset.txt', 'utf-8', (err, data) => {
            if(!err) {
                resolve(Number(data));
            }else {
                reject(err);
            }
        })
    });
}

let writeOffset = function(offset) {
    assert(isNumber(offset), '[offset]  is number');
    return new Promise((resolve, reject) => {
        fs.writeFile('./offset.txt', offset, (err) => {
            if(!err) {
                resolve(true);
            }else {
                reject(false);
            }
        })
    })
}

module.exports = {
    readOffset,
    writeOffset
}