/*

Model folder should contain all direct database access and manipulation
Model files should not include request, response, or view objects
Model files must be created independent of each other. Deleting one model file will not affect the others

*/

const mongoose = require("mongoose")

var reviewSchema = mongoose.Schema({
    title: String,
    author: String,
    date: String,
    content: String,
    primaryImage: String   
})

var categorySchema = mongoose.Schema({
    name: String,
    description: String,
    picture: String,
    icon: String,
    reviews:[
      reviewSchema  
    ]
})



// category: [
//   {
//       _id: ObjectID(),
//       name: String,
//       picture: String,
//       icon: String
//   }
// ]

var Category = mongoose.model("category", categorySchema)

exports.create = function(category){
  return new Promise(function(resolve, reject){
    var c = new Category(category)
    c.save().then((newCategory)=>{
      resolve(newCategory)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.all = function(){
  return new Promise(function(resolve, reject){
      Category.find({}).then((category)=>{
          resolve(category)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.specific = function(name){
  return new Promise(function(resolve, reject){
      Category.findOne({name: name}).then((category)=>{
          resolve(category)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.insert = function(name, review){
  return new Promise(function(resolve, reject){
      Category.findOneAndUpdate({name: name},{ $push: {reviews: review}}).then((category)=>{
          resolve(category)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.deletePost = function(category, title){
  return new Promise(function(resolve, reject){
      Category.findOneAndUpdate({name: category}, { $pull: { reviews: {title: title}}}).then((user)=>{
          resolve(user)   
      }, (err)=>{
          reject(err)
      })
  })
}

exports.update = function(category, review){
  return new Promise(function(resolve, reject){
      Category.findOneAndUpdate({name: category}, { $push: { reviews: review}}).then((user)=>{
          resolve(user)   
      }, (err)=>{
          reject(err)
      })
  })
}