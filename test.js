const s3 = require('./s3');

const path = '/Users/rakeshfiroda/Documents/copy/';

(async() => {
    let obj = await s3.listObjectsFromS3();
    let len = Object.keys(obj).length;
    console.log(len);
})();