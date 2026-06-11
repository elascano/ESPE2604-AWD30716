const mongoose = require("mongoose");
const subjectSchema = new mongoose.Schema(
    {
        id: { type: Number },
        courseCode: { type: String },
        title: { type: String },
        credits: { type: Number },
        description: { type: String }
    },
    { collection: "subjects" }
);
module.exports = mongoose.model("subjects", subjectSchema);