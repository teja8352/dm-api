const express = require('express');
const cors = require("cors");
const fs = require("fs");
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Firebase
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("./config/service_account.json");
firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(serviceAccount),
    databaseURL: "https://weighing-bridge-mech.firebaseio.com"
});
const firestore = firebaseAdmin.firestore();

// Routes
// const WBRouter = require("./routes/wb.route");

// app.use("", WBRouter);

app.get('/', (req, res) => {
    let path = "logs/logs.txt";
    try {
        if (fs.existsSync(path)) {
            //file exists
        } else {
            path = "./logs/logs.txt"
        }
    } catch (err) {
        console.error(err)
    }
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error("Error while getting logs:::::::::::::::\n", err);
            delete err?.path;
            res.send(err);
        } else {
            res.send(data)
        }
    });
});


process.on("uncaughtException", (err) => {
    console.log("uncaughtException::::::::::::::::::::::\n", err);
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`)
});


const device = require('./config/device');
const iotService = require('./services/iot.service');
// console.log("Device:::::::::::::::::::\n", device);

// iotService.configIOTDevice(device.device);
// iotService.subscribeAWSIOT();
// iotService.subscribeIOTError();
// iotService.subscribeIOTMessage();
// iotService.subscribeIOTConnection();
// iotService.subscribeIOTOffline();

const awsIot = require('aws-iot-device-sdk');
const iotDevice = awsIot.device({
    keyPath: "./cert/09d9d2d1f0b2603943d4ba93da546f8095d6169f7d97fc3ab17bc55506f171b6-private.pem.key",
    certPath: "./cert/09d9d2d1f0b2603943d4ba93da546f8095d6169f7d97fc3ab17bc55506f171b6-certificate.pem.crt",
    caPath: "./cert/AmazonRootCA1 (1).pem",
    clientId: "weighingscale1",
    port: 8883,
    host: "at3kcp9lznzcy-ats.iot.ap-south-1.amazonaws.com",
    region: "ap-south-1"
});

iotDevice.on('connect', () => {
    console.log('Connecting to AWS IoT Core'); // We Attach handler callback to a specific topic
    try {
        iotDevice.subscribe(process.env.DBSUBSCRIBER, {}, (err) => {
            if (err) {
                console.log("Error while subscribing::::::::::::::::::\n", err);
            } else {
                console.log("IOT Connection subscribed");
            }
        });
    } catch (e) {
        console.log("Exception while subscribing to the IOT:::::::::::::::::::\n", e);
    }
});

iotDevice.on('message', (topic, payload) => {
    console.log("topic::::::::::::::::::::::::\n", topic);
    console.log("payload::::::::::::::::::::::::\n", payload);
    try {
        const data = { ...JSON.parse(payload), topic, date: new Date().toLocaleString() };
        console.log("Data:::::::::::::::::::\n", data);
        firestore.collection(topic).doc().set(data).then(() => {
            console.log('data written to firestore');
        }, err => {
            console.error("Error while adding data to firebase:::::::::::::::::::::::\n", err);
        });
    } catch (e) {
        console.error("Exception while adding data to firebase:::::::::::::::::::::::\n", e);
    }
    // try {
    //     let data = `\r\n
    //     \n
    //     \n
    //     \n
    //     --------------------------------------------------------
    //     Topic - ${topic}
    //     --------------------------------------------------------
    //     \n
    //     \n
    //     \n
    //     \n
    //     --------------------------------------------------------
    //     Date - ${new Date().toLocaleString()}
    //     --------------------------------------------------------
    //     \n
    //     \n

    //     Payload: \n
    //     ${JSON.stringify(payload, null, 2)}

    //     \n
    //     \n\n\n\n\n\n\n \t\r`;
    //     let path = "logs/logs.txt";
    //     try {
    //         if (fs.existsSync(path)) {
    //             //file exists
    //         } else {
    //             path = "./logs/logs.txt"
    //         }
    //     } catch (err) {
    //         console.error(err)
    //     }
    //     fs.appendFile(path, data, (err) => {
    //         if (err) {
    //             console.error("Error while adding data:::::::::::::::\n", err);
    //             delete err?.path;
    //         } else {
    //             console.log('Data added');
    //         }
    //     });
    // } catch (e) {
    //     const log = `\r\n
    //     \n
    //     \n
    //     \n
    //     --------------------------------------------------------
    //     Topic - ${topic}
    //     --------------------------------------------------------
    //     \n
    //     \n
    //     \n
    //     \n
    //     --------------------------------------------------------
    //     Date - ${new Date().toLocaleString()}
    //     --------------------------------------------------------
    //     \n
    //     \n

    //     Payload: \n
    //     ${JSON.stringify(payload, null, 2)}
    //     \n
    //     \n
    //     Error: \n
    //     ${JSON.stringify(e, null, 2)}
    //     \n
    //     \n\n\n\n\n\n\n \t\r`;
    //     let path = "logs/logs.txt";
    //     try {
    //         if (fs.existsSync(path)) {
    //             //file exists
    //         } else {
    //             path = "./logs/logs.txt"
    //         }
    //     } catch (err) {
    //         console.error(err)
    //     }
    //     fs.appendFile(path, log, (err) => {
    //         if (err) {
    //             console.error("Error while adding logs:::::::::::::::\n", err);
    //         } else {
    //             console.log('Logs added');
    //         }
    //     });
    // }
});

app.get("/wb", (req, res) => {
    let path = "logs/logs.txt";
    try {
        if (fs.existsSync(path)) {
            //file exists
        } else {
            path = "./logs/logs.txt"
        }
    } catch (err) {
        console.error(err)
    }
    try {
        fs.readFile(path, 'utf8', (err, data) => {
            if (err) {
                console.error("Error while getting logs:::::::::::::::\n", err);
                delete err?.path;
                res.status(400).json({ ...err });
            } else {
                res.status(200).json({ data, status: 200 });
            }
        });
    } catch (e) {
        console.error("Exception while getting logs:::::::::::::::\n", e);
        res.status(400).json({ ...e });
    }
});

app.post("/wb/add", (req, res) => {
    let payload = req.body;
    payload.date = new Date().toLocaleString();
    iotDevice.publish(process.env.TOPICHOUSE, JSON.stringify(payload), {}, (err) => {
        if (err) {
            console.log("Error while publishing::::::::::::::::::\n", err);
            res.status(400).json({ ...err });
        } else {
            console.log("Publilshed::::::::::::::::::::::::\n", payload);
            res.status(200).json({ data: payload, status: 200 });
        }
    });
});