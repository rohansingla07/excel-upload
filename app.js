const express=require("express");
const multer=require("multer");
const mongoose = require('mongoose');
const csvToJson=require("csvtojson");
const path = require("path");

const app=express();

mongoose.connect("mongodb+srv://admin-rohan:rohan123@cluster0.exx3m.mongodb.net/excel-db", {useNewUrlParser:true , useUnifiedTopology: true},()=>{
  console.log("connected");
});


app.set('view engine','ejs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  mobile: {
    type: String,
  },
  gender: {
    type: String,
  },
});

const userModel = mongoose.model('users', userSchema);



var storage = multer.diskStorage({
    destination: function (req, file, next) {
      next(null, path.resolve('./excelfiles/my_uploads'))
    },
    filename: function (req, file, next) {
     next(null, file.fieldname + '-' + Date.now())
     console.log(file);
    }
  })

  var upload = multer({ storage: storage })

  app.get("/", function(req,res){
    res.render("home");

  })


  app.get("/list", async function(req,res){
    const users = await userModel.find({});
    console.log(users);
    res.render("list",{
      data:users,
    });
  });

  app.post('/api/upload-csv',upload.single('excel-file'), async function(req,res){

    const parsed = await csvToJson().fromFile(req.file.path);
    console.log(parsed);
    Promise.all(saveToDb(parsed))
    res.redirect("/");


  } )

  // function saveToDb(users) {
  //   if (users.length === 0) return;
  //   return users.map((user) => new User({
  //     name: user.Name, email: user.Email, mobile: user.Mobile, gender: user.Gender,
  //   }).save());
  // }

  
  function saveToDb(users) {
    if (users.length === 0) return;
    return users.map((user) => new userModel({
      name: user.Name, email: user.Email, mobile: user.Mobile, gender: user.Gender,
    }).save());
  }




  

  const port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log('Server started successfully');
});


