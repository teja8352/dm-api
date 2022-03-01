const express = require('express');
const cors = require("cors");
const fs = require("fs");
const app = express();
const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
    keyPath: "./cert/09d9d2d1f0b2603943d4ba93da546f8095d6169f7d97fc3ab17bc55506f171b6-private.pem.key",
    certPath: "./cert/09d9d2d1f0b2603943d4ba93da546f8095d6169f7d97fc3ab17bc55506f171b6-certificate.pem.crt",
    caPath: "./cert/AmazonRootCA1 (1).pem",
    clientId: "weighingscale1",
    port: 8883,
    host: "at3kcp9lznzcy-ats.iot.ap-south-1.amazonaws.com"
});

const telemetryData = {
    deviceId: `weighingscale1`,
    payload: {
        pressure: 80,
        temperature: 39,
        date: new Date().toLocaleString()
    }
};

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Routes
const WBRouter = require("./routes/wb.route");

app.use("", WBRouter);

app.get('/', (req, res) => {
    fs.readFile(`${wbId}.txt`, 'utf8', (err, data) => {
        if (err) {
            console.error("Error while getting logs:::::::::::::::\n", err);
            delete err?.path;
            res.send(err);
        } else {
            res.send(data)
        }
    });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`)
});


const topicCoreBroadcast = "weighingscale"
const topicHouse1 = "commands"// We connect our client to AWS IoT core. 
device.on('connect', () => {
    console.log('Connecting to AWS IoT Core'); // We Attach handler callback to a specific topic
    device.subscribe(topicCoreBroadcast, {}, (err) => {
        if (err) {
            console.log("Error while subscribing::::::::::::::::::\n", err);
        }
    });
    setTimeout(() => {
        console.log(`Sending data:::::::::::::::::::::::\n`, telemetryData)
        device.publish(topicHouse1, JSON.stringify(telemetryData), {}, (err) => {
            if (err) {
                console.log("Error while publishing::::::::::::::::::\n", err);
            }
        });
    }, 3000)
});

device.on('close', () => {
    console.log('connection closed');
});

device.on('error', (error) => {
    console.log('iot error::::::::::::::::::::::::\n', error);
});

device.on('message', (topic, payload) => {
    try {
        let data = `\n
        --------------------------------------------------------
        Topic - ${topic}
        --------------------------------------------------------
        \n
        \n
        \n
        \n
        --------------------------------------------------------
        Date - ${new Date().toLocaleString()}
        --------------------------------------------------------
        \n
        \n

        Payload: \n
        ${JSON.stringify(payload, null, 2)}

        \n
        \n\n\n\n\n\n\n`;
        fs.appendFile(`logs.txt`, data, (err) => {
            if (err) {
                console.error("Error while adding data:::::::::::::::\n", err);
                delete err?.path;
            } else {
                console.log('Data added');
            }
        });
    } catch (e) {
        const log = `\n
        --------------------------------------------------------
        Topic - ${topic}
        --------------------------------------------------------
        \n
        \n
        \n
        \n
        --------------------------------------------------------
        Date - ${new Date().toLocaleString()}
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
    }
});