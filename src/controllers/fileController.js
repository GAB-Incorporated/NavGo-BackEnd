import express from "express";
import fileService from "../services/fileService.js";

const routes = express.Router();

routes.post('/upload', async (req, res) => {
    const { file, classId } = req.body;
    const userId = req.user.id_usuario;  

    try {
        // Verifica se o user é professor da turma
        const bucketName = await classInfoService.verifyClass(userId, classId);

        if (!bucketName) {
            return res.status(403).send({ message: 'Acesso negado à turma' });
        }

        await fileService.uploadFile(bucketName, file);
        return res.status(200).send({ message: 'Arquivo enviado com sucesso' });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer upload do arquivo', error: error.message });
    }
});

routes.get('/download', async (req, res) => {

    //Passar na URL, ex: /download?fileName=meuarquivo.txt&turmaBucket=nome-do-bucket
    const { fileName, turmaBucket } = req.query;  
    try {
        const filePath = await fileService.downloadFile(turmaBucket, fileName);
        res.download(filePath);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer download do arquivo', error: error.message });
    }
});

export default routes;