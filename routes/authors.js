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
    
    let searchOptions = {}
    
    searchOptions = req.query

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



router.post('/',async (req,res)=>
{
    
    const author = new Author({
        name:req.body.name,
        imageName:req.body.imageName
    })

    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
      } catch {
          console.log('Error creating Author')
        res.render('authors/new', {
          author: author,
          errorMessage: 'Error creating Author',
          msg:'authors'
        })
      }


    
})

// new author route
router.get('/new',(req,res)=>
{

    res.render('authors/new',{author: new Author(),
    msg:'authors'})
})
router.get('/:id',async(req,res)=>
{
  
   try {
       const author =await Author.findById(req.params.id)
       
       const books = await Book.find({author:author.id}).exec()
    
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

   
    let author
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name
        author.imageName = req.body.imageName
        await author.save()
     
        res.redirect(`/authors/${author.id}`)
    } catch (error) {
       
        if(author == null)
        {     
            res.render('authors/edit',{
                author,
                errorMessage: ' Error creating Author',
                msg:'authors'
            })
        }
       
    }
})

router.delete('/:id',async (req,res)=>
{
 
    let author
    try {
        await Author.deleteOne({_id:req.params.id})
        
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