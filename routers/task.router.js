const express = require("express");
const TaskModel = require("../models/task.model");

const router = express.Router();

router.get("/tasks", (req, res, next) => {
  TaskModel.find({})
    .then((data) => res.json(data))
    .catch(next);
});

module.exports = router;
