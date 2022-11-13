require('dotenv').config();
const { CloudantV1 } = require('@ibm-cloud/cloudant');
const { exists } = require('fs');

const client = CloudantV1.newInstance({});

// Call cloudant function to get all docs 
function getAllDocs(dbName) {
    return (() => {
        return client.postAllDocs({
            db: dbName,
            includeDocs: true,
        });
    })()
        .then(res => console.log(res.result.rows))
        .catch(err => console.log(err));
}

// Call cloudant to create document in database
function createDoc(docParams, dbName) {
    return (() => {
        return client.postDocument({
            db: dbName,
            document: docParams,
        });
    })()
        .then(res => console.log(res.result))
        .catch(err => console.log("Error occured."));
}

// Call cloudant to delete a document
async function deleteDoc(docId, dbName) {
    try {
        const document = (
            await client.getDocument({
                docId: docId,
                db: dbName,
            })
        ).result;

        await client.deleteDocument({
            db: dbName,
            docId: document._id,
            rev: document._rev,
        });
        console.log('Document deleted successfully...');
    } catch (err) {
        if (err.code === 404) {
            console.log("Document doesn't exists");
        }
    }
}

// Call cloudant to get a document
async function getDoc(docId, dbName) {
    await (async () => {
        try {
            const document = (
                await client.getDocument({
                    docId: docId,
                    db: dbName,
                })
            ).result;
            return await document;
        } catch (err) {
            if (err.code === 404) {
                console.log("Document doesn't exist");
            }
        }
    })()
        .then(res => console.log(res))
        .catch(err => console.log(err));
}

// Call cloudant to create a database
async function createDb(dbName) {
    try {
        const putDatabaseResult = (
            await client.putDatabase({
                db: dbName,
            })
        ).result;
        if (putDatabaseResult.ok) {
            console.log(`"${dbName}" database created.`);
        }
    } catch (err) {
        if (err.code === 412) {
            console.log(
                `Cannot create "${dbName}" database, it already exists.`
            );
        }
    }
}


// Call cloudant to update a document
async function updateDoc(docId, updatedDoc, dbName) {
    try {
            await client.postDocument({
                db: dbName,
                document: updatedDoc,
            })
        console.log("Document updated successfully...");
    } catch (err) {
        if (err.code === 404) {
            console.log("Cannot update document because either database or the document was not found.");
        }else{
            console.log(err);
        }
    }
}

// updateDoc("Names", {_id: "Names", _rev:"4-cfd151eadbd90c312877b6d356726074", "name": "test+"}, "test");
// createDb('test7');
// getDoc("Names", "test");
// deleteDoc("Names", "test");
// createDoc({ _id: "Names", "name": "test-" }, 'test');


module.exports = { getAllDocs, createDoc, deleteDoc, getDoc, createDb, updateDoc };

