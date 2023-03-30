const express = require('express');
const SETUP = require("./setup.json");
const MIDDLEWARE = require("./middleware.js");
const APP = require("./query.js");
const { config } = require("./db.js");
const bodyParser = require('body-parser');
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

            let data = [];
            let request = new Request(
                // "SELECT * from dbo.register_gate",
                // "SELECT * from ref.tipe_gate",
                // "SELECT * from dbo.kartu_akses",
                `SELECT TABLE_NAME
                FROM INFORMATION_SCHEMA.TABLES
                WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='GATE_DEV';
                `,
                function (err, rowCount, rows) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            message: 'Error get data from database'
                        });
                    }
                    console.log(rowCount + ' row(s) returned');

                    return res.status(200).send({
                        message: `Success get data from database`,
                        data
                    });
                }
            );

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
                    message: 'Internal server error',
                });
            });

            connection.execSql(request);
        });

        connection.connect();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.get(['/masuk', '/keluar'], MIDDLEWARE.checkParams, (req, res) => {
    res.set('Content-Type', 'text/plain');
    try {
        let connection = new Connection(config);
        const gateId = req.body.gate_id;
        const cardId = req.body.card_id;

        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = APP.getCard(cardId);
            query += APP.getGate(gateId);
            console.log(query)

            let data = [];
            let request = new Request(query, function (err, rowCount, rows) {
                if (err) {
                    console.log(err);
                    return res.status(500).send('Error getting data from database');
                }
                console.log(rowCount + ' row(s) returned');

                if (rowCount == 1 || rowCount == 0) {
                    return res.status(200).send('0');
                }

                let is_aktif = APP.checkData(data);

                return res.status(200).send(is_aktif);
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
                return res.status(500).send('Error connecting to database');
            });

            connection.execSql(request);
        });

        connection.connect();
    } catch (error) {
        console.log(error);
        return res.status(500).send('Internal server error');
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