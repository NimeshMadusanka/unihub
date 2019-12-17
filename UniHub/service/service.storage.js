const { Storage } = require("@google-cloud/storage");
const path = require("path");

const projectId = require("../config/keys").projectId;
const keyFilename = path.resolve("./config/gcs.json");
const storage = new Storage({ projectId, keyFilename });

class GoogleCloudStorageService {

    // Makes an authenticated API request.
    static async uploadFileToGoogleCloudStorage(bucketName, uploaded) {

        const bucket = await storage.bucket(bucketName);

        const gcsname = uploaded.name;
        const file = bucket.file(gcsname);

        const stream = file.createWriteStream({
            metadata: {
                contentType: uploaded.mimetype,
                resumable: false,
                gzip: true
            }
        });

        stream.on('error', (err) => {
            uploaded.cloudStorageError = err;
            console.log(err)
        });

        stream.on('finish', () => {
            uploaded.cloudStorageObject = gcsname;
            file.makePublic().then(() => {
                uploaded.cloudStoragePublicUrl = `https://storage.googleapis.com/${bucketName}/${gcsname}`;
            });
        });

        stream.end(uploaded.data);

    }

    static getPublicUrl(bucketName, fileName) {

        return `https://storage.googleapis.com/${bucketName}/${fileName}`;

    }

}

module.exports = GoogleCloudStorageService;