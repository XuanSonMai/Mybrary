const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')

const path = require('path')
//const uploadPath = path.join('public', Book.BasePath)
const fs = require('fs')
const { redirect } = require('express/lib/response')
const req = require('express/lib/request')
const res = require('express/lib/response')
const console = require('console')


 const imageMimeTypes =['image/jpeg','image/png','image/gif']
// const upload = multer({
//     dest:uploadPath,
//     fileFilter:(req,file,callback)=>
//     {       
        
//         callback(null,imageMimeTypes.includes(file.mimetype))
//     }
// })


//all book routes
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

router.put('/:id',async (req,res)=>
{
let book

try {
    book = await Book.findById(req.params.id)
    book.title=req.body.title
    book.author=req.body.author
    book.publishDate=new Date(req.body.publishDate)
    book.pageCount = req.body.pageCount
    book.description = req.body.description
    if(req.body.cover !=null && req.body.cover != '')
    {
        saveCover(book,req.body.cover)
    }
    await book.save()
    res.redirect(`${book.id}`)
} catch (error) {
    console.log(error)
    if(book)
    {
        renderEditPage(res,book,true)
    }
    else
    {
        redirect('/')
    }
}
   
   
})

// creat Book
router.get('/new',async (req,res)=>
{
    renderNewPage(res, new Book())
   
})

//get book by Id
router.get('/:id',async (req,res)=>
{
     
      
    try {
        
        let book = await Book.findById({_id:req.params.id}).populate('author').exec()
        console.log(book.id)
        if(!book.coverImage)
        {
            await Book.deleteOne({_id:book.id})
            res.redirect(`/books`)
        }
        res.render('books/show',{
            book,
            msg:"Books"
        })
      
    } catch (error) {
       console.log(error)
    }  
})


// new Book
router.get('/new',async (req,res)=>
{
    renderNewPage(res, new Book())
   
})

//Edit by id
router.get('/:id/edit',async (req,res)=>
{     

    try {

        const book = await Book.findById(req.params.id)

        renderEditPage(res,book)
    } catch (error) {
        res.redirect('/')
    }
})

//delete book
router.delete('/:id',async(req,res)=>
{

   
   let book
  
     
     try {
         if(req.body.count==0)
         {
            book=await Book.findByIdAndRemove({_id:req.params.id})
            res.redirect(`/books`)
           
         }
         else
         {
             book= await Book.findById({_id:req.params.id})
            
             book.pageCount = req.body.count
          console.log(book)
             await book.save()
         }
        res.redirect(`/books/${req.params.id}`)
         
     } catch (error) {
      console.log(error)
     }
}
)



router.get('/find',async(req,res)=>
{

    try {
        const id = req.query.id
      
        const book = await Book.findById(id)

        renderNewPage(res,book)
    } catch (error) {
        
    }

})


//create Book route
router.post('/',async(req,res)=>
{
     
  
   let book
    try {
        const date = new Date(req.body.publishDate).toISOString().split('T')[0]    
        const book = new Book(
            {title:req.body.title,
            author:req.body.author,
            publishDate:date,     
            pageCount:req.body.pageCount,        
            description:req.body.description
            }
        )
     
        saveCover(book,req.body.cover)
       await book.save()
        console.log('succes')
        res.redirect('books')
    } catch (error) {
      
       if(!book)
       {
           book= new Book()
           renderNewPage(res,book, true)
       }
            
            
      
        
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

async function renderEditPage (res,book,hasError = false)
{
    renderFormPage(res,book,'edit',hasError)
}

async function  renderFormPage(res,book,form,hasError =false)

{

   if(!book)
   {
  book = new Book()
   }
   
    try {
        const authors = await Author.find({})
        const params = {
            authors,
            book,
            msg:'books',                      
        }
        if(hasError){
            if(form=="edit")
            {
                params.errorMessage = 'Error Updating Book'
            }
            else
            {
              
                
                params.errorMessage = 'Error Creating Book'
            }
            console.log(params.errorMessage)
            
            console.log(book)
            
        } 

       
        res.render(`books/${form}`,params)

       
    }   catch (error) {
     res.send('error')
    } 
}




async function  renderNewPage(res,book, hasError = false)
{



   renderFormPage(res,book,'new',hasError)
}

module.exports = router