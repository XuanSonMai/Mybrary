const express = require('express')
const router = express.Router()
const Book = require ('../models/book')

router.get('/',(req,res)=>
{
    let books
    try {
        books = await Book.find().sort({createdAt:'desc'}).limit(10).exec()
    } catch (error) {
        books=[]
    }
    res.render('index',{books})
})

module.exports = router