const mongoose = require("mongoose");
const slugify= require("slugify");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is mandatory"],
  },
  phone: {
    type: String,
    unique: [true, "Phone number is already in use."],
    trim: true,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v); // Check for exactly 10 digits
      },
      message: (props) => `${props.value} is not a valid 10-digit number!`,
    },
  },
  age: { type: Number, required: [true, "give your age"] },
  dateOfBirth: {
    type: Date,
  },
  image: String,
  class: {
    type: Number,
    min: [5, "Class should not be less than 5"],
    max: [12, "Class should not be more than 12"],
  },
  address: {
    city: String,
    street: String,
    houseNumber: String,
  },
  category: { type: String, enum: ["student", "student Leader"] },
  classTeacher: String,
  subject: {
    type: String,
    enum: ["science", "maths", "literature", "History"],
  },
  marks: { type: Number, required: [true, "mark is mandatory"] },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  slug:{
    type:String,
  }
},
  {
    toJSON:{virtuals:true},
    toObject: { virtuals: true }
  }

);

studentSchema.virtual('agevirtual').get(function(){
  // console.log(new Date().getFullYear()); 
  return (new Date().getFullYear() - this.dateOfBirth.getFullYear())-1;
})

//DOCUMENT MIDDLEWARE
studentSchema.pre('save',function(next){
  console.log('processing doc',this);
  this.slug=slugify(this.name,{lower:true});
  next(); 

})





const Student = mongoose.model("Student", studentSchema);



module.exports = Student;
