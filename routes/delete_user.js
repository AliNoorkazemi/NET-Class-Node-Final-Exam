var express = require("express");
var router = express.Router({ mergeParams: true });

var studentModel = require("../database/student.schema");

router.delete("/", async function (req, res, next) {
  const students = await studentModel.find({});
  if (students.some((student) => student.studentid.toString() === req.params.studentid)) {
    const filter = { studentid: req.params.studentid };
    studentModel.findOneAndRemove(filter, function (err, doc) {
      if (err) return res.send(500, { error: err });
      return res.status(200).send({ doc });
    });
  } else {
    res.status(400).send({ message: "student id does not exist" });
  }
});

module.exports = router;
