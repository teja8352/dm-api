const awsIot = require('aws-iot-device-sdk');
const device = awsIot.device({
    keyPath: "./cert/09d9d2d1f0b2603943d4ba93da546f8095d6169f7d97fc3ab17bc55506f171b6-private.pem.key",
    certPath: "./cert/09d9d2d1f0b2603943d4ba93da546f8095d6169f7d97fc3ab17bc55506f171b6-certificate.pem.crt",
    caPath: "./cert/AmazonRootCA1 (1).pem",
    clientId: "weighingscale1",
    port: 8883,
    host: "at3kcp9lznzcy-ats.iot.ap-south-1.amazonaws.com",
    debug: true,
    keepalive: 10,
    resubscribe: true
});

module.exports = {
    device
};