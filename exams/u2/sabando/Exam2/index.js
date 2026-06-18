require("dotenv").config();

const port = process.env.PORT || 3015;
const express = require("express");
const app = express();

app.use(express.json());

const serviceType = (process.env.SERVICE_TYPE || "").toLowerCase();

if (serviceType === "crud") {
    console.log("Starting service: CRUD Operations");
    const crudRouter = require("./routes/crudRoutes");
    app.use("/", crudRouter);
} else if (serviceType === "logic") {
    console.log("Starting service: Business Logic & Stats");
    const logicRouter = require("./routes/logicRoutes");
    app.use("/", logicRouter);
} else {
    console.log("Starting service: Unified (CRUD + Business Logic) [No SERVICE_TYPE set]");
    const crudRouter = require("./routes/crudRoutes");
    const logicRouter = require("./routes/logicRoutes");
    app.use("/", crudRouter);
    app.use("/", logicRouter);
}

app.listen(port, () => {
    console.log(`Server tables (${serviceType || 'unified'}) is running on port --> ${port}`);
});