/*

Controllers folder should contain all routes dedicated to the particular document
Controllers should not directly access and manipulate the db, it should access the models folder files

index.js should route all prefix paths to the proper controller files
index.js should set the home/index page
index.js should be named index.js, because server.js just refers to the controllers folder, which assumes an index file

*/

const hbs = require("hbs")
const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user")
const Review = require("../models/review")
const Category = require("../models/category")

// load all the controllers into router
router.use("/review", require("./review"))
router.use("/user", require("./user"))
router.use("/category", require("./category"))


hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('times', function(arg1) {
    return (arg1 * 10)
});

// hbs.registerHelper('each_start', function(ary, max, options) {
//     if(!ary || ary.length == 0)
//         return options.inverse(this);

//     var result = [ ];
//     for(var i = 0; i < max && i < ary.length; ++i){
//         result.push(options.fn(ary[i]));
        
//     }
//     return result.join('');
// });
var c;
hbs.registerHelper('each_rev', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    var d=0;
    var i;
    while(d < max) {
        i = ary.length-c-1;
        ++c;
        console.log("i=" + i);
        console.log("c=" + c);
        console.log("d=" + d);
        console.log("max=" + max);
        console.log("ary=" + ary.length);

        result.push(options.fn(ary[i]));
        d++;
    }
    
    return result.join('');
});


hbs.registerHelper('each_cat', function(ary, max, options) {
    if(!ary || ary.length == 0)
        return options.inverse(this);

    var result = [ ];
    for(var i = 0; i < max && i < ary.length; ++i){
        result.push(options.fn(ary[i]));

    }
    return result.join('');
});




router.get('/', (req,res) =>{
    //access the homepage
    //logged in
    c=0;
    let user = {
        username: req.session.username,
        role : req.session.role
    }
    if(req.session.username){
        // if (req.session.username == "admin"){
        //     req.session.admin = "admin"
        
        Review.all().then((doc)=>{
            Category.all().then((categories)=>{
            res.render('index.hbs', {
                user, review : doc, categories: categories                
            })
        })
        })
    //not logged in
    }else{
        
        Review.all().then((doc)=>{
            Category.all().then((categories)=>{
                res.render('index.hbs', {
                    review : doc, categories: categories
                
                })
            })
        })
    }
})

router.get("/signout", (req, res) =>{
    req.session.destroy()
    res.redirect("/")
})

module.exports = router

