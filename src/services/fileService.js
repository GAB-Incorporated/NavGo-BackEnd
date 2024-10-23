import { Storage } from '@google-cloud/storage';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const BUCKET_NAME = 'navgo-etec-bucket'; 

const keyFilename = path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH);

const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: keyFilename
});

async function uploadFile(classDirectory, file) {
    const bucket = storage.bucket(BUCKET_NAME);
    const destination = `${classDirectory}/${file.originalname}`; // originalname é propriedade do multer

    try {

        // Usa um buffer e cria uma 'stream'
        const fileUpload = bucket.file(destination);
        const stream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype,
            },
        });
        stream.end(file.buffer);

        // Aguarda o resultado
        await new Promise((resolve, reject) => {
            stream.on('finish', resolve);
            stream.on('error', reject);
        });

        console.log(`Arquivo ${file.originalname} enviado para o bucket ${BUCKET_NAME} no diretório ${classDirectory}`);
    } catch (error) {
        throw new Error('Erro ao enviar arquivo: ' + error.message);
    }
}

async function generateSignedUrl(fileName) {
    const options = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000, // 60 min
    };

    const [url] = await storage
        .bucket(BUCKET_NAME)
        .file(fileName)
        .getSignedUrl(options);

    return url;
}

async function listFiles(dirName) {
    try {
        const [files] = await storage.bucket(BUCKET_NAME).getFiles({
            prefix: dirName,
        });

        // Cria url de leitura
        const signedFiles = await Promise.all(files.map(async (file) => {
            const signedUrl = await generateSignedUrl(file.name); 
            return {
                name: file.name.replace(dirName, ''), 
                url: signedUrl 
            };
        }));

        return signedFiles;
    } catch (error) {
        throw new Error(`Erro ao listar arquivos no diretório ${dirName}: ${error.message}`);
    }
}


// Implementar talvez para download sem intermédio?
//
// async function downloadFile(bucketName, fileName) {
//     const bucket = storage.bucket(bucketName);
//     const destination = path.join(__dirname, '..', 'downloads', fileName);
//     try {
//         await bucket.file(fileName).download({ destination });
//         console.log(`Arquivo ${fileName} baixado para ${destination}`);
//         return destination;
//     } catch (error) {
//         throw new Error('Erro ao baixar arquivo: ' + error.message);
//     }
// }

export default { uploadFile, listFiles, generateSignedUrl };