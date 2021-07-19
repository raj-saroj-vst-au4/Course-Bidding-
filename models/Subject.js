const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    course_code: {
        type: String,
        required: true,
        unique: true
    },
    course_name:{
        type: String,
        required: true,
    },
    course_faculty:{
        type: String,
        required: true
    },
    course_credits: {
        type: Number,
        required: true
    },
    course_term: {
        type: String,
        required: true
    },
    course_seats: {
        type: Number,
        required: true
    },
    course_students: [{
        student_email: String,
        student_bid: Number,
    }]
})

const course_som = new mongoose.model("SOMCourse", courseSchema)
module.exports = course_som;