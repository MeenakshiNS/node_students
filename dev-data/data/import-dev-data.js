const express = require("express");
const mongoose = require("mongoose");
const fs=require('fs');
const Student = require("../../models/studentModel");
const dbURI =
  "mongodb+srv://hiringhrbot39:students@cluster0.zbfyh.mongodb.net/student?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Connection error:", error));

const students=JSON.parse(fs.readFileSync(`${__dirname}/students.json`,`utf-8`));
//importing all student docs
const importData = async () => {
    try {
      await Student.create(students);
      console.log('✅ Data successfully loaded!');
    } catch (error) {
      console.log(error);
    }
    process.exit();
  };
  
//deleting all student docs
  const deleteData = async () => {
    try {
      await Student.deleteMany();
      console.log('🗑️ Data successfully deleted!');
    } catch (error) {
      console.log(error);
    }
    process.exit();
  };
  

  if (process.argv[2] === '--import') {
    importData();
  } else if (process.argv[2] === '--delete') {
    deleteData();
  }
  