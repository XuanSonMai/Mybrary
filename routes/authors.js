const express = require('express')
const router = express.Router()
const Author = require('../models/author')


//all authors route
router.get('/',async(req,res)=>
{
    const searchOptions = {}
    
    if(req.query.name !=null && req.query.name !=='')
      
    {
        //searchOptions.name = new ReqExp(req.query.name, 'i')
    }
    try {
        const authors= await Author.find(searchOptions)
        res.render('authors/index',{authors,
        searchOptions: req.query})
       
    } catch (error) {
        res.redirect('/')
    }
    
})



// new author route
router.get('/new',(req,res)=>
{
    
    res.render('authors/new',{author: new Author()})
})


//create author route
router.post('/',(req,res)=>
{
    
    const author = new Author({
        name:req.body.name
    })
    author.save((err,newAuthor)=>
    {
        if(err)
        {

        }
    })
    
})

module.exports = router