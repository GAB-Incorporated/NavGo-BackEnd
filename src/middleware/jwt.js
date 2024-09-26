import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function createTokenJWT({id_usuario, nome, email, user_type}) {
    
    const securityKey = process.env.SECURITY_KEY;

    const token = jwt.sign(
        {id_usuario, nome, email, user_type},   
        securityKey,
        {expiresIn: 3600 * 8}
    )

    return token;
}

function verifyToken(req, res, next) {
    const securityKey = process.env.SECURITY_KEY;

    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: "Token não fornecido." });
    }

    jwt.verify(token, securityKey, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Token inválido", err });
        }
        
        req.user = decoded;
        next();
    });
}

export default {createTokenJWT, verifyToken};