const SETUP = require("./setup.json");
const MIDDLEWARE = require("./middleware.js");
const APP = require("./app.js");
const { config } = require("./db.js");

const express = require('express');
let Util = require("util");
const app = express();

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

app.use(express.json());

app.get('/', MIDDLEWARE.validateParams, (req, res) => {
    try {
        let connection = new Connection(config);
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
    try {
        let connection = new Connection(config);
        const gateId = req.params.gate_id;
        const cardId = req.params.card_id;

        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = APP.getCard(cardId);
            query += APP.getGate(gateId);

            let data = [];
            let request = new Request(query, function (err, rowCount, rows) {
                if (err) {
                    console.log(err);
                    return res.status(500).send({
                        message: 'Error getting data from database'
                    });
                }
                console.log(rowCount + ' row(s) returned');

                if (rowCount == 1 || rowCount == 0) {
                    return res.status(404).send({
                        message: `id_kartu_akses / id_tipe_gate is not valid`
                    });
                }

                let is_aktif = APP.checkData(data);

                return res.status(200).send({
                    message: `Masuk gate ${gateId} dengan kartu akses ${cardId}`,
                    is_aktif: is_aktif
                });
            });

            request.on('row', function (columns) {
                let item = {};
                columns.forEach(function (column) {
                    if (column.value === null) {
                        item[column.metadata.colName] = '';
                    } else {
                        item[column.metadata.colName] = column.value;
                    }
                });
                data.push(item);
            });

            request.on('requestCompleted', function () {
                connection.close();
            });

            request.on('error', function (err) {
                console.log(err);
                connection.close();
                return res.status(500).send({
                    message: 'Internal server error'
                });
            });

            connection.execSql(request);
        });

        connection.connect();
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.put('/keluar/:gate_id/:card_id', MIDDLEWARE.checkParams, (req, res) => {
    try {
        let connection = new Connection(config);
        const gateId = req.params.gate_id;
        const cardId = req.params.card_id;

        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = APP.exitQuery(gateId, cardId);

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
                    connection.close();
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
        let connection = new Connection(config);
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