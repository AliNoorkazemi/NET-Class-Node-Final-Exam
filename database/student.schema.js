var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var studentSchema = new Schema({
  studentid: Number,
  average: Number,
  courses: [{ id: Schema.Types.ObjectId }],
  last_updated: { type: Date, default: Date.now() },
});

const studentModel = mongoose.model("Student", studentSchema);

module.exports = studentModel;
