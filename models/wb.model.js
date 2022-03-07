const constants = require("../constants/constants");
const fs = require("fs");
const iotService = require('../services/iot.service');

const get = (wbId) => {
    let path = "logs/logs.txt";
    try {
        if (fs.existsSync(path)) {
            //file exists
        } else {
            path = "../logs/logs.txt"
        }
    } catch (err) {
        console.error(err)
    }
    return new Promise(async (resolve, reject) => {
        try {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    console.error("Error while getting logs:::::::::::::::\n", err);
                    delete err?.path;
                    reject(err);
                } else {
                    resolve({ data: `${data.toString()}` });
                }
            });
        } catch (e) {
            console.error("Exception while getting logs:::::::::::::::\n", e);
            reject(e)
        }
        // if (constants.WBIDs.includes(wbId)) {
        //     fs.readFile(`${wbId}.txt`, 'utf8', (err, data) => {
        //         if (err) {
        //             console.error("Error while getting logs:::::::::::::::\n", err);
        //             delete err?.path;
        //             reject(err);
        //         } else {
        //             resolve(data);
        //         }
        //     });
        // } else {
        //     resolve({ message: "WB ID not found", is_wb_id_found: false });
        // }
    });
};

const add = (payload) => {
    return new Promise((resolve, reject) => {
        iotService.publishTopic(payload).then(resp => {
            resolve(resp);
        }, err => {
            reject(err);
        });
        // if (constants.WBIDs.includes(payload.wb_id)) {
        //     try {
        //         let data = `\n
        //         --------------------------------------------------------
        //         ${new Date().toLocaleString()}
        //         --------------------------------------------------------
        //         \n
        //         \n

        //         ${JSON.stringify(payload, null, 2)}

        //         \n
        //         \n\n\n\n\n\n\n`;
        //         fs.appendFile(`${payload.wb_id}.txt`, data, (err) => {
        //             if (err) {
        //                 console.error("Error while adding data:::::::::::::::\n", err);
        //                 delete err?.path;
        //                 reject(err);
        //             } else {
        //                 console.log('Data added');
        //                 resolve({ message: 'File created or data appended' });
        //             }
        //         });
        //     } catch (e) {
        //         const log = `\n
        //         --------------------------------------------------------
        //         ${new Date().toLocaleString()}
        //         --------------------------------------------------------
        //         \n
        //         \n
        //         Payload: \n
        //         ${JSON.stringify(payload, null, 2)}
        //         \n
        //         \n
        //         Error: \n
        //         ${JSON.stringify(e, null, 2)}
        //         \n
        //         \n\n\n\n\n\n\n`;
        //         fs.appendFile(`logs.txt`, log, (err) => {
        //             if (err) {
        //                 console.error("Error while adding logs:::::::::::::::\n", err);
        //             } else {
        //                 console.log('Logs added');
        //             }
        //         });
        //         reject(e);
        //     }
        // } else {
        //     resolve({ message: "WB ID not found", is_wb_id_found: false });
        // }
    });
};

module.exports = { get, add };
