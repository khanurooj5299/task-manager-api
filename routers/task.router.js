const express = require("express");
const TaskModel = require("../models/task.model");

const router = express.Router();

router.get("/tasks", (req, res, next) => {
  TaskModel.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/add-task", (req, res, next) => {
  if (req.body && req.body.title && req.body.deadline) {
    TaskModel.create(req.body)
      .then((insertedTask) => res.json(insertedTask))
      .catch(next);
  } else {
    throw { status: 400, message: "Incorrect request body" };
  }
});

router.put("/update-task/:updateId", (req, res, next) => {
  const task = req.body;
  const id = req.params.updateId;
  if (task && task.title && task.deadline) {
    TaskModel.updateOne({ _id: id }, task)
      .then((result) => {
        if (result.modifiedCount == 1) {
          res.json({ status: 200, message: "Successfully updated" });
        } else {
          res.json({ status: 404, message: "No such document" });
        }
      })
      .catch(next);
  } else {
    throw { status: 400, message: "Incorrect request body" };
  }
});

module.exports = router;
