/*

app.js file does all the set-up
app.js passes the routing to the controllers folder
app.js starts the server

*/

const express = require("express")
const bodyparser = require("body-parser")
const hbs = require("hbs")
const mongoose = require("mongoose")
const session = require("express-session")
const path = require("path")
const app = express()

mongoose.Promise = global.Promise
mongoose.connect("mongodb+srv://DeskUp-User:DeskUp-User1224@cluster0.o3pdp.mongodb.net/DeskUp-db?retryWrites=true&w=majority", {
    useNewUrlParser:true,
    useUnifiedTopology: true
})

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true)

app.set("view engine", "hbs")
app.use(express.static(__dirname + "/public"))
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/bootjs', express.static(__dirname + '/node_modules/bootstrap/dist/js'));

app.use(session({
    secret: "very secret",
    resave: false,
    saveUninitialized: true,
    cookie:{
        maxAge: 1000 * 60 * 60 * 60
    }
}))

app.use(require("./controllers"))

app.listen(process.env.PORT || 3000, ()=> { 
    console.log("Server ready")
})

