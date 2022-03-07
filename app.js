const express = require('express');
const cors = require("cors");
const fs = require("fs");
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const iotService = require('./services/iot.service');

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Routes
const WBRouter = require("./routes/wb.route");

app.use("", WBRouter);

app.get('/', (req, res) => {
    fs.readFile(`logs.txt`, 'utf8', (err, data) => {
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

iotService.subscribeAWSIOT();
iotService.subscribeIOTError();
iotService.subscribeIOTMessage();
iotService.subscribeIOTConnection();
iotService.subscribeIOTOffline();