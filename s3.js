require('dotenv').config();
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

AWS.config.update({ region: process.env.AWS_BUCKET_REGION });
const s3 = new AWS.S3();

const bucketName = process.env.AWS_BUCKET_NAME

// Call S3 to list the buckets
function listBucketsFromS3() {
    s3.listBuckets(function (err, data) {
        if (err) {
            console.log("Error - ", err);
        } else {
            console.log("Success ", data.Buckets);
            return data.Buckets;
        }
    });
}

// Call S3 to Upload a file to bucket
function uploadObjectToS3(file) {
    let uploadParams = {
        Bucket: bucketName,
        Key: path.parse(path.basename(file)).name,
        Body: fs.createReadStream(file)
    };

    s3.upload(uploadParams, function (err, data) {
        if (err) {
            console.log("Error - ", err);
        } if (data) {
            console.log("Upload Success - ", data.Location);
        }
    });
}

// Call S3 to obtain a list of the objects in the bucket
// async function listObjectsFromS3() {
    // let bucketParams = {
    //     Bucket: bucketName,
    // };
//     const response = await s3.listObjects(bucketParams).promise();
//     return response.Contents;
// }

// Call S3 to obtain a list of the objects in the bucket
async function listObjectsFromS3() {
    let bucketParams = {
        Bucket: bucketName,
    };
    let isTruncated = true;
    const elements = [];
    let marker;
    while (isTruncated) {
        if (marker) bucketParams.Marker = marker;
        try {
            const response = await s3.listObjects(bucketParams).promise();
            response.Contents.forEach(item => {
                elements.push(item);
            });
            isTruncated = response.IsTruncated;
            if (isTruncated) {
                marker = response.Contents.slice(-1)[0].Key;
            }
        } catch (error) {
            throw error;
        }
    }
    return elements;
}

// Call S3 to delete a bucket
function deleteBucketFromS3() {
    let bucketParams = {
        Bucket: bucketName,
    };
    s3.deleteBucket(bucketParams, function (err, data) {
        if (err) {
            console.log("Error - ", err);
        } else {
            console.log("Success - ", data);
        }
    });
}

// Call S3 to get a object
function getObjectFromS3(key) {
    let getParams = {
        Bucket: bucketName,
        Key: key
    }
    s3.getObject(getParams, function (err, data) {
        if (err) {
            console.log("Error - ", err);
        } else {
            console.log("Success - ", data);
            fs.writeFile('outout.jpeg', data.Body, (err) => {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}


module.exports = { listBucketsFromS3, uploadObjectToS3, listObjectsFromS3, getObjectFromS3, deleteBucketFromS3 };
