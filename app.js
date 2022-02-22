const express = require('express');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ origin: "*" }));

// Routes
const WBRouter = require("./routes/wb.route");

app.use("", WBRouter);

app.get('/', (req, res) => {
    res.send('Welcome to WB');
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Example app listening on port ${port}`)
});