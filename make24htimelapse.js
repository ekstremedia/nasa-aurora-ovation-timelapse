'use strict';

const fs = require('fs');
const request = require('request');

let nasaApi = "https://services.swpc.noaa.gov/products/animations/ovation_north_24h.json"

let images;

request.get({
    url: nasaApi,
    json: true,
    headers: {'User-Agent': 'request'}
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      // data is already parsed as JSON:
      images = data;
        gotImages(images)
    }
});

const route = 'https://services.swpc.noaa.gov'

let download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type']);
    // console.log('content-length:', res.headers['content-length']);
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

console.log(new Date().toString())
let ts_hms = new Date()
let day =
ts_hms.getFullYear() + '-' + 
("0" + (ts_hms.getMonth() + 1)).slice(-2) + '-' + 
("0" + (ts_hms.getDate())).slice(-2);

let dir = './images/';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
dir = './images/'+day;

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
function padLeadingZeros(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function gotImages(images) {
    let i = 0;
    images.forEach(image => {
        i++;
        let imageLink = route+image.url
        let fileName = dir+'/'+padLeadingZeros(i,3)+'.jpg'
        // console.log(fileName);
        download(imageLink, fileName, function(){
        })
        // console.log(imageLink)
    });
}

