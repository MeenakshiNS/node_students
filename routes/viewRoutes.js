const { Router } = require("express");
const router = Router();
const {getstudents,login,signup}=require("../controllers/viewController.js")

router.get("/", getstudents);

router.get("/login", login);

router.get("/signup", signup);



module.exports = router;