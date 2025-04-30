const Student = require("../models/studentModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
exports.getstudents = catchAsync(async (req, res) => {
  // const students=await Student.find()

  const docCount = new APIFeatures(Student.find(), req.query);
    
  const totalStudents = await docCount.query.countDocuments();

  const apifeatures = new APIFeatures(Student.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();
  const students = await apifeatures.query;
  // console.log(students);

  //count total students
  // const totalStudents=await students.countDocuments();
  const limit = req.query.limit ? req.query.limit * 1 : 10;
  const currentPage = req.query.page ? req.query.page * 1 : 1;
  const totalPages = Math.ceil(totalStudents / limit);
  //console.log(totalPages, currentPage, totalStudents);

  res.status(200).render("list", {
    title: "students",
    students,
    totalPages,
    currentPage,
    totalStudents,
  });
});

exports.login = (req, res) => {
  res.status(200).render("login", {
    title: "Login | Student Portal",
  });
};

exports.signup = (req, res) => {
  res.status(200).render("signup", {
    title: "Signup | Student Portal",
  });
};
