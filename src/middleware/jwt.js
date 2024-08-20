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

function verifyToken() {
    const securityKey = process.env.SECURITY_KEY;

    const token = request.headers.authorization

    jwt.verify(token, securityKey, (err, decode) => {
        if (err){
            return response.status(401).send({message: "Token inválido", err})
        }
        next();
    })
}

export default {createTokenJWT, verifyToken};