const express = require('express');
const author = require('../models/author');
const router = express.Router()
const Author = require('../models/author')
const Book = require('../models/book')
const imageArrays = ['']

//all authors route


// get all
router.get('/',async(req,res)=>
{
    
    const searchOptions = {}

    try {
        const authors= await Author.find(searchOptions)
        
        
        
        res.render('authors/index',{authors,
        searchOptions: req.query,
        msg:'authors', imageSrc :'',}
       
        )
       
    } catch (error) {
        res.status(404).json('error')
    }
    
})



router.post('/',(req,res)=>
{
    

    const author = new Author({
        name:req.body.name,
        imageName:req.body.imageName
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
            res.redirect('/authors/new')
        }
    })
    
})

// new author route
router.get('/new',(req,res)=>
{
    console.log('new')
    res.render('authors/new',{author: new Author(),
    msg:'authors'})
})
router.get('/:id',async(req,res)=>
{
  
   try {
       const author =await Author.findById(req.params.id)
       
       const books = await Book.find({author:author.id}).limit(1).exec()
       console.log(books)
       res.render('authors/show',{
           author,
           booksByAuthor: books,
           msg:'Books'
       })
   } catch (error) {
       res.send('Error')
   }

   
})



//create author route




router.get('/:id/edit',async(req,res)=>
{

    try {
        const author = await Author.findById(req.params.id)
        res.render('authors/edit',{author,msg:'authors'})
    } catch (error) {
       
        res.redirect('')
    }
})

router.put('/:id',async(req,res)=>
{

    console.log(locals)
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        console.log(typeof req.body.name)
        console.log(req.body.name)
         await author.save()
         res.redirect(`${req.params.id}`)
    } catch (error) {
        if(author == null)
        {
          
            res.redirect('/authors')
        }
        res.render('authors/edit',{
            author,
            errorMessage: ' Error creating Author'
        })
    }
})

router.delete('/:id',async (req,res)=>
{
    let author
    try {
         author=await  Author.findById({_id:req.params.id})
         await author.remove()
         console.log(author)
        res.redirect('/authors')
    } catch (error) {
      if(author==null)
      {
          res.redirect('/')
      } 
      else
      {
          res.redirect(`${author.id}`)
      }
    }
 
   
 
})

module.exports = router