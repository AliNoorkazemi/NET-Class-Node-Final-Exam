var express = require("express");
var router = express.Router({ mergeParams: true });

var courseModel = require("../database/course.schema");
var studentModel = require("../database/student.schema");

router.delete("/", async function (req, res, next) {
  const courses = await courseModel.find({});
  const students = await studentModel.find({});
  const student = students.find(
    (student) => student.studentid.toString() === req.params.studentid
  );
  const student_courses = student.courses;
  let exist = false;
  let grade = 0;
  let name = null;
  let id = null;
  let element_id = null;
  student_courses.forEach((element) => {
    const courseDetail = courses.find(
      (course) => course._id.toString() === element._id.toString()
    );
    if (courseDetail.courseid.toString() === req.params.courseid) {
      exist = true;
      grade = courseDetail.grade;
      element_id = element._id;
      name = courseDetail.name;
      id = courseDetail.courseid;
    }
  });
  if (exist) {
    let filter = { _id: element_id, courseid: req.params.courseid };
    let result = null;

    courseModel.findOneAndRemove(filter, function (err, doc) {
      if (err) return res.send(500, { error: err });
      result = doc;
    });

    let updated_averege = student.average * student.courses.length - grade;
    if (student.courses.length !== 1) {
      updated_averege = updated_average / (student.courses.length - 1);
    }

    const index = student.courses.findIndex(
      (element) => element._id.toString() === element_id.toString()
    );

    student.courses.splice(index, 1);

    filter = { studentid: req.params.studentid };
    update = {
      last_updated: new Date(),
      average: updated_averege,
      courses: student.courses,
    };
    studentModel.findOneAndUpdate(filter, update, function (err, doc) {
      if (err) return res.send(500, { error: err });
      else
        res.status(200).send({
          grade: grade,
          courseid: id,
          name: name,
        });
    });
  } else {
    res.status(400).send("course not exists for student");
  }
});

module.exports = router;
