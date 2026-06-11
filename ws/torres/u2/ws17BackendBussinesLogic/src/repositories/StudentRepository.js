const Student = require("../models/Student");
const StudentMongoModel = require("../models/StudentMongoModel");

class StudentRepository {
  async findAll() {
    const rawStudents = await StudentMongoModel.find().sort({ id: 1 }).lean();
    return rawStudents.map((student) => new Student(student));
  }

  async findById(id) {
    const numericId = Number(id);
    const student = await StudentMongoModel.findOne({ id: numericId }).lean();

    return student ? new Student(student) : null;
  }

  async create(studentData) {
    const createdStudent = await StudentMongoModel.create(studentData);
    return new Student(createdStudent.toObject());
  }

  async update(id, studentData) {
    const numericId = Number(id);
    const updatedStudent = await StudentMongoModel.findOneAndUpdate(
      { id: numericId },
      studentData,
      { new: true, runValidators: true }
    ).lean();

    return updatedStudent ? new Student(updatedStudent) : null;
  }

  async delete(id) {
    const numericId = Number(id);
    const deletedStudent = await StudentMongoModel.findOneAndDelete({ id: numericId }).lean();

    return deletedStudent ? new Student(deletedStudent) : null;
  }

  async getDatabaseStatus() {
    const totalStudents = await StudentMongoModel.countDocuments();

    return {
      database: StudentMongoModel.db.name,
      collection: StudentMongoModel.collection.name,
      totalDocuments: totalStudents,
      source: "MongoDB",
    };
  }
}

module.exports = StudentRepository;
