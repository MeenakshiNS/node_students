process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const express = require("express");
const app = express();
const AppError=require('./utils/appError');
const dotenv=require('dotenv');
dotenv.config({path:'./.env'});
const globalErrorHandler=require('./controllers/errorController');
// console.log(process.env.PORT);
// const dbURI=process.env.DB;
// console.log(process.env.DB);
const path=require('path');
const mongoose = require("mongoose");
const studentRoutes = require("./routes/studentRoutes");
const viewRoutes=require("./routes/viewRoutes");
const { title } = require("process");
const port = process.env.PORT;

// middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
// view engine
app.set("view engine", "pug");
app.set('views',path.join(__dirname,'views'));

// database connection
const dbURI =process.env.DB;
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Connection error:", err.name,err.message));

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

app.use("/",viewRoutes)
app.use("/api/v1",studentRoutes);


//NOT WORKING THIS WAY (UNHANDLED ROUTE CATCHING)
// app.all("*", (req,res)=>{
//   console.log("***************");
  
//   res.status(404).json({
//     status:'fail',
//     message:`${req.originalUrl} URL not found on this server !`
//   })
// });

// Express.js example
app.use((req, res, next) => {
  const err = new Error(`Can't find ${req.originalUrl} on this server!`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(err.message,404)); 
  // res.status(404).send(`${req.originalUrl} URL not found on this server !`); // or send a JSON response, etc.
});

app.use(globalErrorHandler)


const server=app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});



process.on('unhandledRejection',err=>{
  console.log('☠️',err.name,err.message);
  console.log('☠️ Unhandled rejection. Shutting down...');
  server.close(() => {
    process.exit(1);
  });
  
})


