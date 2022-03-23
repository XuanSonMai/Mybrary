const express = require('express');
const author = require('../models/author');
const router = express.Router()
const Author = require('../models/author')
const imageArrays = ['']

//all authors route
let dem = 0;

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
            res.redirect('/authors')
        }
    })
    
})



// new author route
router.get('/new',(req,res)=>
{
    
    res.render('authors/new',{author: new Author(),
    msg:'authors'})
})


//create author route


router.get('/:id',async(req,res)=>
{

    
    console.log('get by id')
   let author = await Author.find({_id:req.params.id})
   console.log(author)
   res.json({author})
   
})

router.get('/:id/edit',(req,res)=>
{
   console.log('edit')
    res.send('Edit author '+ req.params.id)
})

router.put('/:id/update',(req,res)=>
{
    console.log('update')
    res.send('Update author '+ req.params.id)
})

router.get('/:id/delete',async (req,res)=>
{

   await Author.deleteOne({_id:req.params.id})
   res.redirect('/authors')
})

module.exports = router