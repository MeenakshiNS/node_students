const { Router } = require("express");
const router = Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudentById,
  replaceStudentById,
  deleteStudentById,
  getStudentStats,
} = require("../controllers/studentController");

router.post("/students",createStudent);
router.get("/students", getAllStudents);
router.get("/students/:id", getStudentById);
router.patch("/students/:id", updateStudentById);
router.put("/students/:id", replaceStudentById);
router.delete("/students/:id", deleteStudentById);
// router.get("/top-5-students",toppers,getAllStudents);
router.get('/student-stats',getStudentStats);


module.exports = router;
