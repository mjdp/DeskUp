const express = require("express")
const router = express.Router()
const bodyparser = require("body-parser")
const User = require("../models/user")
const Review = require("../models/review")
const Category = require("../models/category")  

const app = express()

const urlencoder = bodyparser.urlencoded({
    extended : true
})

router.use(urlencoder)

router.get('/', (req,res) =>{
    //User goes to Categories page
    let user = {
        username: req.session.username,
        role : req.session.role
    }
    Category.all().then((doc)=>{
        res.render('categories.hbs', {
            user, category: doc
        })
    
    })
    
})

router.post("/add-category", urlencoder, function(req, res){

    let user = { 
        username: req.session.username,
        name: req.session.name,
        role : req.session.role
    }
    let category = {
        name: req.body.name,
        description: req.body.desc,
        picture: req.body.picture,
        icon: req.body.icon,
    }

    Category.create(category).then((doc) =>{
        console.log("New category added" + doc)
    })

    res.redirect('/review/manage-reviews')
})


router.post("/specificCategory" , function(req, res) {
    let user = {
        username: req.session.username,
        role : req.session.role
    }

    let categoryName = req.body.nameC
    
    Category.specific(categoryName).then((doc)=>{        
        res.render('category.hbs', {
            user, category: doc
        })
    })
    
})

module.exports = router