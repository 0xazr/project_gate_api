const Connection = require("tedious").Connection;
const { faker } = require("@faker-js/faker");
const moment = require("moment");
const uuid = require("uuid");
const fs = require("fs");

class Query {
    datetime_past = faker.date.past();
    datetime_future = faker.date.future();

    nama = faker.name.firstName();
    date_past = moment(this.datetime_past).format("YYYY-MM-DD HH:mm:ss");
    date_future = moment(this.datetime_future).format("YYYY-MM-DD HH:mm:ss");
    num_1 = faker.random.numeric({ bannedDigits: ["0"] });
    num_7 = faker.random.numeric(7);
    num_3 = faker.random.numeric(3);
    company = faker.company.name();
    alamat = faker.address.streetAddress();
    num_10 = faker.random.numeric(10, { bannedDigits: ["0"] });
    aktif = Math.floor(Math.random() * 2);
    updater = uuid.v4();

    insertQuery() {
        let query = "";
        let query_jenis_identitas = `INSERT INTO ref.jenis_identitas (
            id_jenis_identitas,
            nama,
            created_at,
            updated_at,
            expired_at
        ) VALUES `;
        let query_jenis_pengguna = `INSERT INTO ref.jenis_pengguna (
            id_jenis_pengguna,
            nama,
            created_at,
            updated_at,
            expired_at) VALUES `;
        let query_tipe_gate = `INSERT INTO ref.tipe_gate (
            id_tipe_gate,
            nama,
            created_at,
            updated_at,
            expired_at) VALUES `;
        let query_kartu_akses = `INSERT INTO dbo.kartu_akses (
            id_kartu_akses,
            id_pengguna,
            tgl_daftar,
            tgl_aktif,
            tgl_kadaluarsa,
            is_aktif,
            created_at,
            updated_at,
            deleted_at,
            updater) VALUES `;
        let query_pengguna = `INSERT INTO dbo.pengguna (
            id_pengguna,
            id_jenis_pengguna,
            id_jenis_identitas,
            nama,
            no_identitas,
            unit_org,
            alamat,
            nip_baru,
            status_keaktifan,
            created_at,
            updated_at,
            deleted_at,
            updater) VALUES `;

        for (let i = 1; i < 100; i++) {
            // query_student += `(
            //     // ${i}, 
            //     // '${this.nama}', 
            //     // '${this.date_past}', 
            //     // '${this.date_future}'
            // )`;
            // query_student += `(
            //     @id,
            //     @name,
            //     @created_at,
            //     @updated_at
            // )`;
            // query_student += i != 9 ? ",\n\t\t\t" : ";";

            // jenis identitas: 99
            // query_jenis_identitas += `(
            //     ${i},
            //     '${escape(faker.name.firstName())}',
            //     '${moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}'
            // )`;

            // query_jenis_identitas += i != 99 ? ",\n\t\t\t" : ";";

            // jenis_pengguna: 999
            // query_jenis_pengguna += `(
            //     ${i},
            //     '${(faker.name.firstName()).replace(/'/g, "''")}',
            //     '${moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}'
            // )`;

            // query_jenis_pengguna += i != 99 ? ",\n\t\t\t" : ";";

            // tipe gate: 9
            // query_tipe_gate += `(
            //     ${i},
            //     '${faker.name.firstName()}',
            //     '${moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}'
            // )`;

            // query_tipe_gate += i != 9 ? ",\n\t\t\t" : ";";
        }

        for (let i = 1; i < 100; i++) {
            // pengguna
            // id_pengguna: unik
            // id_jenis_pengguna: 999
            // id_jenis_identitas: 99
            // query_pengguna += `(
            //     (newid()),
            //     ${Math.floor(Math.random() * 99) + 1},
            //     ${Math.floor(Math.random() * 99) + 1},
            //     '${(faker.name.firstName()).replace(/'/g, "''")}',
            //     '${faker.random.numeric(24)}',
            //     '${(faker.company.name()).replace(/'/g, "''")}',
            //     '${(faker.address.streetAddress()).replace(/'/g, "''")}',
            //     '${faker.random.numeric(18)}',
            //     '${Math.round(Math.random())}',
            //     '${moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     (newid())
            // )`;
            // query_pengguna += i != 99 ? ",\n\t\t\t" : ";";

            // kartu akses
            // id_kartu_akses: no limit
            // id_pengguna: unik
            // query_kartu_akses += `(
            //     ${i},
            //     (SELECT TOP 1 id_pengguna FROM dbo.pengguna ORDER BY NEWID()),
            //     '${moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${Math.round(Math.random())}',
            //     '${moment(faker.date.past()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     '${moment(faker.date.future()).format("YYYY-MM-DD HH:mm:ss")}',
            //     (newid())
            // )`;
            // query_kartu_akses += i != 99 ? ",\n\t\t\t" : ";";
        }

        // query += query_student;
        // query += query_jenis_identitas;
        // query += query_jenis_pengguna;
        // query += query_tipe_gate;
        // query += query_pengguna;
        // query += query_kartu_akses;
        // fs.writeFileSync("query.txt", query);
        return query;
    }

    getTime() {
        const date = new Date();
        const year = date.getUTCFullYear();
        const month = (`0${date.getUTCMonth() + 1}`).slice(-2);
        const day = (`0${date.getUTCDate()}`).slice(-2);
        const hours = (`0${date.getUTCHours()}`).slice(-2);
        const minutes = (`0${date.getUTCMinutes()}`).slice(-2);
        const seconds = (`0${date.getUTCSeconds()}`).slice(-2);
        const milliseconds = (`00${date.getUTCMilliseconds()}`).slice(-3);

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;

        return formattedDate;
    }

    entryQuery(gateId, cardId, is_valid) {
        let time = this.getTime();
        let bool = is_valid == '0' ? false : true;

        let entry = `INSERT INTO dbo.log_masuk (
            id_kartu_akses,
            id_register_gate,
            date_time,
            is_valid) VALUES (
                '${cardId}',
                ${gateId},
                '${time}',
                '${bool}'
            );`;

        return entry;
    }

    getGate(gateId) {
        let gate = `SELECT * from dbo.register_gate WHERE id_register_gate = ${gateId};`;
        return gate;
    }

    getCard(cardId) {
        let card = `SELECT * from dbo.kartu_akses WHERE id_kartu_akses = '${cardId}';`;
        return card;
    }

    checkData(data) {
        let kartu_akses = data[0];
        let register_gate = data[1];

        let message = '';
        if (kartu_akses.is_aktif == 1 && register_gate) {
            message = '1';
        } else {
            message = '0';
        }

        return message;
    }

    exitQuery(gateId, cardId, is_valid) {
        let time = this.getTime();
        let bool = is_valid == '0' ? false : true;

        let exit = `INSERT INTO dbo.log_keluar (
            id_kartu_akses,
            id_register_gate,
            date_time,
            is_valid) VALUES (
                '${cardId}',
                ${gateId},
                '${time}',
                '${bool}'
            );`;

        return exit;
    }

    insertCardAccess(cardId) {
        let time = this.getTime();

        let card_access = `INSERT INTO dbo.kartu_akses (
            id_kartu_akses,
            id_pengguna,
            tgl_daftar,
            tgl_aktif,
            tgl_kadaluarsa,
            is_aktif,
            created_at,
            updated_at,
            deleted_at,
            updater) VALUES (
                '${cardId}',
                (SELECT TOP 1 id_pengguna FROM dbo.pengguna ORDER BY NEWID()),
                '${time}',
                '${time}',
                '${time}',
                '1',
                '${time}',
                '${time}',
                '${time}',
                (newid())
            );`;

        return card_access;
    }

    insertRegisterGate(register_gate_id) {
        let time = this.getTime();

        let register_gate = `INSERT INTO dbo.register_gate (
            id_register_gate,
            id_tipe_gate,
            id_kartu_akses,
            tgl_unggah,
            is_updated,
            created_at,
            updated_at,
            deleted_at,
            updater) VALUES (
                ${register_gate_id},
                1,
                '1212121212',
                "",
                1,
                '${time}',
                '${time}',
                "",
                (newid())
            );`;

        return register_gate;
    }
}

module.exports = new Query();
