const mongoose = require("mongoose");

//A single task looks like below
const taskSchema = mongoose.Schema({
  title: String,
  deadline: Date
});

const TaskModel = mongoose.model("tasks", taskSchema);

module.exports = TaskModel;
