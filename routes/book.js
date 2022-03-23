const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const path = require('path')
//const uploadPath = path.join('public', Book.BasePath)
const fs = require('fs')


 const imageMimeTypes =['image/jpeg','image/png','image/gif']
// const upload = multer({
//     dest:uploadPath,
//     fileFilter:(req,file,callback)=>
//     {       
        
//         callback(null,imageMimeTypes.includes(file.mimetype))
//     }
// })


//all authors routes
router.get('/',async(req,res)=>
{
    var query = Book.find()

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
router.post('/',async(req,res)=>
{

   
    
    const date = new Date(req.body.publishDate).toISOString().split('T')[0]
 
    
    const book = new Book(
        {title:req.body.title,
        author:req.body.author,
        publishDate:'2020-01-01',
     
        pageCount:req.body.pageCount,        
        description:req.body.description
        }
    )
    saveCover(book,req.body.cover)
    
    try {
        const newBook =await book.save()
        
        res.redirect('books')
    } catch (error) {
    
        renderNewPage(res,book, true)
    }
    
})

function saveCover(book,coverEncoded)
{
    if(coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if(cover !=null && imageMimeTypes.includes(cover.type))   
    {
      book.coverImage = new Buffer.from(cover.data,'base64')
      book.coverImageType= cover.type

    }

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