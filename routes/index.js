const express = require('express')
const router = express.Router()

router.get('/:d',(req,res)=>
{
    res.render('index',{msg:'HELLO TEST'})
})

module.exports = router