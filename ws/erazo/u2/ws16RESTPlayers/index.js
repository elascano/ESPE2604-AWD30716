const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const soccerPlayerRoutes = require("./routes/soccerPlayerRoutes");

const app = express();
const port = process.env.PORT || 3007;
const mongoUri = process.env.MONGODB_URI || "mongodb+srv://lierazo_db_user:<db_password>@cluster0.vkglsoo.mongodb.net/?appName=Cluster0";

mongoose
  .connect(mongoUri)
  .then(() => console.log("Erazo soccer Player service connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));
app.use("/soccerInfo", soccerPlayerRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    service: "Erazo soccerPlayer REST Services",
    methods: ["GET"]
  });
});


app.listen(port, () => {
  console.log(`Erazo soccerPlayer service is running on port ${port}`);
});