const Student = require("./../models/studentModel");
const APIFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError =require("../utils/appError");

exports.createStudent = catchAsync(async (req, res) => {
  const newStudent = await Student.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      student: newStudent,
    },
  });
});

//ALIAS ROUTING WE HAVENT DONE FACING PROBLEM
// exports.toppers=(req,res,next)=>{
//   console.log("Toppers middleware triggered");
//  // Clone the existing query if needed
//  const queryObj={...req.query};

//  queryObj.limit=5;
//  queryObj.sort='-marks,class';
//  queryObj.fields='name,marks,class'

//  console.log(queryObj);
// //  req.query = {
// //   ...req.query,
// //   limit: '5',
// //   sort: '-marks,class',
// //   fields: 'name,marks,class',
// // };

//   next()

// }

exports.getAllStudents = catchAsync(async (req, res) => {

  
  const apifeatures = new APIFeatures(Student.find(), req.query)
    .filter()
    .sort()
    .project()
    .paginate();
  //EXECUTE QUERY
  // console.log(">>>>>>>>>>",typeof(apifeatures));
  const students = await apifeatures.query;
  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    total_data: students.length,
    data: {
      students,
    },
  });
});

// exports.getStudentById = async (req, res) => {
//   try {
//     // const id = req.params.id.trim();
//     // console.log(req.params);
//     const student = await Student.findById(req.params.id);
//     res.status(200).json({
//       status: "success",
//       data: {
//         student,
//       },
//     });
//   } catch (error) {
//     // console.log(error);
//     res.status(404).json({
//       status: "fail",
//       message: error,
//     });
//   }
// };

exports.getStudentById = catchAsync(async (req, res, next) => {
  // const id = req.params.id.trim();
  // console.log(req.params);
  const student = await Student.findById(req.params.id);
  if (!student) return next(new AppError('no such doc available with that id',404));
  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.updateStudentById = catchAsync(async (req, res,next) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!student) return next(new AppError('no such doc available with that id',404));

  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.replaceStudentById = catchAsync(async (req, res) => {
  const student = await Student.replaceOne({ _id: req.params.id }, req.body);
  res.status(200).json({
    status: "success",
    data: {
      student,
    },
  });
});

exports.deleteStudentById = catchAsync(async (req, res,next) => {
  const student=await Student.findByIdAndDelete(req.params.id);
  if (!student) return next(new AppError('no such doc available with that id',404));

  res.status(204).json({
    status: "success",
    // message:"Student deleted successfully"
  });
});

exports.getStudentStats =catchAsync(async (req, res) => {
    const stats = await Student.aggregate([
      {
        $group: {
          _id: "$class",
          numStudents: { $sum: 1 },
          maxMark: { $max: "$marks" },
          minMark: { $min: "$marks" },
        },
      },
      {
        $project: {
          _id: 0,
          class: "$_id",
          numStudents: 1,
          maxMark: 1,
          minMark: 1,
        },
      },
      {
        $sort: {
          class: 1,
        },
      },
      {
        $match: {
          class: { $in: [10, 12] },
          $or: [{ maxMark: { $lte: 90 } }, { minMark: { $gte: 40 } }],
        },
      },
    ]);
    res.status(200).json({
      status: "success",
      data: stats,
    });
}); 