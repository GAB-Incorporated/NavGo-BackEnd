import express from "express";
import fileService from "../services/fileService.js";
import userService from "../services/userService.js";
import multer from 'multer';
import jwt from "../middleware/jwt.js";

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const routes = express.Router();

routes.post('/upload', jwt.verifyToken, upload.single('file'), async (req, res) => {
    const classId = req.body.classId;
    const userId = req.user.id_usuario; 
    const file = req.file; 
    // Objeto file é criado pelo multer, a partir da 'file' no body da req

    try {

        const bucketName = await userService.verifyClass(userId, classId);

        if (!bucketName) {
            return res.status(403).send({ message: 'Acesso negado à turma' });
        }

        await fileService.uploadFile(bucketName, file);
        return res.status(200).send({ message: 'Arquivo enviado com sucesso' });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer upload do arquivo', error: error.message });
    }
});

// Completamente quebrado
routes.get('/download', async (req, res) => {

    const { fileName, turmaBucket } = req.query;
    try {
        const filePath = await fileService.downloadFile(turmaBucket, fileName);
        res.download(filePath);
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer download do arquivo', error: error.message });
    }
});

export default routes;