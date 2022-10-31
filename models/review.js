/*

Model folder should contain all direct database access and manipulation
Model files should not include request, response, or view objects
Model files must be created independent of each other. Deleting one model file will not affect the others

*/

const mongoose = require("mongoose")

var commentsSchema = mongoose.Schema({
  // _id: mongoose.Types.ObjectId(),
  comment: String,
  username: String,
  date: String 
})

var reviewSchema = mongoose.Schema({
    title: String,
    content: String,
    author: String,  
    date: String,
    score: Number,
    primaryImage: String,
    secondaryImage: String,
    pros: String,
    cons: String,
    specs: [String],
    verdict: String,
    category: String,
    comments: [
        commentsSchema
    ]
})

reviewSchema.index({content: 'text'});

// post: [
//   {
//       _id: ObjectID(),
//       title: String,
//       content: String,
//       author: String,
//       date: Date,
//       score: Number,
//       picture: [String],
//       pros: [String],
//       cons: [String],
//       specs: [String],
//       verdict: String,
//       type: String,
//       featured: [String],
//       category: {
//           _id: ObjectID(),
//           name: String
//       }
//       comments: [
//           {
//               _id: ObjectID(),
//               comment: String,
//               username: String,
//               date: Date
//           }
//       ]
//   }
// ]

var Review = mongoose.model("review", reviewSchema) 

exports.create = function(review){
  return new Promise(function(resolve, reject){
    var r = new Review(review)

    r.save().then((newReview)=>{
      resolve(newReview)
    }, (err)=>{
      reject(err)
    })
  })
}

exports.all = function(){
  return new Promise(function(resolve, reject){
      Review.find({}).then((review)=>{
          resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.review = function(title){
  return new Promise(function(resolve, reject){
      Review.findOne({title: title}).then((review)=>{
        resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.edit = function(id){
  return new Promise(function(resolve, reject){
      Review.findOne({_id: id}).then((review)=>{
        resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.removespecs = function(id, review){
  return new Promise(function(resolve, reject){
      Review.findOneAndUpdate({_id: id}, {
        $set: {specs: []}
      }).then((review)=>{
        resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.update = function(id, review){
  return new Promise(function(resolve, reject){
      Review.findOneAndUpdate({_id: id}, {
        title: review.title,
        content: review.content,
        date: review.date,
        score: review.score,
        primaryImage:review.primaryImage,
        secondaryImage: review.secondaryImage,
        pros: review.pros,
        cons: review.cons,
        verdict: review.verdict,
        $push: {specs: review.specs}
      }).then((review)=>{
        resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.review = function(title){
  return new Promise(function(resolve, reject){
      Review.findOne({title: title}).then((review)=>{
        resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.reviewC = function(title){
  return new Promise(function(resolve, reject){
      Review.findOne({title: title}).then((review)=>{
          resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.myRev = function(name){
  return new Promise(function(resolve, reject){
      Review.find({author: name}).then((review)=>{
          resolve(review)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.insertComment = function(id, comment){
  return new Promise(function(resolve, reject){
      Review.findOneAndUpdate({_id: id}, { $push: {comments: comment}}, {new : true}).then((user)=>{
          resolve(user)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.deletePost = function(id){
  return new Promise(function(resolve, reject){
      Review.deleteOne({_id: id}).then((post)=>{
          resolve(post)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.search = function(keyword){
  return new Promise(function(resolve, reject){
      Review.find({ $text: { $search: keyword } }).then((reviews)=>{
          resolve(reviews)
      }, (err)=>{
          reject(err)
      })
  })
}

exports.deleteComment = function(title, id){
  return new Promise(function(resolve, reject){
      Review.findOneAndUpdate({title: title}, { $pull: { comments: {_id: id}}}).then((user)=>{
          resolve(user)   
      }, (err)=>{
          reject(err)
      })
  })
}

exports.updateComment = function(title, comment){
  return new Promise(function(resolve, reject){
      Review.findOneAndUpdate({title: title}, { $push: { comments: comment }}).then((user)=>{
          resolve(user)   
      }, (err)=>{
          reject(err)
      })
  })
}
