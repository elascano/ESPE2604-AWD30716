const express = require("express");
const path = require("path");

const app = express();
const PORT = 3004;

app.use(express.static(path.join(__dirname, "views")));

app.listen(PORT, () => {
    console.log(`Frontend service operational on port ${PORT}`);
});