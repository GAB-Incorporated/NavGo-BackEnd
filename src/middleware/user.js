function verifyProfessor(req, res, next) {

    if (req.user.user_type !== 'professor') {
        return res.status(403).send({ message: 'Acesso negado: apenas professores podem realizar esta ação.' });
    }
    next();
}

function verifyStudent(req, res, next) {

    if (req.user.user_type !== 'student') {
        return res.status(403).send({ message: 'Acesso negado: apenas estudantes podem realizar esta ação.' });
    }
    next();
}

function verifyAdministrator(req, res, next) {

    if (req.user.user_type !== 'ADMINISTRATOR') {
        return res.status(403).send({ message: 'Acesso negado: apenas administradores podem realizar essa ação.' });
    }
    next();
}

export default { verifyProfessor, verifyStudent, verifyAdministrator };
