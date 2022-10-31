/*

Model folder should contain all direct database access and manipulation
Model files should not include request, response, or view objects
Model files must be created independent of each other. Deleting one model file will not affect the others

*/

const mongoose = require("mongoose") 
require('mongoose').Types
const crypto = require("crypto")

var reviewSchema = mongoose.Schema({
    // _id: mongoose.Types.ObjectId(),
    title: String,
    author: String,
    date: String,
    content: String,
    primaryImage: String   
})

var commentsSchema = mongoose.Schema({
    // _id: mongoose.Types.ObjectId(),
    comment: String,
    username: String,
    date: String 
})

var userSchema = mongoose.Schema({
    username: String,
    name: String,
    email: String,
    password: String,
    picture : String,
    role: String,
    reviews:[
        reviewSchema
    ],
    comments :[
        commentsSchema
    ]
})

// users: [
//   {
//       id: ObjectID(),
//       username: String,
//       name: String,
//       password: String,
//       picture: String,
//       role: String,
//       post:[
//           {
//               _id: ObjectID(),
//               content: String,
//               date: Date
//           }
//       ]
//   }
// ]

userSchema.pre("save", function(next){
    this.password = crypto.createHash("md5").update(this.password).digest("hex")
    next()
})

var User = mongoose.model("user", userSchema)

exports.create = function(user){
    return new Promise(function(resolve, reject){
        console.log(user)
        var u = new User(user)
        u.save().then((newUser)=>{
            console.log(newUser)
            resolve(newUser)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.authenticate = function(user){
    return new Promise(function(resolve, reject){
        console.log("in promise : " + user.username)
        User.findOne({
            username : user.username,
            password : crypto.createHash("md5").update(user.password).digest("hex")
        }).then((user)=>{
            console.log("callback user : " + user)
            resolve(user) 
        },(err)=>{
            reject(err)
        })
    })
}

exports.get = function(username){
    return new Promise(function(resolve, reject){
        User.findOne({username: username}).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err) 
        })
    })
}

exports.log = function(username, password){
    return new Promise(function(resolve, reject){
        User.findOne(
            {username: username, 
            password: crypto.createHash("md5").update(password).digest("hex")
        }).then((user)=>{
            console.log("callback user : " + user)
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.all = function(){
    return new Promise(function(resolve, reject){
        User.find({}).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.manageUser = function(user){
    return new Promise(function(resolve, reject){
        User.find({ username: { $nin: user } }).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.specific = function(username){
    return new Promise(function(resolve, reject){
        User.find({username: username}).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}


exports.insert = function(username, review){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({username: username}, { $push: {reviews: review}}).then((user)=>{
            console.log(JSON.stringify(user))
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.insertComment = function(username, comment){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({username: username}, { $push: {comments: comment}}).then((user)=>{
            // console.log(JSON.stringify(user))
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}


exports.update = function(id, name, username, email, password){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({_id: id}, {name: name, username: username, email: email, password: crypto.createHash("md5").update(password).digest("hex")}  ).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}


exports.updatePicture = function(id, picture){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({_id: id}, {picture: picture} ).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
}

exports.editRole = function(id, role){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({_id: id}, {role: role}).then((user)=>{
            resolve(user)
        }, (err)=>{
            reject(err)
        })
    })
} 

exports.deleteUser = function(id){
    return new Promise(function(resolve, reject){
        User.deleteOne({_id: id}).then((user)=>{
            resolve(user)   
        }, (err)=>{
            reject(err)
        })
    })
}

// exports.getID = function(title){
//     return new Promise(function(resolve, reject){
//         User.find({reviews: {$elemMatch: {title: title}}}).then((user)=>{
//             resolve(user)
//         }, (err)=>{
//             reject(err)
//         })
//     })
// }

exports.deletePost = function(author, title){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({name: author}, { $pull: { reviews: {title: title}}}).then((user)=>{
            resolve(user)   
        }, (err)=>{
            reject(err)
        })
    })
    
}

exports.updateRev = function(author, review){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({name: author}, { $push: { reviews: review }}).then((user)=>{
            resolve(user)   
        }, (err)=>{
            reject(err)
        })
    })
}

exports.deleteComment = function(username, comment){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({username: username}, { $pull: { comments: {comment: comment}}}).then((user)=>{
            resolve(user)   
        }, (err)=>{
            reject(err)
        })
    })
}

exports.updateComment = function(username, comment){
    return new Promise(function(resolve, reject){
        User.findOneAndUpdate({username: username}, { $push: { comments: comment }}).then((user)=>{
            resolve(user)   
        }, (err)=>{
            reject(err)
        })
    })
}