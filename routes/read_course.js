var express = require("express");
var router = express.Router({ mergeParams: true });

var courseModel = require("../database/course.schema");
var studentModel = require("../database/student.schema");

router.get("/", async function (req, res, next) {
  const courses = await courseModel.find({});
  const students = await studentModel.find({});
  const student = students.find(
    (student) => student.studentid.toString() === req.params.studentid
  );
  student.courses = student.courses.map((element) => {
    const courseDetail = courses.find(
      (course) => course._id.toString() === element._id.toString()
    );
    return {
      name: courseDetail.name,
      grade: courseDetail.grade,
      courseid: courseDetail.courseid,
    };
  });
  res.status(200).send({
    student,
  });
});

module.exports = router;
