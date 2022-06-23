var express = require("express");
var router = express.Router();

var studentModel = require("../database/student.schema");

router.get("/", async function (req, res, next) {
  const students = await studentModel.find({});
  res.status(200).send({ students });
});

module.exports = router;
