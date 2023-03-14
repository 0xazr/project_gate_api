class Middelware {
    checkParams(req, res, next) {
        // const studentId = req.params.student_id;
        const gateId = req.params.gate_id;
        const cardId = req.params.card_id;

        const invalidChars = /[^a-zA-Z0-9_-]/;
        // if (invalidChars.test(studentId)) {
        //     return res.status(400).json({ error: 'Invalid student ID' });
        // }

        if (invalidChars.test(gateId)) {
            return res.status(400).json({ error: 'Invalid student ID' });
        }

        if (invalidChars.test(cardId)) {
            return res.status(400).json({ error: 'Invalid student ID' });
        }

        next();
    }

    validateParams(req, res, next) {
        const invalidParams = Object.values(req.body).filter(param => /['";]/.test(param));
        if (invalidParams.length > 0) {
            res.status(400).json({ error: 'Invalid parameter(s) detected' });
        } else {
            next();
        }
    }
}

module.exports = new Middelware();