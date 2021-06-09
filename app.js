const express= require("express");
const bodyParser= require("body-parser");
const date = require(__dirname+"/date.js");


const app =express();
const items=["buy food", "cook food", "eat food"];
let workitems =[];
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/", function(req,res){
    let day=date.getDate();
    
    res.render("list", {kindofday:day, newlistitem:items});
});


app.post("/", function(req,res){
  
    
    let item=req.body.newItem;
    if(req.body.list ==="Work"){
        workitems.push(item);
        res.redirect("/work");
    }
    else{
    items.push(item);
    res.redirect("/");
    }
})

app.get("/work",function(req,res){
    res.render("list",{kindofday:"Work list", newlistitem:workitems});
});

app.post("/work", function(req,res){
    let item= req.body.kindofday;
    workitems.push(item);
    res.redirect("/work");
})

app.get("/about", function(req,res){
    res.render("about")
});





app.listen(3000, function(){
    console.log("server is runnig")
});