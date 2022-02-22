const constants = require("../constants/constants");
const fs = require("fs");

const get = (wbId) => {
    return new Promise((resolve, reject) => {
        if (constants.WBIDs.includes(wbId)) {
            fs.readFile(`${wbId}.txt`, 'utf8', (err, data) => {
                if (err) {
                    console.error("Error while getting logs:::::::::::::::\n", err);
                    delete err?.path;
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        } else {
            resolve({ message: "WB ID not found", is_wb_id_found: false });
        }
    });
};

const add = (payload) => {
    return new Promise((resolve, reject) => {
        if (constants.WBIDs.includes(payload.wb_id)) {
            try {
                let data = `\n
                --------------------------------------------------------
                ${new Date().toLocaleString()}
                --------------------------------------------------------
                \n
                \n

                ${JSON.stringify(payload, null, 2)}

                \n
                \n\n\n\n\n\n\n`;
                fs.appendFile(`${payload.wb_id}.txt`, data, (err) => {
                    if (err) {
                        console.error("Error while adding data:::::::::::::::\n", err);
                        delete err?.path;
                        reject(err);
                    } else {
                        console.log('Data added');
                        resolve({ message: 'File created or data appended' });
                    }
                });
            } catch (e) {
                const log = `\n
                --------------------------------------------------------
                ${new Date().toLocaleString()}
                --------------------------------------------------------
                \n
                \n
                Payload: \n
                ${JSON.stringify(payload, null, 2)}
                \n
                \n
                Error: \n
                ${JSON.stringify(e, null, 2)}
                \n
                \n\n\n\n\n\n\n`;
                fs.appendFile(`logs.txt`, log, (err) => {
                    if (err) {
                        console.error("Error while adding logs:::::::::::::::\n", err);
                    } else {
                        console.log('Logs added');
                    }
                });
                reject(e);
            }
        } else {
            resolve({ message: "WB ID not found", is_wb_id_found: false });
        }
    });
};

module.exports = { get, add };
