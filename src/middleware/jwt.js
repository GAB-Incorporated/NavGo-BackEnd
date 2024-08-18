import jwt from "jsonwebtoken";

function createTokenJWT({id_usuario, nome, email, user_type}) {
    
    const securityKey = "etecembu@123"

    const token = jwt.sign(
        {id_usuario, nome, email, user_type},
        securityKey,
        {expiresIn: 3600}
    )

    return token;
}

function verifyToken() {
    const securityKey = "etecembu@123"

    const token = request.headers.authorization

    jwt.verify(token, securityKey, (err, decode) => {
        if (err){
            return response.status(401).send({message: "Token inválido", err})
        }

        next();

    })
}

export default {createTokenJWT, verifyToken};