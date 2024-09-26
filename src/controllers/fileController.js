import express from "express";
import fileService from "../services/fileService.js";

const routes = express.Router();

routes.post('/upload', async (req, res) => {
    const { file } = req;
    const bucketName = req.user.turmaBucket;  //ALINHAR CAMINHO DO BUCKET
    try {
        await fileService.uploadFile(bucketName, file);
        return res.status(200).send({ message: 'Arquivo enviado com sucesso' });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer upload do arquivo', error: error.message });
    }
});

routes.get('/download', async (req, res) => {
    const { fileName } = req.query;
    const bucketName = req.user.turmaBucket;  //ALINHAR CAMINHO DO BUCKET
    try {
        const filePath = await fileService.downloadFile(bucketName, fileName);
        res.download(filePath);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer download do arquivo', error: error.message });
    }
});

export default routes;