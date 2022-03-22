const express = require('express')
const router = express.Router()
const Author = require('../models/author')


//all authors route
router.get('/',async(req,res)=>
{
    const searchOptions = {}
    Author.deleteMany({})
    console.log(req.options)
    // if(req.options.name !=null && req.options.name !=='')
      
    // {
    //     searchOptions.name = req.options.name
    // }
    try {
        const authors= await Author.find(searchOptions)
        res.render('authors/index',{authors,
        searchOptions: req.query,msg:'authors'})
       
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
router.post('/',(req,res,next)=>
{
    
    const author = new Author({
        name:req.body.name
    })

    //console.log(author)
    author.save((err,newAuthor)=>
    {
        if(err)
        {

        }
        else
        {
            req.options= req.body.name
            res.redirect('/authors')
        }
    })
    
})

module.exports = router