const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user")
const path = require("path")
const app = express()

const urlencoder = bodyparser.urlencoded({
    extended : true
})

router.use(urlencoder)

router.post("/register", urlencoder, function(req, res){
    var user = {
        name: req.body.name,
        username : req.body.un,
        password : req.body.pw,
        email: req.body.em,
        picture: "https://drive.google.com/uc?id=1BkWRXc74IlkwBQNRhNwCmF9UAjXjvJU0",
        role: "user",
    }

    //get user in database
    User.get(user.username).then((same)=>{
        //if user is found (already registered) -> show error
        if(same){
            res.render("register.hbs", {
                error: "username already exist"
            })
        }
        // input fields are left blank -> show error
        else if(user.username.trim() == "" || user.password.trim() == ""){
            res.render("register.hbs", {
                error: "Enter a username and password"
            })
        }
        // can register
        else{
            User.create(user).then((user)=>{
            console.log("successful " + user)
            req.session.username = user.username
            req.session.name = user.name
            req.session.role = user.role
            res.redirect("/")
            },(error)=>{
                res.render("register.hbs", {
                error : "some error in registering: " + error
                })
            })
        }
    })
})


router.post("/login", urlencoder, function(req, res){
    var user = {
        username : req.body.un,
        password : req.body.pw,
    }
    //input fields left blank
    if(user.username.trim() == "" || user.password.trim() == ""){
        res.render("login.hbs", {
            error: "Enter a username and password"
        })
    }
    User.log(user.username, user.password).then((user)=>{
        if(user){
            req.session.username = user.username
            req.session.name = user.name
            req.session.role = user.role
            res.redirect("/")
        }
        else{
            res.render("login.hbs", {
                error: "username and password does not match"
            })
        }
    }) 
})

//route to register page
router.get("/register", function(req, res){
    //Going to register page
    res.render('register.hbs')
})

// Router to login page
router.get("/login", function(req, res){
    //Going to register page
    res.render('login.hbs')
})

//Router to user profile  - read user data
router.get("/user-profile" , function(req, res) {
    // let user = {
    //     username: req.session.username,
    //     role : req.session.role
    // }
    let username = req.session.username
    console.log("username is " + username)
    User.get(username).then((user)=>{
        console.log(user)
        res.render('userprofile.hbs', {
            user
        })
    })
    
})

//Update profile information
router.post("/update-profile" , urlencoder, function(req, res) {
    // let user = {
    //     username: req.session.username,
    //     role : req.session.role
    // }

    let id = req.body.id
    let name = req.body.name
    let username = req.body.un
    let email = req.body.email
    let password = req.body.pw


    User.update(id, name, username, email, password).then((user)=>{
        req.session.username = username
        req.session.save( function(err) {
            req.session.reload( function (err) {
                res.redirect("user-profile")
            });
        });
        
    })
})

router.post("/edit-picture" , urlencoder, function(req, res) {
    // let user = {
    //     username: req.session.username,
    //     role : req.session.role
    // }

    let id = req.body.id
    let picture = req.body.picture

    console.log("id is "+ id)
    console.log("picture is "+ picture)

    User.updatePicture(id, picture).then((user)=>{
        console.log("updated picture")
        res.redirect("user-profile")
    })
})

//router to manage user page
router.get("/manage-users", function(req, res){
    let user = {
        username: req.session.username,
        role : req.session.role
    }
    
    User.manageUser(req.session.username).then((users)=>{
        res.render('manageusers.hbs', {
            user, users
        })
    })
})

router.post("/edit-role", function(req, res){
    // let user = {
    //     username: req.session.username,
    //     role : req.session.role
    // }
    
    let id = req.body.editid
    let role = req.body.role
    
    console.log(id)
    console.log(role)
    
    User.editRole(id, role).then((doc)=>{
        res.redirect("manage-users")        
    })
})

router.post("/delete-user", function(req, res){
    let id = req.body.id
    
    console.log(id)
    
    User.deleteUser(id).then((doc)=>{
        if(doc.n){
            res.send(true)
        }else{
            res.send(false)
        }    
    })
})


module.exports = router