const express= require("express");
const bodyParser= require("body-parser");
const mongoose =require("mongoose");
const e = require("express");
const _=require("lodash");

const app =express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://prakhar1:mongodb1@cluster0.dz7mj.mongodb.net/todolistDB",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
 });

 const itemSchema={
     name:String
 };
 const Item=mongoose.model("Item",itemSchema);

const item1=new Item({
    name:"Welcome "
});
const item2=new Item({
    name:"click + to add "
});
const item3=new Item({
    name:"click the checkbox to delete "
});
 const deafaultItems=[item1,item2,item3];

 const listSchema={
     name:String,
     items:[itemSchema]
 };
 const List=mongoose.model("List",listSchema);


app.get("/", function(req,res){
    
    Item.find({},function(err,found){

        if(found.length===0){
            Item.insertMany(deafaultItems, function(err){
                if(err)
                {
                    console.log(err);
                }
                else{
                    console.log("success");
                }
                res.redirect("/");
            
        })}
            else{
                res.render("list", {kindofday:"Today", newlistitem:found});

            }

        })
    })
        

    
    
    



app.post("/", function(req,res){
  
    
    const itemName=req.body.newItem;
    const listName=req.body.list;
    const newitem= new Item({
        name:itemName
    });

    if(listName==="Today"){
        newitem.save();
    res.redirect("/");

    }
    else{
        List.findOne({name:listName},function(err,found){
            found.items.push(newitem);
            found.save();
            res.redirect("/"+listName);
        })
    }
    
    
})


app.post("/delete",function(req,res){
    const checkedItemId=(req.body.checkbox);
    const listName=req.body.listName;
    if(listName==="Today")
    {
        Item.findByIdAndRemove(checkedItemId,function(err){
            if(err)
            {
                console.log(err);
            }
            else{
                res.redirect("/");
            }
        });

    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemId}}},function (err,found){
            if(!err){
                res.redirect("/"+listName);
            }
        } );
    }
    


});

app.get("/:custom",function(req,res){
    // res.render("list",{kindofday:"Work list", newlistitem:workitems});
    const customListNAme=_.capitalize(req.params.custom);
    List.findOne({name:customListNAme}, function(err,foundList){
        if(!err)
        {
            if(!foundList){
                //create a new list
                const list=new List({
                    name:customListNAme,
                    items:deafaultItems
                });
                list.save();
                res.redirect("/"+customListNAme);
            
            }
            else{
            //show existing list
            res.render("list",{kindofday:foundList.name,newlistitem:foundList.items });
            
            }

            
        }
        else{
        }
    });
    

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