const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    descripcion: {
      type: String,
      required: true,
      trim: true,
    },
    fechaNacimiento: {
      type: String,
      required: true,
    },
    quintilSocioeconomico: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    promedio: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },
    porcentajeBeca: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    collection: "academic_students",
    versionKey: false,
  }
);

module.exports = mongoose.model("AcademicStudent", studentSchema);
