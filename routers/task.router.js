const express = require("express");
const TaskModel = require("../models/task.model");

const router = express.Router();

router.get("/tasks", (req, res, next) => {
  TaskModel.find({})
    .then((data) => res.json(data))
    .catch(next);
});

router.post("/add-task", (req, res, next) => {
  //set count data in session. Count is incremented even the operation is successful as it just reflects how many times api was hit
  if (req.session.updateCount) {
    req._construct.session.updateCount++;
  } else {
    req.session.updateCount = 1;
  }
  //check if req body is in correct shape
  if (req.body && req.body.title && req.body.deadline) {
    TaskModel.create(req.body)
      .then((insertedTask) => res.json(insertedTask))
      .catch(next);
  } else {
    throw { status: 400, message: "Incorrect request body" };
  }
});

router.put("/update-task/:updateId", (req, res, next) => {
  //set count data in session. Count is incremented even the operation is successful as it just reflects how many times api was hit
  if (req.session.updateCount) {
    req._construct.session.updateCount++;
  } else {
    req.session.updateCount = 1;
  }
  const task = req.body;
  const id = req.params.updateId;
  //check if req body is in correct shape
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

router.get('/count', (req, res, next)=>{
  let addCount = 0;
  let updateCount = 0;
  if(req.session.addCount) {
    addCount = req.session.addCount;
  }
  if(req.session.updateCount) {
    updateCount = req.session.updateCount;
  }
  res.json({
    addCount,
    updateCount
  });
});

module.exports = router;
