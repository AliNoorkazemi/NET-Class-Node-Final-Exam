var express = require("express");
var router = express.Router();

var studentModel = require("../database/student.schema");

router.post("/", async function (req, res, next) {
  const students = await studentModel.find({});
  const studentid = req.body.studentid;
  if (students.some((student) => student.studentid === studentid)) {
    res.status(400).send({
      message: "student id already exists",
    });
  } else {
    const student = {
      studentid: studentid,
      average: 0.0,
      courses: [],
      last_updated: new Date(),
    };

    var instance = new studentModel(student);
    instance.save(function (err) {
      if (err) return console.log(err);
    });
    res.status(200).send({
      student,
    });
  }
});

module.exports = router;
