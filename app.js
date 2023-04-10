const QUERY = require("./query.js");
const { config } = require("./db.js");
const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

function handle(req, res) {
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

            let query = QUERY.getCard(cardId);
            query += QUERY.getGate(gateId);
            console.log(query);

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

                let is_aktif = QUERY.checkData(data);

                if (req.path == '/masuk') {
                    let entry = QUERY.entryQuery(gateId, cardId, is_aktif);
                    let request = new Request(entry, function (err, rowCount, rows) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Error inserting data into database');
                        }
                        console.log(rowCount + ' row(s) inserted');
                        // connection.close();
                        if (rowCount == 0) {
                            return res.status(200).send('0');
                        } else {
                            return res.status(200).send('1');
                        }
                    });

                    request.on('requestCompleted', function () {
                        connection.close();
                    });
                } else if (req.path == '/keluar') {
                    let exit = QUERY.exitQuery(gateId, cardId, is_aktif);
                    let request = new Request(exit, function (err, rowCount, rows) {
                        if (err) {
                            console.log(err);
                            return res.status(500).send('Error inserting data into database');
                        }
                        console.log(rowCount + ' row(s) inserted');
                        // connection.close();
                        if (rowCount == 0) {
                            return res.status(200).send('0');
                        } else {
                            return res.status(200).send('1');
                        }
                    });

                    request.on('requestCompleted', function () {
                        connection.close();
                    });
                }

                // return res.status(200).send(is_aktif);
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
};

function handleEntry(req, res) {
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

            let query = QUERY.getCard(cardId);
            query += QUERY.getGate(gateId);
            console.log(query);

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

                let is_aktif = QUERY.checkData(data);
                console.log('is_aktif: ', is_aktif);
                let entry = QUERY.entryQuery(gateId, cardId, is_aktif);
                console.log('entry: ', entry);

                let insertRequest = new Request(entry, function (err, rowCount) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Error inserting data into database');
                    }
                    console.log(rowCount + ' row(s) inserted');
                    return res.status(200).send('1');
                });

                connection.execSql(insertRequest);

                insertRequest.on('requestCompleted', function () {
                    connection.close();
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
};

function handleExit(req, res) {
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

            let query = QUERY.getCard(cardId);
            query += QUERY.getGate(gateId);
            console.log(query);

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

                let is_aktif = QUERY.checkData(data);
                console.log('is_aktif: ', is_aktif);
                let entry = QUERY.exitQuery(gateId, cardId, is_aktif);
                console.log('entry: ', entry);

                let insertRequest = new Request(entry, function (err, rowCount) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send('Error inserting data into database');
                    }
                    console.log(rowCount + ' row(s) inserted');
                    return res.status(200).send('1');
                });

                connection.execSql(insertRequest);

                insertRequest.on('requestCompleted', function () {
                    connection.close();
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
};

function insertData(req, res) {
    try {
        let connection = new Connection(config);
        connection.on('connect', function (err) {
            if (err) {
                console.log(err);
                return res.status(500).send({
                    message: 'Error connecting to database'
                });
            }

            let query = QUERY.insertQuery();

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
};

function getData(req, res) {
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
                "SELECT * from dbo.log_keluar",
                // "SELECT * from ref.tipe_gate",
                // "SELECT * from dbo.kartu_akses",
                // `SELECT TABLE_NAME
                // FROM INFORMATION_SCHEMA.TABLES
                // WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='GATE_DEV';
                // `,
                // `SELECT COLUMN_NAME 
                // FROM INFORMATION_SCHEMA.COLUMNS 
                // WHERE TABLE_NAME = 'log_keluar';`,
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
};

module.exports = { handle, insertData, getData, handleEntry, handleExit };