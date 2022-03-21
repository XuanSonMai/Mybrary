const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const path=require('path')
require('dotenv').config();

const indexRouter = require('./routes/index')


//set views and layouts
app.set('view engine','ejs')
const pathViews = path.join(__dirname,'views')
app.set('views', pathViews )
app.set('layout',path.join(pathViews,'layouts/layout' ))
app.use(expressLayouts)
app.set(express.static('public'))

//mongoose
const mongoose=require('mongoose')
mongoose.connect('//127.0.0.1:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',{
    useNewUrlParser: true
})
const db = mongoose.connection
db.on('error',err => console.error(err))
db.once('open',() => console.log('Connect Success'))


app.use('/',indexRouter)

app.listen(process.env.PORT || 3000)
