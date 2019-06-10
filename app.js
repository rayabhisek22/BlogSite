var express = require('express'),
    app     = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    expressSanitizer = require('express-sanitizer');
    methodOverride = require('method-override');

//APP CONFIG
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

mongoose.connect("mongodb://localhost:27017/blogSite",{useNewUrlParser:true},function(err){
  if(err) console.log("error");
  else {
    console.log("connected!");
  }
});
mongoose.set('useFindAndModify', false);

//MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
  title:String,
  image:{type:String,default:"plaeceholderimage.jpg"},
  body:String,
  created:{type:Date,default:Date.now}
});

var blog = mongoose.model("blog",blogSchema);
//RESTFUL ROUTES

//HOME route
app.get("/",function(req,res){

  res.redirect("blogs");
});

//INDEX ROUTE
app.get("/blogs",function(req,res){
  blog.find({},function(err,blogs){
    if(err){
      console.log("Error in finding the blog!!!");
      console.log(err);
    }else{
      res.render("index",{blogs:blogs});
    }
  })

});

//NEW ROUTE
app.get("/blogs/new",function(req,res){
  res.render("new");
});

//CREATE ROUTE
app.post("/blogs",function(req,res){
  blog.create(req.body.blog,function(err,blog){
    if(err){
      console.log(err);
    }else{
      console.log("New blog created!");
      console.log(blog);
    }
  })
  res.redirect("/blogs");
});

//SHOW ROUTE
app.get("/blogs/:id",function(req,res){
  var thisBlog = blog.findById(req.params.id,function(err,blog){
    if(err){
      console.log(err);
    }else{
      res.render("show",{blog:blog});
    }
  });

});

//EDIT ROUTE==================
app.get("/blogs/:id/edit",function(req,res){
    blog.findById(req.params.id,function(err,thisblog){
    if(err){
      res.render("index");
    }else{
      res.render("edit",{blog:thisblog});
    }
  });

});

//UPDATE ROUTE=================
app.put("/blogs/:id",function(req,res){
  blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs/"+req.params.id);
    }
  });
});

//DESTROY ROUTE==============
app.delete("/blogs/:id",function(req,res){
  blog.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect("/blogs");
    }else{
      res.redirect("/blogs");
    }
  });
});

app.listen(8080,function(){
  console.log("BlogSite has started!");
});
