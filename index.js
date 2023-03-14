const SETUP = require("./setup.json");
const MIDDLEWARE = require("./middleware.js");
const APP = require("./app.js");
const { config } = require("./db.js");

const express = require('express');
let Util = require("util");
const app = express();

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

let connection = new Connection(config);
app.use(express.json());

app.get('/', MIDDLEWARE.validateParams, (req, res) => {
    try {
        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let request = new Request(
                "select * from student",
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            message: 'Error get data from database'
                        });
                    }
                    console.log(rowCount + ' row(s) returned');
                }
            );

            let result = "";
            request.on('row', function (columns) {
                columns.forEach(function (column) {
                    if (column.value === null) {
                        console.log('NULL');
                    } else {
                        result += column.value + " ";
                    }
                });
                console.log(result);
                result = "";
            });
            connection.execSql(request);

            res.status(200).send({
                message: "Success get data"
            });
        });

        connection.connect();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.put('/masuk/:gate_id/:card_id', MIDDLEWARE.checkParams, (req, res) => {
    const gateId = req.params.gate_id;
    const cardId = req.params.card_id;
    // const studentId = req.params.student_id;

    try {
        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = APP.updateQuery(gateId, cardId);
            console.log(query);

            let request = new Request(
                Util.format(query),
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            message: 'Error updating data into database'
                        });
                    }
                    console.log(rowCount + ' row(s) inserted');
                });

            request.on('doneProc', function () {
                console.log("Querying is done...");
            })

            connection.execSql(request);
            return res.status(200).send({
                message: `Masuk gate in ${gateId} & ${cardId}`
            });
        });

        connection.connect();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.put('/keluar/:gate_id/:card_id', MIDDLEWARE.checkParams, (req, res) => {
    const gateId = req.params.gate_id;
    const cardId = req.params.card_id;

    try {
        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = APP.exitQuery(gateId, cardId);
            console.log(query);

            let request = new Request(
                Util.format(query),
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            message: 'Error updating data into database'
                        });
                    }
                    console.log(rowCount + ' row(s) inserted');
                });

            request.on('doneProc', function () {
                console.log("Querying is done...");
            })

            connection.execSql(request);
            return res.status(200).send({
                message: `Keluar gate in ${gateId} & ${cardId}`
            });
        });

        connection.connect();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.post('/insert_data', MIDDLEWARE.validateParams, (req, res) => {
    try {
        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = APP.insertQuery();

            let request = new Request(query, function (err, rowCount, rows) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: 'Error inserting data into database'
                    });
                }
                console.log(rowCount + ' row(s) inserted');
                connection.close();
            });

            request.on('done', function (rowCount, more) {
                console.log("Insert is done...");
            });

            connection.execSql(request);
            return res.status(200).send({
                message: 'Success Insert'
            });
        });
        connection.connect();
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.listen(SETUP.port_api, () => {
    console.log(`Server started on port ${SETUP.port_api}`);
});