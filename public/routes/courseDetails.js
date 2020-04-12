var express = require('express');
var bodyParser= require('body-parser')
var session = require('express-session');
var myrouter = express.Router();
var urlencodedParser = bodyParser.urlencoded({ extended: false })
//var Course = require('../models/Course');
var async = require('async');

// DB connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/Courses');

var db = mongoose.connection;

var courseSchema = new mongoose.Schema({
  courseID: { type: String, required: true },
  courseTitle: { type: String, required: true },
  courseTerm: String,
  courseInstructor: String
},{collection: 'Courses'});

var Courses = mongoose.model('Courses',courseSchema);

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Connection Successful");
    var mycourses = [{ courseID: '1000', courseTitle: 'Algo1', courseTerm: 'Fall', courseInstructor: 'Mr Bob' },
    { courseID: '1000', courseTitle: 'Algo2', courseTerm: 'Fall', courseInstructor: 'Mr Bob' },
    { courseID: '1001', courseTitle: 'NodeJS', courseTerm: 'Spring', courseInstructor: 'Dr X' },
    { courseID: '1002', courseTitle: 'React', courseTerm: 'Summer', courseInstructor: 'Prof Karen' }];
    
    Courses.collection.insertOne(mycourses, function (err, docs) {
        if (err) {
            return console.error(err);
        } else {
            console.log("Multiple documents inserted to Collection");
        }
    });
});

myrouter.get('/findCourses', function(req, res, next){
  Courses.find(function(err, doc){
    if(err){console.log(err)}
    res.render('detail', {data: doc});
  });
});

myrouter.post('/searchByCourseID', urlencodedParser, function(req, res){
  var usercourseID = req.body.courseID;
   Courses.find({courseID:usercourseID})
  .then (function(doc){
    res.render('detail', {data: doc});
  });
});

myrouter.post('/', urlencodedParser, function(req, res, next) {
  var usercourseID = req.body.courseID;
  var usercourseTitle = req.body.courseTitle;
  var usercourseTerm = req.body.courseTerm;
  var usercourseInstructor = req.body.courseInstructor;


  var item = {
    courseID: usercourseID,
    courseTitle: usercourseTitle,
    courseTerm: usercourseTerm,
    courseInstructor: usercourseInstructor
  };

  var data = new Courses(item);
  data.save();

  res.redirect('/courseDetails');
});

module.exports = myrouter;
