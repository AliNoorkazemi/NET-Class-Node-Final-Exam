var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var courseSchema = new Schema({
  courseid: Number,
  name: String,
  grade: Number,
});

const courseModel = mongoose.model("Course", courseSchema);

module.exports = courseModel;
