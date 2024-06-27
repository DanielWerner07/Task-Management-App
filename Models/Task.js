const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  dueDate: {
    type: Date,
  },
  steps: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Step',
  }],
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
