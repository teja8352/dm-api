const constants = require("../constants/constants");
const fs = require("fs");
const crypto = require('crypto');

const get = (wbId) => {
    let path = "testimonials/testimonial.json";
    try {
        if (fs.existsSync(path)) {
            //file exists
        } else {
            path = "../testimonials/testimonial.json"
        }
    } catch (err) {
        console.error(err)
    }
    return new Promise(async (resolve, reject) => {
        try {
            fs.readFile(path, 'utf8', (err, data) => {
                if (err) {
                    console.error("Error while getting testimonial:::::::::::::::\n", err);
                    delete err?.path;
                    reject(err);
                } else {
                    resolve({ data: JSON.parse(data) });
                }
            });
        } catch (e) {
            console.error("Exception while getting testimonial:::::::::::::::\n", e);
            reject(e)
        }
    });
};

const add = (payload) => {
    let path = "testimonials/testimonial.json";
    try {
        if (fs.existsSync(path)) {
            //file exists
        } else {
            path = "../testimonials/testimonial.json"
        }
    } catch (err) {
        console.error(err)
    }
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.error("Error while reading testimonial:::::::::::::::\n", err);
                delete err?.path;
                reject(err);
            } else {
                console.log("data:::::::\n", data.length)
                if (data.length <= 0) {
                    data = JSON.stringify([]);
                }
                const json = JSON.parse(data)
                json.push({
                    name: payload.name,
                    img: payload.img || "",
                    comment: payload.comment,
                    uuid: crypto.randomUUID()
                });

                try {
                    fs.writeFile(path, JSON.stringify(json), (err) => {
                        if (err) {
                            console.error("Error while adding testimonial:::::::::::::::\n", err);
                            delete err?.path;
                            reject(err);
                        }
                        console.log('The testimonial has been added!');
                        resolve({ message: 'The testimonial has been added!' });
                    });
                } catch (e) {
                    console.error("Exception while adding testimonial:::::::::::::::\n", e);
                    reject(e)
                }
            }
        })
    });
};

const remove = (uuid) => {
    let path = "testimonials/testimonial.json";
    try {
        if (fs.existsSync(path)) {
            //file exists
        } else {
            path = "../testimonials/testimonial.json"
        }
    } catch (err) {
        console.error(err)
    }
    return new Promise((resolve, reject) => {
        fs.readFile(path, (err, data) => {
            if (err) {
                console.error("Error while removing testimonial:::::::::::::::\n", err);
                delete err?.path;
                reject(err);
            } else {
                let json = JSON.parse(data)

                json = json?.filter(testimonial => testimonial.uuid !== uuid)
                try {
                    fs.writeFile(path, JSON.stringify(json), (err) => {
                        if (err) {
                            console.error("Error while removing testimonial:::::::::::::::\n", err);
                            delete err?.path;
                            reject(err);
                        };
                        resolve({ message: 'The testimonial has been removed!' });
                    });
                } catch (e) {
                    console.error("Exception while removing testimonial:::::::::::::::\n", e);
                    reject(e)
                }
            }
        })
    });
}

module.exports = { get, add, remove };
