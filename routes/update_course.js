var express = require("express");
var router = express.Router({ mergeParams: true });

var courseModel = require("../database/course.schema");
var studentModel = require("../database/student.schema");

router.put("/", async function (req, res, next) {
  const courses = await courseModel.find({});
  const students = await studentModel.find({});
  const student = students.find(
    (student) => student.studentid.toString() === req.params.studentid
  );
  const student_courses = student.courses;
  let exist = false;
  let last_grade = 0;
  let element_id = null;
  student_courses.forEach((element) => {
    const courseDetail = courses.find(
      (course) => course._id.toString() === element._id.toString()
    );
    if (courseDetail.courseid.toString() === req.params.courseid) {
      exist = true;
      last_grade = courseDetail.grade;
      element_id = element._id;
    }
  });
  if (exist) {
    let filter = { _id: element_id, courseid: req.params.courseid };
    let update = {
      grade: req.body.grade,
    };

    courseModel.findOneAndUpdate(filter, update, function (err, doc) {
      if (err) return res.send(500, { error: err });
    });

    const updated_averege =
      (student.average * student.courses.length + req.body.grade - last_grade) /
      student.courses.length;
      
    filter = { studentid: req.params.studentid };
    update = {
      last_updated: new Date(),
      average: updated_averege,
    };
    studentModel.findOneAndUpdate(filter, update, function (err, doc) {
      if (err) return res.send(500, { error: err });
    });

    res.status(200).send({
      course : req.body,
    });
  } else {
    res.status(400).send("course not exists for student");
  }
});

module.exports = router;
