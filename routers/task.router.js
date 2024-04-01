const express = require("express");
const TaskModel = require("../models/task.model");

const router = express.Router();

router.get("/tasks", (req, res, next) => {
  TaskModel.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/add-task", (req, res, next) => {
  console.log(req.body)
  if (req.body && req.body.title && req.body.deadline) {
    TaskModel.create(req.body)
      .then((insertedTask) => res.json(insertedTask))
      .catch(next);
  } else {
    throw { status: 400, message: "Incorrect request body" };
  }
});

module.exports = router;
