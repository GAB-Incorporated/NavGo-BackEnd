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
    const userType = req.user.user_type;
    const file = req.file; 
    // Objeto file é criado pelo multer, a partir da 'file' no body da req

    try {

        const bucketName = await userService.verifyClass(userId, classId, userType);

        if (!bucketName) {
            return res.status(403).send({ message: 'Acesso negado à turma' });
        }

        await fileService.uploadFile(bucketName, file);
        return res.status(200).send({ message: 'Arquivo enviado com sucesso' });
    } catch (error) {
        return res.status(500).send({ message: 'Erro ao fazer upload do arquivo', error: error.message });
    }
});

routes.get('/:classId/lastFile', jwt.verifyToken, async (req, res) => {
    const { classId } = req.params;
    const userId = req.user.id_usuario;
    const userType = req.user.user_type;
    try {
        const bucketName = await userService.verifyClass(userId, classId, userType);

        if (!bucketName) {
            return res.status(403).send({ message: 'Acesso negado à turma' });
        }

        const lastFile = await fileService.getLastFileForClass(bucketName);
        return res.status(200).json(lastFile);
    } catch (error) {
        return res.status(500).json({ message: 'Erro ao obter o último arquivo', error: error.message });
    }
});

routes.get('/:classId', jwt.verifyToken, async (req, res) => {
    const classId = req.params.classId;
    const userId = req.user.id_usuario;
    const userType = req.user.user_type;

    try {

        const bucketName = await userService.verifyClass(userId, classId, userType);

        if (!bucketName) {
            return res.status(403).send({ message: 'Acesso negado à turma' });
        }

        const files = await fileService.listFiles(bucketName);
        res.status(200).send( files );
    } catch (error) {
        res.status(500).send({ message: 'Erro ao listar arquivos', error: error.message });
    }
});

// Completamente quebrado
// routes.get('/download', async (req, res) => {

//     const { fileName, turmaBucket } = req.query;
//     try {
//         const filePath = await fileService.downloadFile(turmaBucket, fileName);
//         res.download(filePath);
//     } catch (error) {
//         return res.status(500).send({ message: 'Erro ao fazer download do arquivo', error: error.message });
//     }
// });

export default routes;