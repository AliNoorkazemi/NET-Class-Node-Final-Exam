var express = require("express");
var router = express.Router({ mergeParams: true });

var courseModel = require("../database/course.schema");
var studentModel = require("../database/student.schema");

router.post("/", async function (req, res, next) {
  const courses = await courseModel.find({});
  const students = await studentModel.find({});
  const student = students.find(
    (student) => student.studentid.toString() === req.params.studentid
  );
  const student_courses = student.courses;
  let repeated = false;
  student_courses.forEach((element) => {
    const courseDetail = courses.find(
      (course) => course._id.toString() === element._id.toString()
    );
    if (
      courseDetail.name === req.body.name ||
      courseDetail.courseid === req.body.courseid
    ) {
      repeated = true;
    }
  });
  if (repeated) {
    res.status(400).send("course already exists");
  } else {
    const course = {
      courseid: req.body.courseid,
      name: req.body.name,
      grade: req.body.grade,
    };
    var instance = new courseModel(course);
    instance.save(function (err) {
      if (err) return console.log(err);
    });

    const courseid = instance._id;
    const updated_averege =
      (student.average * student.courses.length + req.body.grade) /
      (student.courses.length + 1);
    student_courses.push(courseid);
    const filter = { studentid: req.params.studentid };
    const update = {
      courses: student_courses,
      last_updated: new Date(),
      average: updated_averege,
    };
    studentModel.findOneAndUpdate(filter, update, function (err, doc) {
      if (err) return res.send(500, { error: err });
    });

    res.status(200).send({
      course,
    });
  }
});

module.exports = router;
