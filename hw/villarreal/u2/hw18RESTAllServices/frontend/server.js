const port = process.env.PORT || 8017;
const apiTarget = process.env.API_TARGET || "http://localhost:3017";
const path = require("path");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", async (req, res) => {
    try {
        const url = apiTarget + "/computerstore" + req.path;
        const opts = {
            method: req.method,
            headers: { "Content-Type": "application/json" },
        };
        if (req.method !== "GET" && req.method !== "HEAD") {
            opts.body = JSON.stringify(req.body);
        }
        const response = await fetch(url, opts);
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.listen(port, () => {
    console.log(`Frontend running on port ${port}, proxying API to ${apiTarget}`);
});
