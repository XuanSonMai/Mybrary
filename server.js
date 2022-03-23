const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path=require('path')
const bodyParser = require ('body-parser')
require('dotenv').config();
const methodOverride = require('method-override')
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors')
const bookRouter = require('./routes/book')



//set views and layouts
app.set('view engine','ejs')
const pathViews = path.join(__dirname,'views')
app.set('views', pathViews )
app.set('layout',path.join(pathViews,'layouts/layout' ))
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({limit:'10mb',extended:false}))


//mongoose
const mongoose=require('mongoose')


mongoose.connect('mongodb://127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',{
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error',err => console.error(err))
db.once('open',() => console.log('Connect Success'))


app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)


app.listen( 2000)
