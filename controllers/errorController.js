const appError = require("../utils/appError");

const sendErrorProd = (err, res) => {
  // console.log(err);
  // Trusted (operational) error
  if (err.isOperation) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error
    console.error("💥 ERROR:", err);
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new appError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // console.log("hey iam dupe");
  console.log(err);
  const field = Object.keys(err.cause.keyValue)[0];
  const value = err.cause.keyValue[field];
  // console.log("||",value,"||");
  message = `duplicate key error .${field}:${value} already in use`;
  return new appError(message, 400);
};

const handleValidatorError=(err)=>{
  return new appError(err.mesage,400)
}

module.exports = (err, req, res, next) => {
  // console.error(err);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    if (err.errors && typeof err.errors === 'object') {
      console.log(Object.values(err.errors).map(el => el.message));
      console.log(Object.values(err.errors));
    } else {
      console.log("Error (no .errors object):", err.message);
    }
    
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    // console.log(err.name,">>>>>>>>>");
    if (err.name === "CastError") {
      error = handleCastErrorDB(err);
    }

    if (err.cause.code === 11000) {
      error = handleDuplicateFieldsDB(err);
    }

    // if (err.name==="ValidatorError"){
    //   error = handleValidatorError(err);
    // }
    // console.log(err);
    
    sendErrorProd(error, res);
  }
};
