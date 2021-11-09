const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    student_name: {
      type: String,
      required: true,
    },
    student_email: {
      type: String,
      required: true,
      unique: true,
    },
    student_pass: {
      type: String,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    confirmationCode: {
      type: String,
      unique: true,
    },
    credits_left: {
      type: Number,
      default: 0,
    },
    bidding_complete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const student_som = new mongoose.model("SOMStudent", studentSchema);
module.exports = student_som;
