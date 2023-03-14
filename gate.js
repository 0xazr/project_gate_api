const CONFIG = require("./config.json");
const express = require('express');
const axios = require('axios');
const app = express();

const Connection = require('tedious').Connection;
const Request = require('tedious').Request;

const config = {
    server: CONFIG.server,
    authentication: {
        type: 'default',
        options: {
            userName: CONFIG.username,
            password: CONFIG.password
        }
    },
    options: {
        encrypt: false,
        database: CONFIG.database,
        connectTimeout: 5000,
        port: CONFIG.port_db,
    }
};

let connection = new Connection(config);
app.use(express.json());

app.get('/', (req, res) => {
    try {
        connection.on('connect', function (err) {
            console.log("Connected");
            let request = new Request(
                "select * from student",
                function (err, rowCount, rows) {
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
                message: "Success"
            });
        });

        connection.connect();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.post('/', async (req, res) => {
    // const gateId = req.query.gate_id;
    // const cardId = req.query.card_id;
    // const studentId = req.body.student_id;
    // console.log(studentId);
    const url = 'http://localhost:8080/card_id=1&gate_id=2';
    const data = {
        card_id: req.body.card_id,
        gate_id: req.body.gate_id
    };
    try {
        const response = await axios.post(url, data);
        console.log(response.data);
        res.send(response.data);
        // connection.on('connect', function (err) {
        //     console.log("Connected");
        //     let request = new Request(
        //         `select * from student where id=${studentId}`,
        //         function (err, rowCount, rows) {
        //             console.log(rowCount + ' row(s) returned');
        //         }
        //     );

        //     let result = "";
        //     request.on('row', function (columns) {
        //         columns.forEach(function (column) {
        //             if (column.value === null) {
        //                 console.log('NULL');
        //             } else {
        //                 result += column.value + " ";
        //             }
        //         });
        //         // console.log(result);
        //         res.send({
        //             data: result
        //         });
        //         result = "";
        //     });
        //     connection.execSql(request);

        //     res.status(200).send({
        //         message: "Success"
        //     });
        // });

        // connection.connect();
    } catch (error) {
        return res.status(500).send({
            message: 'Internal server error'
        });
    }
});

app.listen(CONFIG.port_api, () => {
    console.log(`Server started on port ${CONFIG.port_api}`);
});