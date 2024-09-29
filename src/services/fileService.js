import { Storage } from "@google-cloud/storage";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH) 
});

async function uploadFile(bucketName, file) {
    const bucket = storage.bucket(bucketName);
    const destination = path.basename(file.originalname);
    try {
        await bucket.upload(file.path, { destination });
        console.log(`Arquivo ${file.originalname} enviado para o bucket ${bucketName}`);
    } catch (error) {
        throw new Error('Erro ao enviar arquivo: ' + error.message);
    }
}

async function downloadFile(bucketName, fileName) {
    const bucket = storage.bucket(bucketName);
    const destination = path.join(__dirname, '..', 'downloads', fileName);
    try {
        await bucket.file(fileName).download({ destination });
        console.log(`Arquivo ${fileName} baixado para ${destination}`);
        return destination;
    } catch (error) {
        throw new Error('Erro ao baixar arquivo: ' + error.message);
    }
}

export default { uploadFile, downloadFile };
