const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user")  
const Review = require("../models/review")
const Category = require("../models/category")
const moment =require("moment")

const app = express() 

const urlencoder = bodyparser.urlencoded({
    extended : true
})

router.use(urlencoder)

router.get("/", function(req, res){
    //User goes to Categories page
    let user = {
        username: req.session.username,
        role : req.session.role
    }
    Review.all().then((docs)=>{
        res.render('reviews.hbs', {
            user, review : docs
        })
    })
})

router.post("/ReviewPost/:title", urlencoder, function(req, res){
    //user want to view review post
    let user2 = {
        username: req.session.username,
        name: req.session.name,
        role : req.session.role
    }

    let title = req.body.revid
    console.log(title)
    User.get(req.session.username).then((user)=>{
        Review.review(title).then((doc)=>{
            res.render('reviewpost.hbs', {
                user, review: doc, user
            })
        })
    })
    
})

router.post("/ReviewPostC", urlencoder, function(req, res){
    //user want to view review post
    let user = {
        username: req.session.username,
        name: req.session.username,
        role : req.session.role
    }

    let title = req.body.revtitle
    Review.reviewC(title).then((doc)=>{
        console.log(doc)
        res.render('reviewpost.hbs', {
            user, review: doc
        })
    })
})

// Test Run for views

router.get('/searchResult', urlencoder, (req,res) =>{
    //User search something -> search results
    let user = {
        username: req.session.username,
        role : req.session.role
    }
    let keyword = req.query.search
    // let keyword = req.body.search
    
    console.log("keyword is " + keyword)

    Review.search(keyword).then((docs)=>{
        if(docs.length > 0){
            res.render('search.hbs', {
                user, reviews: docs, keyword
            })
        } 
        else{
            res.render('search.hbs', {
                user, error: "No match found", keyword
            })
        }
    })
    
})

router.get("/manage-reviews", function(req, res){
    let user = {
        username: req.session.username,
        name: req.session.name,
        role : req.session.role
    }
    if(user.role == "admin"){
        Review.all().then((docs)=>{
            Category.all().then((categories)=>{
                res.render('managepost.hbs', {
                    user, reviews : docs, categories: categories
                })
            })
        })
    }else{
        Review.myRev(req.session.name).then((docs)=>{
            Category.all().then((categories)=>{
                res.render('managepost.hbs', {
                    user, reviews : docs, categories: categories
                })
            })
        })
    }
    
    //Going to register page
    
})

router.post("/add-review", urlencoder, function(req, res){

    let user = { 
        username: req.session.username,
        name: req.session.name,
        role : req.session.role
    }

    let momentdate = moment().format('MMMM DD YYYY');
    
    // console.log("date is "+ test)
    let review = {
        title: req.body.title,
        content: req.body.content,
        author: req.session.name,
        date: momentdate,
        score: req.body.score,
        primaryImage: req.body.primaryImage,
        secondaryImage:  req.body.secondaryImage,
        specs: [],
        pros:  req.body.pros,
        cons:  req.body.cons,
        verdict:  req.body.verdict,
        category:  req.body.category
    }

    for(i = 0; i < req.body.counter; i++) {
        review.specs.push(req.body.name[i])
    }

    Review.create(review).then((doc) =>{
        console.log("Added Review successful")
    })
    
    Category.insert(req.body.category, review).then((doc) =>{
        console.log("Review added in the category")
    })

    User.insert(req.session.username, review).then((doc) =>{
        console.log("Review added in the user's review")
    })

    res.redirect('manage-reviews')
})

router.post("/edit", urlencoder,(req,res)=>{
    let id =req.body.id
    let title =req.body.title

    console.log("ID= "+id)
    console.log("Title= "+ title)
    
    Review.edit(id).then((doc)=>{
        res.render('edit.hbs', {
            review : doc
        })  
    })
})

router.post("/update", urlencoder,(req,res)=>{
    let user = { 
        username: req.session.username,
        name: req.session.name,
        role : req.session.role
    }

    let momentdate = moment().format('MMMM DD YYYY');
    let id=req.body.id
    let category = req.body.category

    // console.log("date is "+ test)
    let review = {
        title: req.body.title,
        content: req.body.content,
        date: momentdate,
        score: req.body.score,
        primaryImage: req.body.primaryImage,
        secondaryImage:  req.body.secondaryImage,
        specs: [],
        pros:  req.body.pros,
        cons:  req.body.cons,
        verdict:  req.body.verdict,
    }

    let review2 = {
        title: req.body.title,
        content: req.body.content,
        date: momentdate,
        score: req.body.score,
        primaryImage: req.body.primaryImage
    }

    for(i = 0; i < req.body.counter; i++) {
        review.specs.push(req.body.name[i])
    }
    console.log("ID is "+ id)
    console.log("counter "+ req.body.counter)
    console.log(review.specs)
    
    User.deletePost(req.body.author, req.body.oldtitle).then((doc)=>{
        User.updateRev(req.body.author,review2).then((doc) =>{
            console.log("Review added in the user's review")
        })
    })

    Category.deletePost(category, req.body.oldtitle).then((doc)=>{
        Category.update(req.body.category, review2).then((doc) =>{
            console.log("Review added in the category")
        })
    })

    Review.removespecs(id, review).then((doc) =>{
        Review.update(id, review).then((doc) =>{
            console.log("updated Review successful")
        })
    })

    res.redirect('manage-reviews')
})

router.post("/delete-post", urlencoder, function(req, res){

    let id = req.body.id
    let title = req.body.title
    let author = req.body.author
    let category = req.body.category


    console.log(author)
    console.log(title)
    console.log(category)

    User.deletePost(author, title).then((doc)=>{
        console.log("removed in users")
    })

    Category.deletePost(category, title).then((doc)=>{
        console.log("removed in category")
    })

    Review.deletePost(id).then((doc)=>{
        if(doc.n) {
            res.send(true)
        }else{
            res.send(false)
        }
    })
})

router.post("/comment", urlencoder, function(req, res){

    console.log("COMMENTS ")
    let momentdate = moment().format('LLL');

    console.log(momentdate)

    let commentObj = {
        comment: req.body.comment,
        username: req.body.name,
        date: momentdate 
    }

    let user = {
        username: req.session.username,
        role : req.session.role
    }

    var id = req.body.id
    var title = req.body.title

    
    User.insertComment(req.session.username, commentObj).then((doc)=>{
        console.log("Comment inserted in users")
    })

    Review.insertComment(id, commentObj).then((doc)=>{
        let n = doc.comments.length
        let newId = doc.comments[n-1]._id
        let newDoc ={
            newID : newId,
            date: momentdate
        }
        if(doc){
            res.send(newDoc)
        }else{
            res.send(false)
        }
    }, (err) =>{
        res.send(false)
    })
})

router.post("/edit-comment", urlencoder, function(req, res){
    let id = req.body.id
    let username = req.body.username
    let userid = req.body.userid
    let title = req.body.title
    let oldcomment = req.body.comment
    let newComment = req.body.newComment
    let momentdate = moment().format('LLL');

    let comment = {
        comment: newComment,
        username: username,
        date: momentdate
    }

    console.log(title)
    console.log(id)
    console.log(userid)
    console.log(oldcomment)
    console.log(newComment)
    console.log(comment)

    User.deleteComment(username, oldcomment).then((doc)=>{
        User.updateComment(username, comment).then((doc)=>{
            console.log("deleted comment in users")
        })
    })

    Review.deleteComment(title, id).then((doc)=>{
        console.log("deleted" + doc)
        Review.updateComment(title, comment).then((doc)=>{
            console.log("deleted comment in Review")
            if(doc) {
                res.send(true)
            }else{
                res.send(false)
            }
        })
    })
    
})

router.post("/delete-comment", urlencoder, function(req, res){
    let id = req.body.id
    let username = req.body.username
    let userid = req.body.userid
    let title = req.body.title
    let comment = req.body.comment
    
    console.log(title)
    console.log(userid)
    console.log(id)
    console.log(comment)

    User.deleteComment(username, comment).then((doc)=>{
        console.log("deleted comment in users")
    })

    Review.deleteComment(title, id).then((doc)=>{
        console.log(doc)
        if(doc) {
            res.send(true)
        }else{
            res.send(false)
        }
    })
})

module.exports = router