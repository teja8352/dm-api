const fs = require("fs");
let device;

const configIOTDevice = (deviceToConnect) => {
    device = deviceToConnect;
}

const subscribeAWSIOT = () => {
    device.on('connect', () => {
        console.log('Connecting to AWS IoT Core'); // We Attach handler callback to a specific topic
        try {
            device.subscribe(process.env.TOPICCOREBROADCAST, {}, (err) => {
                if (err) {
                    console.log("Error while subscribing::::::::::::::::::\n", err);
                } else {
                    console.log("IOT Connection subscribed");
                    subscribeIOTMessage();
                }
            });
        } catch (e) {
            console.log("Exception while subscribing to the IOT:::::::::::::::::::\n", e);
            if (e?.message && e?.message.includes("resubscribe")) {
                unsubscribeIOTConnection();
            }
        }
    });
}

const subscribeIOTConnection = () => {
    try {
        device.on('close', () => {
            console.log("Connection closed");
        });
    } catch (e) {
        console.log("Exception while closing the connection::::::::::::::::::::::::::\n", e);
    }
}

const subscribeIOTOffline = () => {
    try {
        device.on('offline', () => {
            console.log("Connection gone offline");
        });
    } catch (e) {
        console.log("Exception while checking offline connection::::::::::::::::::::::::::\n", e);
    }
}

const subscribeIOTError = () => {
    try {
        device.on('error', (error) => {
            console.log("IOT Error::::::::::::::::::::\n", error);
        });
    } catch (e) {
        console.log("Exception while getting IOT error::::::::::::::::::::::::::\n", e);
        reject(e);
    }
}

const subscribeIOTMessage = () => {
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
    try {
        device.on('message', (topic, payload) => {
            console.log("topic::::::::::::::::::::::::\n", topic);
            console.log("payload::::::::::::::::::::::::\n", payload);
            try {
                let data = `\r\n
                \n
                \n
                \n
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
                \n\n\n\n\n\n\n \t\r`;
                fs.appendFile(path, data, (err) => {
                    if (err) {
                        console.error("Error while adding data:::::::::::::::\n", err);
                        delete err?.path;
                    } else {
                        console.log('Data added');
                    }
                });
            } catch (e) {
                const log = `\r\n
                \n
                \n
                \n
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
                \n\n\n\n\n\n\n \t\r`;
                fs.appendFile(path, log, (err) => {
                    if (err) {
                        console.error("Error while adding logs:::::::::::::::\n", err);
                    } else {
                        console.log('Logs added');
                    }
                });
            }
        });
    } catch (e) {
        console.log("Exception while getting adding logs::::::::::::::::::::::::::\n", e);
        reject(e);
    }
}

const unsubscribeIOTConnection = () => {
    try {
        device.unsubscribe(process.env.TOPICCOREBROADCAST, (ucb) => {
            console.log("IOT connection unsubscribed::::::::::::::::::::\n", ucb);
            device.subscribe(process.env.TOPICCOREBROADCAST, {}, (err) => {
                if (err) {
                    console.log("Error while subscribing::::::::::::::::::\n", err);
                } else {
                    console.log("IOT Connection subscribed")
                }
            });
        });
    } catch (e) {
        console.log("Exception while ending IOT connection::::::::::::::::::::::::::\n", e);
    }
}

const endIOTConnection = () => {
    try {
        device.end(true, (cb) => {
            console.log("IOT connection end::::::::::::::::::::\n", cb);
            device.subscribe(process.env.TOPICCOREBROADCAST, {}, (err) => {
                if (err) {
                    console.log("Error while subscribing::::::::::::::::::\n", err);
                } else {
                    console.log("IOT Connection subscribed")
                }
            });
        });
    } catch (e) {
        console.log("Exception while ending IOT connection::::::::::::::::::::::::::\n", e);
    }
}

const publishTopic = (payload) => {
    return new Promise((resolve, reject) => {
        payload.date = new Date().toLocaleString();
        device.publish(process.env.TOPICHOUSE, JSON.stringify(payload), {}, (err) => {
            if (err) {
                console.log("Error while publishing::::::::::::::::::\n", err);
                reject(err);
            } else {
                console.log("Publilshed::::::::::::::::::::::::\n", payload);
                resolve({ message: "Data published", data: payload });
            }
        });
    });
};

module.exports = {
    configIOTDevice,
    subscribeAWSIOT,
    subscribeIOTConnection,
    subscribeIOTError,
    subscribeIOTMessage,
    subscribeIOTOffline,
    endIOTConnection,
    unsubscribeIOTConnection,
    publishTopic
};
