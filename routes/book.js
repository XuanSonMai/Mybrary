const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const multer = require('multer')
const path = require('path')
const uploadPath = path.join('public', Book.BasePath)
const fs = require('fs')


const imageMimeTypes =['image/jpeg','image/png','image/gif']
const upload = multer({
    dest:uploadPath,
    fileFilter:(req,file,callback)=>
    {       
        
        callback(null,imageMimeTypes.includes(file.mimetype))
    }
})


//all authors routes
router.get('/',async(req,res)=>
{
    var query = Book.find()
    console.log('find success')
    if(req.query.title !=null && req.query.title != '')
    {
         query = query.regex('title', new RegExp(req.query.title,'i'))
        
    }

    if(req.query.publishedAfter !=null && req.query.publishedAfter != '')
    {
        
         query = query.gte('publishDate', req.query.publishedAfter)
        
    }
    if(req.query.publishedBefore !=null && req.query.publishedBefore != '')
    {
       
         query = query.lte('publishDate',req.query.publishedBefore)
        
    }
    
    
    try {
        const books = await query.exec()
        console.log(books)
        res.render('books/index',{
            books,
            searchOptions : req.query,
            msg:'books'
        })
    } catch (error) {
        res.redirect('/')
    }

})



// new Book
router.get('/new',async (req,res)=>
{
    renderNewPage(res, new Book())
   
})

router.get('/find',async(req,res)=>
{
    
    try {
        const id = req.query.id
      
        const book = await Book.findById(id)
        console.log(book)
        renderNewPage(res,book)
    } catch (error) {
        
    }

})


//create Book route
router.post('/',upload.single('cover'),async(req,res)=>
{

   
    const fileName = req.file !=null ? req.file.filename : null
    const date = new Date(req.body.publishDate).toISOString().split('T')[0]
    console.log('----------')
    console.log(date)
  
    
  
   
    const book = new Book(
        {title:req.body.title,
        author:req.body.author,
        publishDate:'2020-01-01',
        coverImagename: fileName,
        pageCount:req.body.pageCount,        
        description:req.body.description
        }
    )

    try {
        const newBook =await book.save()
        
        res.redirect('books')
    } catch (error) {
        if(book.coverImagename!=null)
        {
            removeBookCover(book.coverImagename)
        }
        
        renderNewPage(res,book, true)
    }
    
})

function removeBookCover(fileName)
{
  fs.unlink(path.join(uploadPath,fileName),err=>
  {
      if(err) console.log(err)
  })
}

async function  renderNewPage(res,book, hasError = false)
{
    try {
        const authors = await Author.find({})
        const params = {
            authors,
            book,
            msg:'books',          
            
        }
        if(hasError) params.errorMessage = ' Error creating Book'
        res.render('books/new',params)
    }   catch (error) {
        res.redirect('/books')
    } 
}

module.exports = router